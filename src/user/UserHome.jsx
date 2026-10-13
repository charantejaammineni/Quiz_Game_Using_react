
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function UserHome() {
  const [availableQuizzes, setAvailableQuizzes] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    // Get quizzes created in the Admin Portal
    const savedQuizzes = JSON.parse(
      localStorage.getItem("quizzes") || "[]"
    );

    setAvailableQuizzes(savedQuizzes.length);

    // Get the currently logged-in user
    let user = null;

    try {
      user = JSON.parse(sessionStorage.getItem("userLoggedIn"));
    } catch {
      user = null;
    }

    // Get quiz results
    const savedResults = JSON.parse(
      localStorage.getItem("quizResults") || "[]"
    );

    const userResults = savedResults.filter(
      (result) => user && result.userId === user.id
    );

    setCompletedQuizzes(userResults.length);

    if (userResults.length > 0) {
      const totalPercentage = userResults.reduce((total, result) => {
        if (!result.totalQuestions) return total;

        return total +
          (result.score / result.totalQuestions) * 100;
      }, 0);

      const validResults = userResults.filter(
        (result) => result.totalQuestions > 0
      );

      setAverageScore(
        validResults.length > 0
          ? Math.round(totalPercentage / validResults.length)
          : 0
      );
    } else {
      setAverageScore(0);
    }
  }, []);

  return (
    <div className="user-home">
      <section className="welcome-section">
        <h1>Welcome to QuizMaster</h1>
        <p>Test your knowledge and improve your skills.</p>

        <Link to="/user/quizzes">
          <button type="button">Start Quiz</button>
        </Link>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Available Quizzes</h3>
          <p>{availableQuizzes}</p>
        </div>

        <div className="dashboard-card">
          <h3>Quizzes Completed</h3>
          <p>{completedQuizzes}</p>
        </div>

        <div className="dashboard-card">
          <h3>Average Score</h3>
          <p>{averageScore}%</p>
        </div>
      </section>
    </div>
  );
}

export default UserHome;
