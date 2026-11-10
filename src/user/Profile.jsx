import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RESULTS_API = "http://localhost:5000/api/results";

function Profile() {
  const navigate = useNavigate();
  const [quizzesCompleted, setCompletedQuizzes] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  let user = null;
  try {
    user = JSON.parse(sessionStorage.getItem("userLoggedIn"));
  } catch {
    user = null;
  }

  useEffect(() => {
    if (!user) {
      navigate("/user/signin", { replace: true });
      return;
    }

    async function loadStats() {
      try {
        const response = await fetch(RESULTS_API);
        if (!response.ok) return;

        const allResults = await response.json();

        // Filter results belonging to the logged-in user
        const userResults = allResults.filter(
          (result) =>
            String(result.userId) === String(user.id) ||
            (result.username &&
              result.username.toLowerCase() ===
                (user.name || user.username || "").toLowerCase()) ||
            (result.userEmail &&
              result.userEmail.toLowerCase() ===
                (user.email || "").toLowerCase())
        );

        setCompletedQuizzes(userResults.length);

        const validResults = userResults.filter(
          (result) => Number(result.totalQuestions) > 0
        );

        if (validResults.length > 0) {
          const totalPercentage = validResults.reduce(
            (total, result) =>
              total +
              (Number(result.score) / Number(result.totalQuestions)) * 100,
            0
          );
          setAverageScore(Math.round(totalPercentage / validResults.length));
        } else {
          setAverageScore(0);
        }
      } catch (error) {
        console.error("Failed to load user profile statistics:", error);
      }
    }

    loadStats();
  }, [user?.id, user?.name, user?.username, user?.email, navigate]);

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