import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Deep history buffer size to absorb rapid multi-clicks
const BUFFER_SIZE = 15;

function LockBackNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showExitModal, setShowExitModal] = useState(false);
  const isExitingRef = useRef(false);

  const normalizedPath = location.pathname.replace(/\/+$/, "") || "/";
  const isDashboard = normalizedPath === "/admin" || normalizedPath === "/user";

  const isAdmin =
    normalizedPath === "/admin" &&
    sessionStorage.getItem("adminLoggedIn") === "true";

  let isUser = false;
  try {
    const userData = JSON.parse(sessionStorage.getItem("userLoggedIn"));
    isUser =
      normalizedPath === "/user" &&
      Boolean(userData?.id) &&
      (userData?.role || "").toLowerCase() === "user";
  } catch {
    isUser = false;
  }

  const shouldLock = isDashboard && (isAdmin || isUser);

  useEffect(() => {
    if (!shouldLock) {
      setShowExitModal(false);
      return;
    }

    isExitingRef.current = false;

    // Push a deep buffer of guard states so rapid multi-clicks cannot skip out to Google
    const pushGuardBuffer = () => {
      for (let i = 0; i < BUFFER_SIZE; i++) {
        window.history.pushState({ guard: true }, "", window.location.href);
      }
    };

    pushGuardBuffer();

    const handlePopState = () => {
      // Re-anchor a full buffer immediately on every popstate event
      pushGuardBuffer();
      setShowExitModal(true);
    };

    const handleBeforeUnload = (e) => {
      if (isExitingRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldLock, location.pathname]);

  function handleCancel() {
    setShowExitModal(false);
    for (let i = 0; i < BUFFER_SIZE; i++) {
      window.history.pushState({ guard: true }, "", window.location.href);
    }
  }

  function handleConfirmExit() {
    isExitingRef.current = true;
    setShowExitModal(false);
    if (isAdmin) {
      sessionStorage.removeItem("adminLoggedIn");
      sessionStorage.removeItem("adminUser");
      navigate("/admin/signin", { replace: true });
    } else {
      sessionStorage.removeItem("userLoggedIn");
      navigate("/user/signin", { replace: true });
    }
  }

  if (!showExitModal) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        backdropFilter: "blur(2px)",
      }}
      onClick={handleCancel}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "28px 32px",
          borderRadius: "12px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.25)",
          maxWidth: "420px",
          width: "90%",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>⚠️</div>

        <h3 style={{ margin: "0 0 10px 0", color: "#222", fontSize: "1.3rem" }}>
          Do you want to exit?
        </h3>

        <p style={{ margin: "0 0 24px 0", color: "#666", fontSize: "0.95rem", lineHeight: "1.5" }}>
          You are currently logged in. If you exit, you will be logged out of QuizMaster.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "14px" }}>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              backgroundColor: "#e2e8f0",
              color: "#334155",
              border: "none",
              padding: "10px 22px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "background 0.2s",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmExit}
            style={{
              backgroundColor: "#dc2626",
              color: "#ffffff",
              border: "none",
              padding: "10px 22px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "background 0.2s",
            }}
          >
            OK, Exit
          </button>
        </div>
      </div>
    </div>
  );
}

export default LockBackNavigation;
