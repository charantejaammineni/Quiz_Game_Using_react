
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    sessionStorage.getItem("adminLoggedIn") === "true"
  );

  useEffect(() => {
    function checkLogin() {
      try {
        const loggedInUser = JSON.parse(
          sessionStorage.getItem("userLoggedIn")
        );
        setUser(loggedInUser);
      } catch {
        setUser(null);
      }

      setIsAdminLoggedIn(
        sessionStorage.getItem("adminLoggedIn") === "true"
      );
    }

    checkLogin();
  }, [location.pathname]);

  function handleUserLogout() {
    sessionStorage.removeItem("userLoggedIn");
    setUser(null);
    navigate("/user/signin", { replace: true });
  }

  function handleAdminLogout() {
    sessionStorage.removeItem("adminLoggedIn");
    setIsAdminLoggedIn(false);
    navigate("/admin/signin", { replace: true });
  }

  return (
    <nav className="main-navbar">
      {/* QuizMaster logo */}
      <Link to="/user" className="logo">
        QuizMaster
      </Link>

      {isAdminLoggedIn ? (
        /* Show only admin logout while admin is logged in */
        <div className="nav-links">
          <button type="button" onClick={handleAdminLogout}>
            Logout
          </button>
        </div>
      ) : (
        <>
          {/* Main navigation links */}
          <div className="nav-links">
            <Link to="/user">Home</Link>
            <Link to="/user/leaderboard">Leaderboard</Link>
            <Link to="/user/history">History</Link>
            <Link to="/user/profile">Profile</Link>
          </div>

          {/* User account links */}
          <div className="nav-links">
            {user ? (
              <>
                <span>Hi, {user.name}</span>
                <button type="button" onClick={handleUserLogout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/user/signin">User Signin</Link>
            )}

            {!user && (
  <Link to="/admin/signin" className="admin-link">Admin Signin</Link>
              )}
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
