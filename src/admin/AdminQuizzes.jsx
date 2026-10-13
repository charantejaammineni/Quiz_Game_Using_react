import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminQuizzes() {
  const defaultQuizzes = [
    {
      id: 1,
      name: "Java Basics",
      category: "Java",
      level: "Easy",
      questions: 10,
    },
    {
      id: 2,
      name: "SQL Basics",
      category: "SQL",
      level: "Easy",
      questions: 8,
    },
    {
      id: 3,
      name: "JavaScript Basics",
      category: "JavaScript",
      level: "Medium",
      questions: 12,
    },
  ];

  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  const savedQuizzes = JSON.parse(
    localStorage.getItem("quizzes") || "[]"
  );

  const quizzesInitialized =
    localStorage.getItem("quizzesInitialized");

  let quizzesToLoad = savedQuizzes;

  if (!quizzesInitialized) {
    localStorage.setItem(
      "quizzes",
      JSON.stringify(defaultQuizzes)
    );

    localStorage.setItem(
      "quizzesInitialized",
      "true"
    );

    quizzesToLoad = defaultQuizzes;
  }

  const savedQuestions = JSON.parse(
    localStorage.getItem("questions") || "{}"
  );

  const updatedQuizzes = quizzesToLoad.map((quiz) => ({
    ...quiz,
    questions: (
      savedQuestions[String(quiz.id)] || []
    ).length,
  }));

  localStorage.setItem(
    "quizzes",
    JSON.stringify(updatedQuizzes)
  );

  setQuizzes(updatedQuizzes);
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
            <th>ID</th>
            <th>Quiz Name</th>
            <th>Category</th>
            <th>Level</th>
            <th>Questions</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredQuizzes.map((quiz) => (
            <tr key={quiz.id}>
              <td>{quiz.id}</td>

              <td>{quiz.name}</td>

              <td>
                <span className="tag">
                  {quiz.category}
                </span>
              </td>

              <td>
                <span className="tag">
                  {quiz.level}
                </span>
              </td>

              <td>{quiz.questions}</td>

              <td>
                <button
                  title="Manage Questions"
                  onClick={() =>
                    navigate(
                      `/admin/quizzes/${quiz.id}/questions`
                    )
                  }
                >
                  Manage
                </button>

                <button
                  title="Edit Quiz"
                  onClick={() =>
                    navigate(
                      `/admin/quizzes/add?edit=${quiz.id}`
                    )
                  }
                >
                  Edit
                </button>

                <button
                  title="Delete Quiz"
                  onClick={() => handleDelete(quiz.id)}
                >
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