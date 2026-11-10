import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const QUIZZES_API = "http://localhost:5000/api/quizzes";
const QUESTIONS_API = "http://localhost:5000/api/questions";

function QuizDetails() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuizDetails() {
      try {
        setLoading(true);

        const [quizzesRes, questionsRes] = await Promise.all([
          fetch(QUIZZES_API),
          fetch(QUESTIONS_API),
        ]);

        if (!quizzesRes.ok) throw new Error("Failed to fetch quizzes");

        const quizzesData = await quizzesRes.json();
        const questionsData = questionsRes.ok ? await questionsRes.json() : [];

        // Match string or numeric IDs
        const selectedQuiz = quizzesData.find(
          (item) => String(item.id) === String(quizId)
        );

        if (selectedQuiz) {
          const category = (selectedQuiz.category || "").trim().toLowerCase();
          const questionCount = questionsData.filter(
            (q) => (q.category || "").trim().toLowerCase() === category
          ).length;

          setQuiz({
            ...selectedQuiz,
            name: selectedQuiz.name || selectedQuiz.title,
            questions: questionCount || selectedQuiz.questions || selectedQuiz.totalQuestions || 0,
          });
        } else {
          setQuiz(null);
        }
      } catch (error) {
        console.error("Error loading quiz details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuizDetails();
  }, [quizId]);

  if (loading) {
    return (
      <div className="admin-page">
        <h1>Quiz Details</h1>
        <p>Loading quiz details...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="admin-page">
        <h1>Quiz Details</h1>
        <p>Quiz not found.</p>
        <button type="button" onClick={() => navigate("/admin/quizzes")}>
          Back to Quizzes
        </button>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1>Quiz Details</h1>

      <div className="quiz-details-card">
        <h2>{quiz.name}</h2>

        <p>
          <strong>Quiz ID:</strong> {quiz.id}
        </p>

        <p>
          <strong>Category:</strong> {quiz.category}
        </p>

        <p>
          <strong>Level:</strong> {quiz.level || "Easy"}
        </p>

        <p>
          <strong>Questions:</strong> {quiz.questions}
        </p>

        <button
          type="button"
          onClick={() => navigate(`/admin/quizzes/${quiz.id}/questions`)}
        >
          Manage Questions
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/quizzes")}
        >
          Back to Quizzes
        </button>
      </div>
    </div>
  );
}

export default QuizDetails;