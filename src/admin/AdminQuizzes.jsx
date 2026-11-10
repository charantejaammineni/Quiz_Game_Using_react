import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

const QUIZZES_API = "http://localhost:5000/api/quizzes";
const QUESTIONS_API = "http://localhost:5000/api/questions";

function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  async function loadQuizzes() {
    try {
      const [quizzesRes, questionsRes] = await Promise.all([
        fetch(QUIZZES_API),
        fetch(QUESTIONS_API),
      ]);

      if (!quizzesRes.ok) {
        throw new Error("Unable to load quizzes from server");
      }

      const quizzesData = await quizzesRes.json();
      const questionsData = questionsRes.ok ? await questionsRes.json() : [];

      const updatedQuizzes = quizzesData.map((quiz) => {
        // Count questions strictly belonging to THIS quiz ID.
        // Legacy fallback only applies to default seeded quizzes (IDs "1", "2", "3")
        const matchingQuestions = questionsData.filter((q) => {
          if (q.quizId !== undefined && q.quizId !== null && String(q.quizId).trim() !== "") {
            return String(q.quizId) === String(quiz.id);
          }
          // Only the original 3 default quizzes link by category if quizId is absent:
          if (String(quiz.id) === "1") return (q.category || "").toLowerCase() === "java";
          if (String(quiz.id) === "2") return (q.category || "").toLowerCase() === "sql";
          if (String(quiz.id) === "3") return (q.category || "").toLowerCase().includes("it basic");
          return false;
        });

        return {
          ...quiz,
          name: quiz.name || quiz.title,
          category: quiz.category || "General",
          level: quiz.level || "Easy",
          questions: matchingQuestions.length,
        };
      });

      setQuizzes(updatedQuizzes);
    } catch (error) {
      console.error("Error loading quizzes:", error);
    }
  }

  useEffect(() => {
    loadQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) =>
    (quiz.name || "").toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quiz?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${QUIZZES_API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to delete quiz");
      }

      setQuizzes(quizzes.filter((quiz) => String(quiz.id) !== String(id)));
      alert("Quiz deleted successfully!");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="admin-page">
      <Breadcrumb />

      <h1>Quiz Management</h1>
      <p>Manage all quizzes from this page.</p>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search quiz..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <Link to="/admin/quizzes/add">
          <button type="button">+ Add Quiz</button>
        </Link>
      </div>

      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>ID</th>
            <th>Quiz Name</th>
            <th>Category</th>
            <th>Level</th>
            <th>Questions</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredQuizzes.map((quiz, index) => (
            <tr key={quiz.id}>
              <td>{index + 1}</td>
              <td>{quiz.id}</td>
              <td>{quiz.name}</td>

              <td>
                <span className="tag">{quiz.category}</span>
              </td>

              <td>
                <span className="tag">{quiz.level}</span>
              </td>

              <td>{quiz.questions}</td>

              <td>
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/admin/quizzes/${quiz.id}/questions`)
                  }
                >
                  Manage
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/admin/quizzes/add?edit=${quiz.id}`)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(quiz.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredQuizzes.length === 0 && <p>No quizzes found.</p>}
    </div>
  );
}

export default AdminQuizzes;