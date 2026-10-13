
import { useLocation, Link } from "react-router-dom";

function Result() {
  const location = useLocation();

  // Gets result details from the Quiz page
  const score = location.state?.score ?? 0;
  const total = location.state?.total ?? 0;
  const userName = location.state?.userName || "Guest";

  return (
    <div className="result-page">
      <h1>Quiz Result</h1>

      <p>
        <strong>Student Name:</strong> {userName}
      </p>

      <p>
        Your Score: {score} / {total}
      </p>

      <p>
        {score === total && total > 0
          ? "Excellent! You answered all questions correctly."
          : "Good attempt! Keep practicing to improve your score."}
      </p>

      <div className="result-buttons">
        <Link to="/user/quiz">
          <button type="button">Try Again</button>
        </Link>

        <Link to="/user/history">
          <button type="button">View History</button>
        </Link>

        <Link to="/user">
          <button type="button">Back to Home</button>
        </Link>
      </div>
    </div>
  );
}

export default Result;
