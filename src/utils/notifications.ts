// Web Audio, Device Notification & Web Push utilities for Admin Live Alerts
import { api } from "@/api/client";

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    return null;
  }
}

/**
 * Play a double-chime notification sound using Web Audio API (no external file needed).
 */
export function playNotificationSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // First chime note (E5 - 659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Second chime note (A5 - 880 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.18);
    gain2.gain.setValueAtTime(0.4, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.18);
    osc2.stop(now + 0.65);
  } catch (e) {
    // Audio autoplay restrictions may silently fail if not unlocked by user gesture
  }
}

/**
 * Trigger device vibration (for mobile phones).
 */
export function triggerDeviceVibration(pattern: number[] = [250, 100, 250]) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  } catch (e) {}
}

/**
 * Helper to convert Base64 URL to Uint8Array for VAPID applicationServerKey
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Register Service Worker for background push and mobile notification tray integration
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }
  try {
    const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    await navigator.serviceWorker.ready;
    return reg;
  } catch (err) {
    console.error("ServiceWorker registration failed:", err);
    return null;
  }
}

/**
 * Subscribe browser to Web Push (wakes up mobile/desktop even when app or browser is closed)
 */
export async function subscribeToWebPush(registration?: ServiceWorkerRegistration | null): Promise<boolean> {
  try {
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      return false;
    }

    const reg = registration || (await navigator.serviceWorker.ready);
    if (!reg || !reg.pushManager) {
      return false;
    }

    // 1. Get backend VAPID public key
    const vapidKey = await api.getVapidPublicKey();
    if (!vapidKey) {
      console.warn("VAPID public key not configured on backend");
      return false;
    }

    // 2. Check if already subscribed
    let subscription = await reg.pushManager.getSubscription();

    if (!subscription) {
      const convertedVapidKey = urlBase64ToUint8Array(vapidKey);
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey as unknown as BufferSource,
      });
    }

    // 3. Send subscription to Laravel backend
    if (subscription) {
      const subJson = subscription.toJSON();
      await api.savePushSubscription(subJson);
      return true;
    }
    return false;
  } catch (err) {
    console.error("WebPush subscription error:", err);
    return false;
  }
}

/**
 * Trigger an actual phone/browser system notification.
 * On mobile devices (Android Chrome), new Notification() is blocked in page context.
 * We use ServiceWorkerRegistration.showNotification() so that the notification appears
 * in the phone's system notification bar area.
 */
export async function triggerSystemNotification(title: string, message: string) {
  try {
    playNotificationSound();
    triggerDeviceVibration([300, 150, 300]);

    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const notifOptions: any = {
      body: message,
      icon: "/icon-192.png",
      badge: "/favicon.ico",
      tag: "crownora-notification-" + Date.now(),
      vibrate: [300, 150, 300],
      requireInteraction: true,
      data: { url: "/admin/dashboard" },
    };

    // 1. Primary path for Mobile Android Chrome & PWA: use ServiceWorker Registration
    if ("serviceWorker" in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready;
        if (reg && reg.showNotification) {
          await reg.showNotification(title, notifOptions);
          return;
        }
      } catch (swErr) {
        console.warn("ServiceWorker showNotification failed, trying fallback:", swErr);
      }
    }

    // 2. Desktop fallback (Windows/macOS Chrome/Firefox/Safari where constructor is permitted)
    try {
      new Notification(title, notifOptions);
    } catch (e) {
      // Ignored if constructor not permitted on mobile
    }
  } catch (e) {
    // Graceful fallback
  }
}

/**
 * Request notification permission from the user and automatically register push subscription.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }

  // Pre-unlock audio context on user gesture
  getAudioContext();

  try {
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      playNotificationSound();
      triggerDeviceVibration([100]);

      // Immediately register Service Worker & subscribe to Push Service
      const reg = await registerServiceWorker();
      await subscribeToWebPush(reg);
    }
    return perm;
  } catch (e) {
    return "denied";
  }
}

/**
 * Initialize Service Worker and ensure push subscription is active if already granted.
 */
export async function initPushNotifications(): Promise<void> {
  if (typeof window === "undefined" || !("Notification" in window)) return;

  if (Notification.permission === "granted") {
    try {
      const reg = await registerServiceWorker();
      await subscribeToWebPush(reg);
    } catch (e) {
      console.warn("Error initializing push notifications:", e);
    }
  }
}

/**
 * Check current notification permission.
 */
export function getNotificationPermissionStatus(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}
