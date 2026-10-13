
import { useEffect, useState } from "react";

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let user = null;

    try {
      user = JSON.parse(sessionStorage.getItem("userLoggedIn"));
    } catch {
      user = null;
    }

    const savedResults = JSON.parse(
      localStorage.getItem("quizResults") || "[]"
    );

    // Shows only the signed-in user's quiz attempts
    const userHistory = savedResults.filter(
      (item) =>
        user &&
        item.userId === user.id
    );

    setHistory(userHistory.reverse());
  }, []);

  return (
    <div className="history-page">
      <h1>Quiz History</h1>

      {history.length === 0 ? (
        <p>No quiz attempts yet. Complete a quiz to see your history.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Quiz</th>
              <th>Student Name</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>Quiz Attempt</td>
                <td>{item.userName}</td>
                <td>
                  {item.score} / {item.totalQuestions}
                </td>
                <td>
                  {new Date(item.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default History;
