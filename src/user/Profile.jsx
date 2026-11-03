
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  let user = null;

  try {
    user = JSON.parse(sessionStorage.getItem("userLoggedIn"));
  } catch {
    user = null;
  }

  // Get completed quiz results
  let allResults = [];

  try {
    allResults = JSON.parse(
      localStorage.getItem("quizResults") || "[]"
    );
  } catch {
    allResults = [];
  }

  // Get results of the logged-in user
  const userResults = allResults.filter(
    (result) => String(result.userId) === String(user?.id)
  );

  // Calculate completed quizzes
  const quizzesCompleted = userResults.length;

  // Calculate average score
  const totalPercentage = userResults.reduce(
    (total, result) => {
      if (Number(result.totalQuestions) > 0) {
        return total +
          (Number(result.score) / Number(result.totalQuestions)) * 100;
      }

      return total;
    },
    0
  );

  const averageScore =
    quizzesCompleted > 0
      ? Math.round(totalPercentage / quizzesCompleted)
      : 0;

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
        <strong>Quizzes Completed:</strong> {quizzesCompleted}
      </p>

      <p>
        <strong>Average Score:</strong> {averageScore}%
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
