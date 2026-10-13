import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function AddQuiz() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [quizName, setQuizName] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("Easy");

  useEffect(() => {
  // Loads the quiz details when editing
  if (editId) {
    const savedQuizzes = JSON.parse(
      localStorage.getItem("quizzes") || "[]"
    );

    const quiz = savedQuizzes.find(
      (item) => item.id === Number(editId)
    );

    if (quiz) {
      setQuizName(quiz.name);
      setCategory(quiz.category);
      setLevel(quiz.level);
    }
  }
}, [editId]);

 function handleSubmit(event) {
  event.preventDefault();

  // Gets existing quizzes from localStorage
  const savedQuizzes = JSON.parse(
    localStorage.getItem("quizzes") || "[]"
  );

  // If editId exists, update the existing quiz
  if (editId) {
    const updatedQuizzes = savedQuizzes.map((quiz) => {
      if (quiz.id === Number(editId)) {
        return {
          ...quiz,
          name: quizName,
          category: category,
          level: level,
        };
      }

      return quiz;
    });

    localStorage.setItem(
      "quizzes",
      JSON.stringify(updatedQuizzes)
    );

    alert("Quiz updated successfully");
  } else {
    // Creates the next simple sequential quiz ID
    const newId =
      savedQuizzes.length > 0
        ? Math.max(
            ...savedQuizzes.map((quiz) => Number(quiz.id))
          ) + 1
        : 4;

    // Creates a new quiz
    const newQuiz = {
      id: newId,
      name: quizName,
      category: category,
      level: level,
      questions: 0,
    };

    // Adds the new quiz
    savedQuizzes.push(newQuiz);

    // Saves the updated list
    localStorage.setItem(
      "quizzes",
      JSON.stringify(savedQuizzes)
    );

    alert("Quiz added successfully");
  }

  // Returns to the quiz management page
  navigate("/admin/quizzes");
}
return (
  <div className="admin-page add-quiz-page">
    {/* Page heading */}
    <h1>{editId ? "Edit Quiz" : "Add Quiz"}</h1>
    <p className="add-quiz-subtitle">
      {editId
        ? "Update the details of your quiz."
        : "Create a new quiz by filling in the details below."}
    </p>

    {/* Quiz form */}
    <form className="add-quiz-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="quizName">Quiz Name</label>
        <input
          id="quizName"
          type="text"
          value={quizName}
          onChange={(event) => setQuizName(event.target.value)}
          placeholder="Enter quiz name"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="Java">Java</option>
          <option value="JavaScript">JavaScript</option>
          <option value="SQL">SQL</option>
          <option value="React">React</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="level">Difficulty Level</label>
        <select
          id="level"
          value={level}
          onChange={(event) => setLevel(event.target.value)}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Form actions */}
      <div className="add-quiz-actions">
        <button type="submit" className="save-quiz-button">
          {editId ? "Update Quiz" : "Save Quiz"}
        </button>

        <button
          type="button"
          className="cancel-quiz-button"
          onClick={() => navigate("/admin/quizzes")}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
);
}

export default AddQuiz;