
import { Navigate, Outlet } from "react-router-dom";

function UserAuth() {
  const savedSession = sessionStorage.getItem("userLoggedIn");
  let user = null;

  try {
    user = savedSession ? JSON.parse(savedSession) : null;
  } catch {
    user = null;
  }

  if (
    !user ||
    !user.id ||
    (user.role || "").toLowerCase() !== "user" ||
    (user.status || "").toLowerCase() === "inactive"
  ) {
    return <Navigate to="/user/signin" replace />;
  }

  return <Outlet />;
}

export default UserAuth;
