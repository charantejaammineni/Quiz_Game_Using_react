import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

const QUIZZES_API = "http://localhost:5000/api/quizzes";
const QUESTIONS_API = "http://localhost:5000/api/questions";

function getQuizCategory(quiz) {
  const name = (quiz?.name || quiz?.title || "").toLowerCase().trim();
  const category = (quiz?.category || "").toLowerCase().trim();

  if (
    name.includes("it basic") ||
    category === "it" ||
    category === "it basics"
  ) {
    return "IT Basics";
  }

  if (name.includes("java") || category === "java") {
    return "Java";
  }

  if (name.includes("sql") || category === "sql") {
    return "SQL";
  }

  return quiz?.category || "";
}

function QuestionManagement() {
  const { quizId } = useParams();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [quizCategory, setQuizCategory] = useState("");
  const [questions, setQuestions] = useState([]);

  // Checkbox transfer box state
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [availableChecked, setAvailableChecked] = useState([]);
  const [selectedChecked, setSelectedChecked] = useState([]);

  // 1. Load Quiz details & matching Questions linked to this quizId
  useEffect(() => {
    async function loadData() {
      try {
        const [quizRes, questionsRes] = await Promise.all([
          fetch(QUIZZES_API),
          fetch(QUESTIONS_API),
        ]);

        if (!quizRes.ok || !questionsRes.ok) {
          throw new Error("Failed to load quiz or questions from server");
        }

        const quizzesData = await quizRes.json();
        const allQuestions = await questionsRes.json();

        const currentQuiz = quizzesData.find(
          (q) => String(q.id) === String(quizId)
        );

        if (!currentQuiz) {
          setQuizCategory("");
          setQuestions([]);
          return;
        }

        const category = getQuizCategory(currentQuiz);
        setQuizCategory(category);

        // Filter questions belonging to this quizId
        const matchedQuestions = allQuestions.filter((q) => {
          if (q.quizId !== undefined && q.quizId !== null && String(q.quizId).trim() !== "") {
            return String(q.quizId) === String(quizId);
          }
          if (String(quizId) === "1") return (q.category || "").toLowerCase() === "java";
          if (String(quizId) === "2") return (q.category || "").toLowerCase() === "sql";
          if (String(quizId) === "3") return (q.category || "").toLowerCase().includes("it basic");
          return false;
        });

        setQuestions(matchedQuestions);
        setSelectedQuestions([]);
        setAvailableChecked([]);
        setSelectedChecked([]);
      } catch (error) {
        console.error("Error loading question management data:", error);
      }
    }

    loadData();
  }, [quizId]);

  // Reset form inputs
  function resetForm() {
    setQuestion("");
    setOption1("");
    setOption2("");
    setOption3("");
    setOption4("");
    setCorrectAnswer("");
    setEditId(null);
    setShowForm(false);
  }

  // 2. Populate form for editing
  function handleEdit(item) {
    const qText = item.question || item.text || "";
    const ansText = item.correctAnswer || item.answer || "";

    setQuestion(qText);
    setOption1(item.options?.[0] || "");
    setOption2(item.options?.[1] || "");
    setOption3(item.options?.[2] || "");
    setOption4(item.options?.[3] || "");
    setCorrectAnswer(ansText);

    setEditId(item.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // 3. Add or Update Question (POST / PUT)
  async function handleSubmit(event) {
    event.preventDefault();

    if (!quizCategory) {
      alert("Quiz category could not be identified.");
      return;
    }

    if (!correctAnswer) {
      alert("Please select the correct answer.");
      return;
    }

    const payload = {
      quizId: String(quizId),
      question: question.trim(),
      text: question.trim(),
      options: [
        option1.trim(),
        option2.trim(),
        option3.trim(),
        option4.trim(),
      ],
      correctAnswer: correctAnswer.trim(),
      answer: correctAnswer.trim(),
      category: quizCategory,
    };

    try {
      if (editId !== null) {
        // UPDATE question (PUT)
        const response = await fetch(`${QUESTIONS_API}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Failed to update question");
        }

        const updated = await response.json();
        setQuestions((prev) =>
          prev.map((item) => (String(item.id) === String(editId) ? updated : item))
        );

        alert("Question updated successfully!");
      } else {
        // CREATE question (POST)
        const response = await fetch(QUESTIONS_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Failed to add question");
        }

        const saved = await response.json();
        setQuestions((prev) => [...prev, saved]);

        alert("Question added successfully!");
      }

      resetForm();
    } catch (error) {
      alert(error.message);
    }
  }

  // 4. Delete Question (DELETE)
  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${QUESTIONS_API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to delete question");
      }

      setQuestions((prev) => prev.filter((item) => String(item.id) !== String(id)));
      setSelectedQuestions((prev) => prev.filter((itemId) => String(itemId) !== String(id)));
      setAvailableChecked((prev) => prev.filter((itemId) => String(itemId) !== String(id)));
      setSelectedChecked((prev) => prev.filter((itemId) => String(itemId) !== String(id)));

      if (editId && String(editId) === String(id)) {
        resetForm();
      }

      alert("Question deleted successfully!");
    } catch (error) {
      alert(error.message);
    }
  }

  // Checkbox transfer helpers
  function toggleAvailable(id) {
    setAvailableChecked((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  }

  function toggleSelected(id) {
    setSelectedChecked((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  }

  function moveToSelected() {
    setSelectedQuestions((prev) => [...new Set([...prev, ...availableChecked])]);
    setAvailableChecked([]);
    setSelectedChecked([]);
  }

  function moveToAvailable() {
    setSelectedQuestions((prev) =>
      prev.filter((id) => !selectedChecked.includes(id))
    );
    setSelectedChecked([]);
    setAvailableChecked([]);
  }

  const availableQuestions = questions.filter(
    (item) => !selectedQuestions.includes(item.id)
  );
  const chosenQuestions = questions.filter((item) =>
    selectedQuestions.includes(item.id)
  );

  return (
    <div className="admin-page">
      <Breadcrumb />

      <h1>Question Management</h1>
      <p>Managing questions for Quiz ID: {quizId}</p>
      <p>Category: <strong>{quizCategory || "Loading..."}</strong></p>
      <p>Total Questions: <strong>{questions.length}</strong></p>

      <div className="question-steps">
        <div className="step active">1. Question</div>
        <div className="step">2. Options</div>
        <div className="step">3. Answer</div>
      </div>

      {!showForm && (
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Question
        </button>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <h2>{editId !== null ? "Edit Question" : "Add Question"}</h2>

          <label>Question</label>
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Enter question"
            required
          />

          <label>Question Category</label>
          <input
            type="text"
            value={quizCategory}
            readOnly
          />

          <label>Option 1</label>
          <input
            type="text"
            value={option1}
            onChange={(event) => setOption1(event.target.value)}
            placeholder="Enter option 1"
            required
          />

          <label>Option 2</label>
          <input
            type="text"
            value={option2}
            onChange={(event) => setOption2(event.target.value)}
            placeholder="Enter option 2"
            required
          />

          <label>Option 3</label>
          <input
            type="text"
            value={option3}
            onChange={(event) => setOption3(event.target.value)}
            placeholder="Enter option 3"
            required
          />

          <label>Option 4</label>
          <input
            type="text"
            value={option4}
            onChange={(event) => setOption4(event.target.value)}
            placeholder="Enter option 4"
            required
          />

          <label>Correct Answer</label>
          <select
            value={correctAnswer}
            onChange={(event) => setCorrectAnswer(event.target.value)}
            required
          >
            <option value="">Select correct answer</option>
            {[option1, option2, option3, option4].map((opt, index) => (
              <option key={index} value={opt} disabled={!opt.trim()}>
                {`Option ${index + 1}: ${opt || "(Empty)"}`}
              </option>
            ))}
          </select>

          <br />
          <br />

          <button type="submit">
            {editId !== null ? "Update Question" : "Save Question"}
          </button>

          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        </form>
      )}

      {/* Question Selection Transfer Box */}
      <div className="transfer-box" style={{ marginTop: "30px" }}>
        <h2>Question Selection</h2>

        <div className="transfer-lists">
          <div>
            <h4>Available ({availableQuestions.length})</h4>
            {availableQuestions.map((item) => (
              <label key={item.id}>
                <input
                  type="checkbox"
                  checked={availableChecked.includes(item.id)}
                  onChange={() => toggleAvailable(item.id)}
                />
                {item.question || item.text}
              </label>
            ))}
            {availableQuestions.length === 0 && (
              <p>No available questions.</p>
            )}
          </div>

          <div className="transfer-buttons">
            <button
              type="button"
              onClick={moveToSelected}
              disabled={availableChecked.length === 0}
              title="Move to Selected"
            >
              →
            </button>
            <button
              type="button"
              onClick={moveToAvailable}
              disabled={selectedChecked.length === 0}
              title="Move to Available"
            >
              ←
            </button>
          </div>

          <div>
            <h4>Selected ({chosenQuestions.length})</h4>
            {chosenQuestions.map((item) => (
              <label key={item.id}>
                <input
                  type="checkbox"
                  checked={selectedChecked.includes(item.id)}
                  onChange={() => toggleSelected(item.id)}
                />
                {item.question || item.text}
              </label>
            ))}
            {chosenQuestions.length === 0 && (
              <p>No questions selected.</p>
            )}
          </div>
        </div>
      </div>

      {/* Saved Questions Table */}
      <div style={{ marginTop: "30px" }}>
        <h2>Questions Table</h2>

        {questions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>ID</th>
                <th>Question</th>
                <th>Category</th>
                <th>Correct Answer</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {questions.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.id}</td>
                  <td>{item.question || item.text}</td>
                  <td>{item.category || quizCategory}</td>
                  <td>{item.correctAnswer || item.answer}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No questions added yet.</p>
        )}
      </div>
    </div>
  );
}

export default QuestionManagement;