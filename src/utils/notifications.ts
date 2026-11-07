// Web Audio & Device Notification utilities for Admin Live Alerts

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
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.2);

    // Second chime note (A5 - 880 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.15);
    gain2.gain.setValueAtTime(0.35, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.55);
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
 * Trigger an actual phone/browser system notification if permission is granted.
 */
export function triggerSystemNotification(title: string, message: string) {
  try {
    playNotificationSound();
    triggerDeviceVibration();

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(title, {
          body: message,
          icon: "/logo_new.png",
          badge: "/logo_new.png",
          silent: false,
          tag: "crownora-notification-" + Date.now(),
        });
      }
    }
  } catch (e) {
    // Fallback gracefully
  }
}

/**
 * Request notification permission from the user (must be initiated by user gesture).
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
    }
    return perm;
  } catch (e) {
    return "denied";
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

