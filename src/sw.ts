// Empty fallback service worker to satisfy injectManifest mode
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
