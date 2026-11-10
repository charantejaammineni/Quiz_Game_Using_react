import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  // Gets result details from the Quiz page
  const score = location.state?.score ?? 0;
  const total = location.state?.total ?? 0;
  const userName = location.state?.userName || "Guest";
  const category = location.state?.category || "";
  const quizId = location.state?.quizId || "";
  const quizTitle = location.state?.quizTitle || category || "";

  const [showBackModal, setShowBackModal] = useState(false);

  const tryAgainUrl = quizId
    ? `/user/quiz?quizId=${quizId}&category=${encodeURIComponent(
        category
      )}&title=${encodeURIComponent(quizTitle)}`
    : "/user/quizzes";

  // Intercept the browser back button so it doesn't return to the test questions
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    function handlePopState() {
      setShowBackModal(true);
      window.history.pushState(null, "", window.location.href);
    }

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  function handleTryAgain() {
    setShowBackModal(false);
    navigate(tryAgainUrl, { replace: true });
  }

  function handleGoHome() {
    setShowBackModal(false);
    navigate("/user", { replace: true });
  }

  return (
    <>
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
          <Link to={tryAgainUrl}>
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

      {/* Pop-up dialog when user clicks browser back button */}
      {showBackModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "24px 30px",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>Quiz Completed</h3>
            <p style={{ margin: "0 0 20px 0", color: "#666", fontSize: "0.95rem" }}>
              You have already finished this quiz. Retake it or return to the home screen.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              <button
                type="button"
                onClick={handleTryAgain}
                style={{
                  backgroundColor: "#ea8e27",
                  color: "#fff",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Try Again
              </button>

              <button
                type="button"
                onClick={handleGoHome}
                style={{
                  backgroundColor: "#2c3e50",
                  color: "#fff",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Result;