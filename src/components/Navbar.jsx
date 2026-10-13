
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

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
    }

    checkLogin();
  }, [location.pathname]);

  function handleLogout() {
    sessionStorage.removeItem("userLoggedIn");
    setUser(null);
    navigate("/user/signin", { replace: true });
  }

  return (
    <nav className="main-navbar">
      {/* QuizMaster logo */}
      <Link to="/user" className="logo">
        QuizMaster
      </Link>

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
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/user/signin">Sign In</Link>
        )}

        <Link to="/admin/signin" className="admin-link">
          Admin
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
