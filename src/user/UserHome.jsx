import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const QUIZZES_API = "http://localhost:5000/api/quizzes";
const RESULTS_API = "http://localhost:5000/api/results";

function UserHome() {
  const [availableQuizzes, setAvailableQuizzes] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Fetch quizzes and attempts concurrently from backend
        const [quizzesRes, resultsRes] = await Promise.all([
          fetch(QUIZZES_API),
          fetch(RESULTS_API),
        ]);

        const quizzes = quizzesRes.ok ? await quizzesRes.json() : [];
        const results = resultsRes.ok ? await resultsRes.json() : [];

        setAvailableQuizzes(quizzes.length);

        // Retrieve currently logged-in user session
        let user = null;
        try {
          user = JSON.parse(sessionStorage.getItem("userLoggedIn"));
        } catch {
          user = null;
        }

        // Filter quiz attempts for this specific user
        const userResults = results.filter((result) => {
          if (!user) return false;
          return (
            String(result.userId) === String(user.id) ||
            result.username === user.name ||
            result.username === user.username
          );
        });

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
        console.error("Could not load user dashboard data:", error);
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