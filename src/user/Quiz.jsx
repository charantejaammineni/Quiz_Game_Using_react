import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const QUESTIONS_API = "http://localhost:5000/api/questions";
const RESULTS_API = "http://localhost:5000/api/results";

function Quiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");
  const quizId = searchParams.get("quizId");
  const quizTitle = searchParams.get("title") || category || "General Quiz";

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load questions specifically linked to this quizId
  useEffect(() => {
    setLoading(true);

    fetch(QUESTIONS_API)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load questions");
        return res.json();
      })
      .then((allQuestions) => {
        // Filter questions strictly belonging to this quizId
        const matched = allQuestions.filter((q) => {
          if (quizId && q.quizId !== undefined && q.quizId !== null && String(q.quizId).trim() !== "") {
            return String(q.quizId) === String(quizId);
          }
          // Seed quiz fallbacks for IDs 1, 2, 3
          if (String(quizId) === "1") return (q.category || "").toLowerCase() === "java";
          if (String(quizId) === "2") return (q.category || "").toLowerCase() === "sql";
          if (String(quizId) === "3") return (q.category || "").toLowerCase().includes("it basic");

          // Fallback if accessed only by category
          if (category) return (q.category || "").toLowerCase() === category.toLowerCase();
          return true;
        });

        setQuestions(matched);
        setCurrentQuestion(0);
        setSelectedAnswer("");
        setScore(0);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quiz questions:", error);
        setQuestions([]);
        setLoading(false);
      });
  }, [quizId, category]);

  // Handle answering and moving to next question or submitting
  async function handleNext() {
    const question = questions[currentQuestion];
    if (!question || !selectedAnswer) return;

    const correctAnswer = question.correctAnswer || question.answer;
    let newScore = score;

    if (selectedAnswer.trim() === String(correctAnswer).trim()) {
      newScore = score + 1;
      setScore(newScore);
    }

    setSelectedAnswer("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz complete - retrieve user information
      let user = null;
      try {
        user = JSON.parse(sessionStorage.getItem("userLoggedIn"));
      } catch {
        user = null;
      }

      const resultPayload = {
        userId: user?.id || "guest",
        username: user?.name || user?.username || "Guest User",
        userEmail: user?.email || "",
        quizId: quizId || "1",
        quizTitle: quizTitle,
        category: category || "General",
        score: newScore,
        totalQuestions: questions.length,
        date: new Date().toISOString().split("T")[0],
      };

      // Save to backend JSON database
      try {
        await fetch(RESULTS_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resultPayload),
        });
      } catch (err) {
        console.error("Failed to save result to server:", err);
      }

     // Navigate to result page, replacing the question history entry
      navigate("/user/result", {
        replace: true,
        state: {
          score: newScore,
          total: questions.length,
          userName: resultPayload.username,
          category: category,
          quizId: quizId,
          quizTitle: quizTitle,
        },
      });
    }
  }

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading quiz...</p>;
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-page">
        <h2>No questions available</h2>
        <p>There are no questions for {quizTitle} yet.</p>
        <button type="button" onClick={() => navigate("/user/quizzes")}>
          Back to Quizzes
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const questionTitle = question.question || question.text;

  return (
    <div className="quiz-page">
      <h2>{quizTitle}</h2>

      <p>
        Question {currentQuestion + 1} of {questions.length}
      </p>

      <h1>{questionTitle}</h1>

      <div className="answer-list">
        {(question.options || []).map((option) => (
          <label key={option} className="answer-option">
            <input
              type="radio"
              name="answer"
              value={option}
              checked={selectedAnswer === option}
              onChange={(event) => setSelectedAnswer(event.target.value)}
            />
            {option}
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={!selectedAnswer}
      >
        {currentQuestion === questions.length - 1
          ? "Finish Quiz"
          : "Next Question"}
      </button>

      <p>Score: {score}</p>
    </div>
  );
}

export default Quiz;