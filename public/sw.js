self.addEventListener("fetch", () => {
  // Keep authenticated requests network-only. The service worker only
  // exists to enable the installable PWA experience.
});
