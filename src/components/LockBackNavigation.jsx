import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function LockBackNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isPromptOpen = useRef(false);

  useEffect(() => {
    const currentPath = location.pathname;
    const isDashboard = currentPath === "/admin" || currentPath === "/user";

    // Determine current role
    const isAdmin =
      currentPath === "/admin" &&
      sessionStorage.getItem("adminLoggedIn") === "true";

    let isUser = false;
    try {
      const userData = JSON.parse(sessionStorage.getItem("userLoggedIn"));
      isUser = currentPath === "/user" && userData?.role === "User";
    } catch {
      isUser = false;
    }

    if (!isDashboard || (!isAdmin && !isUser)) return;

    // Push initial guard entry
    window.history.pushState({ guard: true }, "", window.location.href);

    const handlePopState = () => {
      // Prevent duplicate popups if the user clicks back repeatedly
      if (isPromptOpen.current) return;
      isPromptOpen.current = true;

      // Re-anchor history immediately before showing dialog
      window.history.pushState({ guard: true }, "", window.location.href);

      // Small delay prevents Chrome's anti-hijack detector from triggering
      setTimeout(() => {
        const shouldLeave = window.confirm(
          "Do you want to leave QuizMaster? You will be logged out."
        );

        isPromptOpen.current = false;

        if (shouldLeave) {
          if (isAdmin) {
            sessionStorage.removeItem("adminLoggedIn");
            navigate("/admin/signin", { replace: true });
          } else {
            sessionStorage.removeItem("userLoggedIn");
            navigate("/user/signin", { replace: true });
          }
        }
      }, 50);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location.pathname, navigate]);

  return null;
}

export default LockBackNavigation;