import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function QuizDetails() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const savedQuizzes = JSON.parse(
      localStorage.getItem("quizzes") || "[]"
    );

    const selectedQuiz = savedQuizzes.find(
      (item) => item.id === Number(quizId)
    );

    setQuiz(selectedQuiz);
  }, [quizId]);

  if (!quiz) {
    return (
      <div className="admin-page">
        <h1>Quiz Details</h1>
        <p>Quiz not found.</p>
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
          <strong>Level:</strong> {quiz.level}
        </p>

        <p>
          <strong>Questions:</strong> {quiz.questions}
        </p>
      </div>
    </div>
  );
}

export default QuizDetails;