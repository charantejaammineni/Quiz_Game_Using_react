
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TIMEOUT = 5 * 60 * 1000;

function SessionTimeout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let timeout;

    function logout() {
      if (sessionStorage.getItem("adminLoggedIn") === "true") {
        sessionStorage.removeItem("adminLoggedIn");
        navigate("/admin/signin", { replace: true });
        return;
      }

      const user = sessionStorage.getItem("userLoggedIn");

      if (user) {
        sessionStorage.removeItem("userLoggedIn");
        navigate("/user/signin", { replace: true });
      }
    }

    function resetTimer() {
      clearTimeout(timeout);
      timeout = setTimeout(logout, TIMEOUT);
    }

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click"
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [location.pathname, navigate]);

  return null;
}

export default SessionTimeout;
