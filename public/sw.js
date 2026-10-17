const APP_VERSION = "1.0.2";

self.addEventListener("install", () => {
  // Keep the worker waiting until the user confirms the update.
  void APP_VERSION;
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", () => {
  // Keep authenticated requests network-only. The service worker only
  // exists to enable the installable PWA experience.
});
