"use client";

import { useEffect, useRef, useState } from "react";
import { APP_VERSION } from "@/lib/app-version";

export function PwaRegister() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const hasUnsavedChangesRef = useRef(false);
  const pendingWorker = useRef<ServiceWorker | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let refreshing = false;
    let registration: ServiceWorkerRegistration | undefined;

    const showWorker = (worker: ServiceWorker) => {
      if (hasUnsavedChangesRef.current) {
        pendingWorker.current = worker;
        return;
      }
      setWaitingWorker(worker);
    };

    const register = async () => {
      try {
        registration = await navigator.serviceWorker.register(`/sw.js?v=${APP_VERSION}`);
        if (registration.waiting) showWorker(registration.waiting);
        registration.addEventListener("updatefound", () => {
          const worker = registration?.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              showWorker(worker);
            }
          });
        });
      } catch {
        // PWA installation remains available without update notifications.
      }
    };

    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    const onUnsavedChanges = (event: Event) => {
      const customEvent = event as CustomEvent<{ hasChanges?: boolean }>;
      const hasChanges = Boolean(customEvent.detail?.hasChanges);
      hasUnsavedChangesRef.current = hasChanges;
      setHasUnsavedChanges(hasChanges);
      if (!hasChanges && pendingWorker.current) {
        setWaitingWorker(pendingWorker.current);
        pendingWorker.current = null;
      }
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    window.addEventListener("mypoolquote:unsaved-changes", onUnsavedChanges);
    void register();

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      window.removeEventListener("mypoolquote:unsaved-changes", onUnsavedChanges);
      registration?.removeEventListener("updatefound", () => undefined);
    };
  }, []);

  function updateNow() {
    waitingWorker?.postMessage({ type: "SKIP_WAITING" });
    setWaitingWorker(null);
  }

  if (!waitingWorker || hasUnsavedChanges) {
    return null;
  }

  return (
    <aside className="pwa-update-banner" role="status" aria-live="polite">
      <div>
        <strong>Nuova versione disponibile</strong>
        <span>Puoi aggiornare MYPOOL adesso.</span>
      </div>
      <button type="button" className="primary-button" onClick={updateNow}>
        Aggiorna
      </button>
    </aside>
  );
}
