// Service Worker for Crownora Group Web Push & System Notifications
self.addEventListener('install', function (event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Handle incoming Web Push (works when browser is closed or in background)
self.addEventListener('push', function (event) {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Crownora Group', message: event.data.text() };
    }
  }

  const title = data.title || 'Crownora Group Notification';
  const body = data.message || data.body || 'You have a new update.';
  const url = (data.data && data.data.url) ? data.data.url : '/admin/dashboard';

  const options = {
    body: body,
    icon: '/icon-192.png',
    badge: '/favicon.ico',
    vibrate: [250, 100, 250, 100, 250],
    tag: 'crownora-alert-' + (data.data?.timestamp || Date.now()),
    renotify: true,
    requireInteraction: true,
    data: {
      url: url,
      ...data.data
    },
    actions: [
      { action: 'open_dashboard', title: 'Open Dashboard' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle clicking on the notification in the phone's notification bar
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url)
    ? event.notification.data.url
    : '/admin/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if ('focus' in client) {
          if (client.url.includes('/admin/dashboard') || client.url.includes(targetUrl)) {
            return client.focus();
          }
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Allow client pages to request the service worker to show a notification in system tray
self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    self.registration.showNotification(title, options);
  }
});

