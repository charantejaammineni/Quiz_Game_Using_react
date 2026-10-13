
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loadQuestions } from "../data/quizData";

function Quiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");
  const quizId = searchParams.get("quizId");

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load questions for the selected category
  useEffect(() => {
    setLoading(true);

    loadQuestions()
      .then((data) => {
        const filteredQuestions = category
          ? data.filter(
              (question) =>
                question.category?.trim().toLowerCase() ===
                category.trim().toLowerCase()
            )
          : data;

        setQuestions(filteredQuestions);
        setCurrentQuestion(0);
        setSelectedAnswer("");
        setScore(0);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setQuestions([]);
        setLoading(false);
      });
  }, [category]);

  // Check the answer and move to the next question
  function handleNext() {
    const question = questions[currentQuestion];

    if (!question || !selectedAnswer) return;

    let newScore = score;

    if (selectedAnswer === question.answer) {
      newScore = score + 1;
      setScore(newScore);
    }

    setSelectedAnswer("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      let user = null;

      try {
        user = JSON.parse(sessionStorage.getItem("userLoggedIn"));
      } catch {
        user = null;
      }

      const savedResults = JSON.parse(
        localStorage.getItem("quizResults") || "[]"
      );

      const result = {
        id: Date.now(),
        userId: user?.id ?? null,
        userName: user?.name || "Guest",
        userEmail: user?.email || "",
        quizId: quizId,
        quizName: category || "General Quiz",
        category: category || "General",
        score: newScore,
        totalQuestions: questions.length,
        date: new Date().toISOString(),
      };

      localStorage.setItem(
        "quizResults",
        JSON.stringify([...savedResults, result])
      );

      navigate("/user/result", {
        state: {
          score: newScore,
          total: questions.length,
          userName: result.userName,
        },
      });
    }
  }

  if (loading) {
    return <p>Loading quiz...</p>;
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-page">
        <h2>No questions available</h2>
        <p>
          There are no questions for {category || "this quiz"} yet.
        </p>
        <button type="button" onClick={() => navigate("/user/quizzes")}>
          Back to Quizzes
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="quiz-page">
      <h2>{category || "Quiz"} Quiz</h2>

      <p>
        Question {currentQuestion + 1} of {questions.length}
      </p>

      <h1>{question.text}</h1>

      <div className="answer-list">
        {question.options.map((option) => (
          <label key={option} className="answer-option">
            <input
              type="radio"
              name="answer"
              value={option}
              checked={selectedAnswer === option}
              onChange={(event) =>
                setSelectedAnswer(event.target.value)
              }
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
