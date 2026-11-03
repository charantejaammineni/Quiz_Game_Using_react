
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  async function loadQuizzes() {
    try {
      const savedQuizzes = JSON.parse(
        localStorage.getItem("quizzes") || "[]"
      );

      const savedQuestions = JSON.parse(
        localStorage.getItem("questions") || "{}"
      );

      const deletedQuestions = JSON.parse(
        localStorage.getItem("deletedXmlQuestions") || "{}"
      );

      // Load questions from XML
      const response = await fetch("/data/questions.xml");

      if (!response.ok) {
        throw new Error("Unable to load questions.xml");
      }

      const xmlText = await response.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");

      const xmlQuestions = Array.from(
        xmlDoc.querySelectorAll("question")
      ).map((item) => ({
        id: Number(item.getAttribute("id")),
        category: item.querySelector("category")?.textContent.trim() || ""
      }));

      const updatedQuizzes = savedQuizzes.map((quiz) => {
        // Match IT basic quiz with IT Basics XML category
        let xmlCategory = quiz.category;

        if (quiz.name.toLowerCase().includes("it")) {
          xmlCategory = "IT Basics";
        }

        // Get XML questions for this quiz
        const quizXmlQuestions = xmlQuestions.filter(
          (item) =>
            item.category.toLowerCase() ===
            xmlCategory.toLowerCase()
        );

        // Get locally saved questions
        const localQuestions = savedQuestions[String(quiz.id)] || [];

        // Get deleted XML question IDs
        const deletedIds = deletedQuestions[String(quiz.id)] || [];

        // Combine questions without duplicates
        const questionMap = new Map();

        quizXmlQuestions
          .filter((item) => !deletedIds.includes(item.id))
          .forEach((item) => {
            questionMap.set(item.id, item);
          });

        localQuestions.forEach((item) => {
          questionMap.set(item.id, item);
        });

        return {
          ...quiz,
          questions: questionMap.size
        };
      });

      localStorage.setItem(
        "quizzes",
        JSON.stringify(updatedQuizzes)
      );

      setQuizzes(updatedQuizzes);
    } catch (error) {
      console.error("Error loading quiz questions:", error);
    }
  }

  useEffect(() => {
    loadQuizzes();

    window.addEventListener("questionsUpdated", loadQuizzes);

    return () => {
      window.removeEventListener("questionsUpdated", loadQuizzes);
    };
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleDelete(id) {
    const updatedQuizzes = quizzes.filter(
      (quiz) => quiz.id !== id
    );

    setQuizzes(updatedQuizzes);

    localStorage.setItem(
      "quizzes",
      JSON.stringify(updatedQuizzes)
    );
  }

  return (
    <div className="admin-page">
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
          <button>+ Add Quiz</button>
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
                  onClick={() =>
                    navigate(`/admin/quizzes/${quiz.id}/questions`)
                  }
                >
                  Manage
                </button>

                <button
                  onClick={() =>
                    navigate(`/admin/quizzes/add?edit=${quiz.id}`)
                  }
                >
                  Edit
                </button>

                <button onClick={() => handleDelete(quiz.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredQuizzes.length === 0 && (
        <p>No quizzes found.</p>
      )}
    </div>
  );
}

export default AdminQuizzes;
