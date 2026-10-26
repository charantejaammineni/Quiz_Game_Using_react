
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadQuestions } from "../data/quizData";

function ChooseQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadQuizData() {
      try {
        const savedQuizzes = JSON.parse(
          localStorage.getItem("quizzes") || "[]"
        );

        const allQuestions = await loadQuestions();

        // Use saved quizzes if available; otherwise build quizzes from XML.
        let quizList = savedQuizzes;

        if (quizList.length === 0) {
          const categories = [
            ...new Set(
              allQuestions
                .map((question) => question.category?.trim())
                .filter(Boolean)
            ),
          ];

          quizList = categories.map((category, index) => ({
            id: `xml-${index + 1}`,
            name: category,
            category,
            level: "All Levels",
          }));
        }

        const updatedQuizzes = quizList.map((quiz) => {
          const name = (quiz.name || "").toLowerCase();
          let category = quiz.category || "";

          if (name.includes("java") && !name.includes("javascript")) {
            category = "Java";
          } else if (name.includes("sql")) {
            category = "SQL";
          } else if (name.includes("it")) {
            category = "IT Basics";
          }

          const questionCount = allQuestions.filter(
            (question) =>
              question.category?.trim().toLowerCase() ===
              category.trim().toLowerCase()
          ).length;

          return {
            ...quiz,
            category,
            questions: questionCount,
          };
        });

        setQuizzes(updatedQuizzes);
      } catch (error) {
        console.error("Could not load quiz questions:", error);
      }
    }

    loadQuizData();
  }, []);

  function handleStartQuiz(quiz) {
    navigate(
      `/user/quiz?quizId=${quiz.id}&category=${encodeURIComponent(
        quiz.category
      )}`
    );
  }

  return (
    <div className="user-home">
      <section className="welcome-section">
        <h1>Choose Your Quiz</h1>
        <p>Select a quiz and test your knowledge.</p>
      </section>

      <section className="dashboard-grid">
        {quizzes.length === 0 ? (
          <p>No quizzes available right now.</p>
        ) : (
          quizzes.map((quiz) => (
            <div className="dashboard-card" key={quiz.id}>
              <h3>{quiz.name}</h3>
              <p>Category: {quiz.category}</p>
              <p>Difficulty: {quiz.level}</p>
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
