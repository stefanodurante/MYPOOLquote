"use client";

import { useState } from "react";

export function PasswordInput() {
  const [visible, setVisible] = useState(false);

  return (
    <span className="password-field">
      <input
        type={visible ? "text" : "password"}
        name="password"
        autoComplete="current-password"
        required
      />
      <button
        type="button"
        className="password-toggle"
        aria-label={visible ? "Nascondi password" : "Mostra password"}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 0112 5c5.2 0 8.8 4.7 9.8 7a16.7 16.7 0 01-3.1 4.3M6.2 6.2A16.4 16.4 0 002.2 12c1 2.3 4.6 7 9.8 7 1 0 2-.2 2.9-.5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2.2 12s3.6-7 9.8-7 9.8 7 9.8 7-3.6 7-9.8 7-9.8-7-9.8-7z" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
        )}
      </button>
    </span>
  );
}
