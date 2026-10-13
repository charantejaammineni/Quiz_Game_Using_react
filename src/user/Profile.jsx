
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  let user = null;

  try {
    user = JSON.parse(sessionStorage.getItem("userLoggedIn"));
  } catch {
    user = null;
  }

  function handleLogout() {
    sessionStorage.removeItem("userLoggedIn");
    navigate("/user/signin", { replace: true });
  }

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <p>
        <strong>Name:</strong> {user?.name || "User"}
      </p>

      <p>
        <strong>Email:</strong> {user?.email || ""}
      </p>

      <p>
        <strong>Quizzes Completed:</strong> 0
      </p>

      <p>
        <strong>Average Score:</strong> 0%
      </p>

      <Link to="/user">
        <button type="button">Back to Home</button>
      </Link>

      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Profile;
