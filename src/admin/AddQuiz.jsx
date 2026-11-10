import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const QUIZZES_API = "http://localhost:5000/api/quizzes";

function AddQuiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const editId = searchParams.get("edit");

  const [quizName, setQuizName] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [level, setLevel] = useState("Easy");

  // 1. If in Edit mode, fetch existing quiz data from API
  useEffect(() => {
    if (!editId) return;

    async function loadQuizForEdit() {
      try {
        const response = await fetch(QUIZZES_API);
        if (!response.ok) throw new Error("Failed to fetch quizzes");

        const data = await response.json();
        const quiz = data.find((item) => String(item.id) === String(editId));

        if (quiz) {
          setQuizName(quiz.name || quiz.title || "");
          setLevel(quiz.level || "Easy");

          const currentCat = quiz.category || "";
          if (["Java", "SQL", "IT Basics"].includes(currentCat)) {
            setCategory(currentCat);
            setIsCustom(false);
            setCustomCategory("");
          } else if (currentCat) {
            setCategory("Other");
            setIsCustom(true);
            setCustomCategory(currentCat);
          }
        }
      } catch (error) {
        console.error("Error loading quiz for editing:", error);
      }
    }

    loadQuizForEdit();
  }, [editId]);

  // 2. Add or Update Quiz via API
  async function handleSubmit(event) {
    event.preventDefault();

    const finalCategory = isCustom ? customCategory.trim() : category.trim();

    if (!quizName.trim() || !finalCategory) {
      alert("Please fill in all required fields!");
      return;
    }

    const quizPayload = {
      name: quizName.trim(),
      title: quizName.trim(),
      category: finalCategory,
      level: level,
      questions: 0,
      totalQuestions: 0,
    };

    try {
      if (editId) {
        const response = await fetch(`${QUIZZES_API}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quizPayload),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to update quiz");
        }

        alert("Quiz updated successfully");
      } else {
        const response = await fetch(QUIZZES_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quizPayload),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to add quiz");
        }

        alert("Quiz added successfully");
      }

      navigate("/admin/quizzes");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="admin-page add-quiz-page">
      <h1>{editId ? "Edit Quiz" : "Add Quiz"}</h1>

      <p className="add-quiz-subtitle">
        {editId
          ? "Update the details of your quiz."
          : "Create a new quiz by filling in the details below."}
      </p>

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
            value={isCustom ? "Other" : category}
            onChange={(event) => {
              const val = event.target.value;
              if (val === "Other") {
                setIsCustom(true);
                setCategory("Other");
              } else {
                setIsCustom(false);
                setCategory(val);
                setCustomCategory("");
              }
            }}
            required
          >
            <option value="">Select Category</option>
            <option value="Java">Java</option>
            <option value="SQL">SQL</option>
            <option value="IT Basics">IT Basics</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {isCustom && (
          <div className="form-field">
            <label htmlFor="customCategory">Custom Category Name</label>
            <input
              id="customCategory"
              type="text"
              value={customCategory}
              onChange={(event) => setCustomCategory(event.target.value)}
              placeholder="e.g. Python, React, Web Development"
              required
            />
          </div>
        )}

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