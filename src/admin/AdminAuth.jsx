
import { Navigate, Outlet, useLocation } from "react-router-dom";

function AdminAuth() {
  const location = useLocation();

  const isLoggedIn =
    sessionStorage.getItem("adminLoggedIn") === "true";

  if (!isLoggedIn) {
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
