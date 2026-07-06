import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GoogleLogo } from "@phosphor-icons/react";
import useAuth from "../hooks/useAuth";

const GSI_SRC = "https://accounts.google.com/gsi/client";

/**
 * Renders Google's real "Sign in with Google" button off-screen and proxies
 * clicks to it from our own brutalist-styled button, so we get a real
 * Google ID token (required by the backend's /google-signin verifyIdToken
 * check) while keeping the app's look consistent.
 */
export default function GoogleAuthButton({ label = "Continue with Google", testId }) {
  const { loginWithGoogle, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const hiddenHostRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    let cancelled = false;

    const handleCredential = async (response) => {
      const result = await loginWithGoogle(response.credential);
      if (!result.success) {
        toast.error(result.message || "Google sign-in failed");
        return;
      }
      toast.success("Welcome!");
      navigate(getDashboardPath(result.data?.user?.role));
    };

    const init = () => {
      if (cancelled || !window.google?.accounts?.id || !hiddenHostRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredential,
      });
      window.google.accounts.id.renderButton(hiddenHostRef.current, {
        type: "standard",
        width: 320,
      });
    };

    if (window.google?.accounts?.id) {
      init();
    } else {
      const script = document.querySelector(`script[src="${GSI_SRC}"]`);
      script?.addEventListener("load", init);
      return () => {
        cancelled = true;
        script?.removeEventListener("load", init);
      };
    }
    return () => { cancelled = true; };
  }, [loginWithGoogle, navigate, getDashboardPath]);

  const handleClick = () => {
    const realButton = hiddenHostRef.current?.querySelector('div[role="button"]');
    if (realButton) {
      realButton.click();
    } else {
      toast.error("Google sign-in is still loading, try again in a second.");
    }
  };

  return (
    <>
      <div ref={hiddenHostRef} style={{ position: "fixed", top: "-9999px", left: "-9999px" }} />
      <button
        type="button"
        onClick={handleClick}
        data-testid={testId}
        className="mt-10 w-full max-w-md btn-brutal bg-white px-5 py-3.5 font-semibold flex items-center justify-center gap-3"
      >
        <GoogleLogo size={20} weight="bold" /> {label}
      </button>
    </>
  );
}
