
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

function LockBackNavigation() {
  const location = useLocation();

  useLayoutEffect(() => {
    const currentPath = location.pathname;

    const isDashboard =
      currentPath === "/admin" || currentPath === "/user";

    function getSession() {
      if (
        currentPath === "/admin" &&
        sessionStorage.getItem("adminLoggedIn") === "true"
      ) {
        return "admin";
      }

      try {
        const user = JSON.parse(
          sessionStorage.getItem("userLoggedIn")
        );

        if (
          currentPath === "/user" &&
          user?.id &&
          user.role === "User"
        ) {
          return "user";
        }
      } catch {
        return null;
      }

      return null;
    }

    const session = getSession();

    if (!isDashboard || !session) return;

    let restoringHistory = false;

    window.history.pushState(
      { dashboardGuard: true },
      "",
      window.location.href
    );

    
function handleBack() {
  const currentSession = getSession();

  if (!currentSession) return;

  // Restore the dashboard entry before showing confirmation.
  window.history.pushState(
    { dashboardGuard: true },
    "",
    window.location.href
  );

  const shouldLeave = window.confirm(
    "Do you want to leave QuizMaster? You will be logged out."
  );

  if (shouldLeave) {
    if (currentSession === "admin") {
      sessionStorage.removeItem("adminLoggedIn");
      window.location.replace("/admin/signin");
    } else {
      sessionStorage.removeItem("userLoggedIn");
      window.location.replace("/user");
    }
  }
}


    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [location.pathname]);

  return null;
}

export default LockBackNavigation;  
