
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function LogoutMessage() {
  const [message, setMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    const logoutMessage = sessionStorage.getItem("logoutMessage");

    if (!logoutMessage) {
      return;
    }

    setMessage(logoutMessage);
    sessionStorage.removeItem("logoutMessage");

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return message ? (
    <div className="logout-popup">
      <span>✓</span> {message}
    </div>
  ) : null;
}

export default LogoutMessage;
