import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const QUIZZES_API = "http://localhost:5000/api/quizzes";
const QUESTIONS_API = "http://localhost:5000/api/questions";

function ChooseQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadQuizData() {
      try {
        setLoading(true);

        const [quizzesRes, questionsRes] = await Promise.all([
          fetch(QUIZZES_API),
          fetch(QUESTIONS_API),
        ]);

        if (!quizzesRes.ok) {
          throw new Error("Failed to load quizzes from server");
        }

        const quizzesData = await quizzesRes.json();
        const allQuestions = questionsRes.ok ? await questionsRes.json() : [];

        // Count questions strictly by quizId, with fallback only for seed quizzes
        const updatedQuizzes = quizzesData.map((quiz) => {
          const matchingQuestions = allQuestions.filter((q) => {
            if (q.quizId !== undefined && q.quizId !== null && String(q.quizId).trim() !== "") {
              return String(q.quizId) === String(quiz.id);
            }
            if (String(quiz.id) === "1") return (q.category || "").toLowerCase() === "java";
            if (String(quiz.id) === "2") return (q.category || "").toLowerCase() === "sql";
            if (String(quiz.id) === "3") return (q.category || "").toLowerCase().includes("it basic");
            return false;
          });

          return {
            ...quiz,
            name: quiz.name || quiz.title,
            category: quiz.category || "General",
            questions: matchingQuestions.length,
          };
        });

        setQuizzes(updatedQuizzes);
      } catch (error) {
        console.error("Could not load quiz questions:", error);
      } finally {
        setLoading(false);
      }
    }

    loadQuizData();
  }, []);

  function handleStartQuiz(quiz) {
    const quizTitle = quiz.name || quiz.title || quiz.category;
    navigate(
      `/user/quiz?quizId=${quiz.id}&category=${encodeURIComponent(
        quiz.category
      )}&title=${encodeURIComponent(quizTitle)}`
    );
  }

  return (
    <div className="user-home">
      <section className="welcome-section">
        <h1>Choose Your Quiz</h1>
        <p>Select a quiz and test your knowledge.</p>
      </section>

      <section className="dashboard-grid">
        {loading ? (
          <p>Loading available quizzes...</p>
        ) : quizzes.length === 0 ? (
          <p>No quizzes available right now.</p>
        ) : (
          quizzes.map((quiz) => (
            <div className="dashboard-card" key={quiz.id}>
              <h3>{quiz.name}</h3>
              <p>Category: {quiz.category}</p>
              <p>Difficulty: {quiz.level || "Easy"}</p>
              <p>Questions: {quiz.questions}</p>

              <button
                type="button"
                onClick={() => handleStartQuiz(quiz)}
                disabled={quiz.questions === 0}
              >
                {quiz.questions === 0 ? "No Questions" : "Start Quiz"}
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default ChooseQuiz;