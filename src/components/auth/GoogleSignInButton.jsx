import { useEffect, useRef, useState } from "react";

function GoogleSignInButton({ onCredential, disabled = false }) {
  const buttonRef = useRef(null);
  const [googleReady, setGoogleReady] = useState(
    () => Boolean(window.google?.accounts?.id)
  );

  useEffect(() => {
    if (window.google?.accounts?.id) {
      setGoogleReady(true);
      return undefined;
    }

    const handleLoad = () => setGoogleReady(true);

    window.addEventListener("google:loaded", handleLoad);

    return () => {
      window.removeEventListener("google:loaded", handleLoad);
    };
  }, []);

  useEffect(() => {
    if (!googleReady || !window.google?.accounts?.id || !buttonRef.current) {
      return undefined;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      return undefined;
    }

    buttonRef.current.innerHTML = "";

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (response?.credential) {
          onCredential(response.credential);
        }
      },
      ux_mode: "popup",
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      width: 360,
    });

    return () => {
      if (buttonRef.current) {
        buttonRef.current.innerHTML = "";
      }
    };
  }, [googleReady, onCredential]);

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div
      ref={buttonRef}
      aria-disabled={disabled}
      style={{
        minHeight: 44,
        display: "flex",
        justifyContent: "center",
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    />
  );
}

export default GoogleSignInButton;
