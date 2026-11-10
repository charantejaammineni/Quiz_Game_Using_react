import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RESULTS_API = "http://localhost:5000/api/results";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Retrieve logged-in user from session storage
  let currentUser = null;
  try {
    currentUser = JSON.parse(sessionStorage.getItem("userLoggedIn"));
  } catch {
    currentUser = null;
  }

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        const res = await fetch(RESULTS_API);
        if (!res.ok) throw new Error("Failed to load results");

        const allResults = await res.json();

        // Filter results specifically for the logged-in user
        const userResults = allResults
          .filter((item) => {
            if (!currentUser) return true; // Fallback if browsing as guest
            const matchId =
              item.userId && currentUser.id && String(item.userId) === String(currentUser.id);
            const matchEmail =
              item.userEmail &&
              currentUser.email &&
              item.userEmail.toLowerCase() === currentUser.email.toLowerCase();
            const matchName =
              item.username &&
              (currentUser.name || currentUser.username) &&
              item.username.toLowerCase() ===
                (currentUser.name || currentUser.username).toLowerCase();

            return matchId || matchEmail || matchName;
          })
          .reverse(); // Show newest attempts first

        setHistory(userResults);
      } catch (err) {
        console.error("Error loading user quiz history:", err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  return (
    <div className="history-page">
      <h1>Quiz History</h1>
      <p>
        Review your past quiz attempts and scores for{" "}
        <strong>{currentUser?.name || currentUser?.username || "Guest"}</strong>.
      </p>

      {loading ? (
        <p>Loading your history...</p>
      ) : history.length === 0 ? (
        <div className="no-history">
          <p>You haven't attempted any quizzes yet.</p>
          <Link to="/user/quizzes">
            <button type="button">Take a Quiz</button>
          </Link>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Quiz Title</th>
              <th>Category</th>
              <th>Score</th>
              <th>Percentage</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => {
              const score = Number(item.score) || 0;
              const total = Number(item.totalQuestions) || 5;
              const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
              const isPassed = percentage >= 50;

              return (
                <tr key={item.id || index}>
                  <td>{index + 1}</td>
                  <td>{item.quizTitle || `${item.category || "General"} Quiz`}</td>
                  <td>
                    <span className="tag">{item.category || "General"}</span>
                  </td>
                  <td>
                    {score} / {total}
                  </td>
                  <td>{percentage}%</td>
                  <td>
                    {item.date
                      ? new Date(item.date).toLocaleDateString("en-IN")
                      : "-"}
                  </td>
                  <td>
                    <span className={`status-badge ${isPassed ? "active" : "inactive"}`}>
                      {isPassed ? "Passed" : "Failed"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default History;