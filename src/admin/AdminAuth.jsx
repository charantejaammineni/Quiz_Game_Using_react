
import { Navigate, Outlet, useLocation } from "react-router-dom";

function AdminAuth() {
  const location = useLocation();

  const isFlagLoggedIn = sessionStorage.getItem("adminLoggedIn") === "true";
  let adminUser = null;
  try {
    adminUser = JSON.parse(sessionStorage.getItem("adminUser"));
  } catch {
    adminUser = null;
  }

  const isValidAdmin =
    isFlagLoggedIn &&
    adminUser &&
    (adminUser.role || "").toLowerCase() === "admin" &&
    (adminUser.status || "active").toLowerCase() !== "inactive";

  if (!isValidAdmin) {
    return (
      <Navigate
        to="/admin/signin"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}

export default AdminAuth;
