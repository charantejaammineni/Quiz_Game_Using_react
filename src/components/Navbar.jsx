import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

function getStoredUser() {
  try {
    const raw = sessionStorage.getItem("userLoggedIn");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.id ? parsed : null;
  } catch {
    return null;
  }
}

function getStoredAdmin() {
  return sessionStorage.getItem("adminLoggedIn") === "true";
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize synchronously to prevent flicker on page refresh
  const [user, setUser] = useState(getStoredUser);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(getStoredAdmin);

  const syncAuthState = useCallback(() => {
    const adminActive = getStoredAdmin();
    const userActive = getStoredUser();

    // Prevent conflicting UI states if both keys exist
    if (adminActive && location.pathname.startsWith("/admin")) {
      setIsAdminLoggedIn(true);
      setUser(null);
    } else if (adminActive && !userActive) {
      setIsAdminLoggedIn(true);
      setUser(null);
    } else {
      setIsAdminLoggedIn(false);
      setUser(userActive);
    }
  }, [location.pathname]);

  useEffect(() => {
    syncAuthState();

    // Keep navbar synced if SessionTimeout or another event clears storage
    const interval = setInterval(syncAuthState, 1000);
    window.addEventListener("focus", syncAuthState);
    window.addEventListener("storage", syncAuthState);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", syncAuthState);
      window.removeEventListener("storage", syncAuthState);
    };
  }, [syncAuthState]);

  function handleUserLogout() {
    sessionStorage.removeItem("userLoggedIn");
    sessionStorage.setItem("logoutMessage", "Successfully logged out!");
    setUser(null);
    navigate("/user/signin", { replace: true });
  }

  function handleAdminLogout() {
    sessionStorage.removeItem("adminLoggedIn");
    sessionStorage.removeItem("adminUser");
    sessionStorage.setItem("logoutMessage", "Successfully logged out!");
    setIsAdminLoggedIn(false);
    navigate("/admin/signin", { replace: true });
  }

  const isOnAdminRoute = location.pathname.startsWith("/admin");

  return (
    <nav className="main-navbar">
      {/* Logo routes to the active portal's home */}
      <Link to={isAdminLoggedIn ? "/admin" : "/user"} className="logo">
        QuizMaster
      </Link>

      {isAdminLoggedIn ? (
        <div className="nav-links">
          <NavLink to="/admin" end>
            Dashboard
          </NavLink>
          <NavLink to="/admin/quizzes">Quizzes</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/results">Results</NavLink>
          <button type="button" onClick={handleAdminLogout}>
            Logout
          </button>
        </div>
      ) : (
        <>
          <div className="nav-links">
            <NavLink to="/user" end>
              Home
            </NavLink>
            <NavLink to="/user/leaderboard">Leaderboard</NavLink>
            <NavLink to="/user/history">History</NavLink>
            <NavLink to="/user/profile">Profile</NavLink>
          </div>

          <div className="nav-links">
            {user ? (
              <>
                <span>Hi, {user.name || user.username}</span>
                <button type="button" onClick={handleUserLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                {location.pathname !== "/user/signin" && (
                  <Link to="/user/signin" className="admin-link">
                    User Signin
                  </Link>
                )}
                {!isOnAdminRoute && (
                  <Link to="/admin/signin" className="admin-link">
                    Admin Signin
                  </Link>
                )}
              </>
            )}
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;