
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadQuestions } from "../data/quizData";

function UserHome() {
  const [availableQuizzes, setAvailableQuizzes] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const savedQuizzes = JSON.parse(
          localStorage.getItem("quizzes") || "[]"
        );

        const allQuestions = await loadQuestions();

        // Count XML categories when no admin quizzes are saved.
        const categories = [
          ...new Set(
            allQuestions
              .map((question) => question.category?.trim())
              .filter(Boolean)
          ),
        ];

        setAvailableQuizzes(
          savedQuizzes.length > 0
            ? savedQuizzes.length
            : categories.length
        );
      } catch (error) {
        console.error("Could not load quizzes:", error);
        setAvailableQuizzes(0);
      }

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

      const validResults = userResults.filter(
        (result) => result.totalQuestions > 0
      );

      if (validResults.length > 0) {
        const totalPercentage = validResults.reduce(
          (total, result) =>
            total + (result.score / result.totalQuestions) * 100,
          0
        );

        setAverageScore(
          Math.round(totalPercentage / validResults.length)
        );
      } else {
        setAverageScore(0);
      }
    }

    loadDashboardData();
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
