
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
  const [category, setCategory] = useState("Java");

  const [questions, setQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [availableChecked, setAvailableChecked] = useState([]);
  const [selectedChecked, setSelectedChecked] = useState([]);

  // Load questions for this quiz
  useEffect(() => {
    const savedQuestions = JSON.parse(
      localStorage.getItem("questions") || "{}"
    );

    const loadedQuestions = savedQuestions[quizId] || [];

    setQuestions(loadedQuestions);
    setSelectedIds([]);
    setSelectedQuestions([]);
    setAvailableChecked([]);
    setSelectedChecked([]);
  }, [quizId]);

  function handleEdit(item) {
    setQuestion(item.text);
    setOption1(item.options[0]);
    setOption2(item.options[1]);
    setOption3(item.options[2]);
    setOption4(item.options[3]);
    setCorrectAnswer(item.answer);
    setCategory(item.category || "Java");
    setEditId(item.id);
    setShowForm(true);
  }

  function resetForm() {
    setQuestion("");
    setOption1("");
    setOption2("");
    setOption3("");
    setOption4("");
    setCorrectAnswer("");
    setCategory("Java");
    setEditId(null);
    setShowForm(false);
  }

  function saveQuestions(updatedQuestions) {
    const savedQuestions = JSON.parse(
      localStorage.getItem("questions") || "{}"
    );

    savedQuestions[quizId] = updatedQuestions;

    localStorage.setItem(
      "questions",
      JSON.stringify(savedQuestions)
    );

    setQuestions(updatedQuestions);

    // Update the question count in Quiz Management
    const savedQuizzes = JSON.parse(
      localStorage.getItem("quizzes") || "[]"
    );

    const updatedQuizzes = savedQuizzes.map((quiz) =>
      Number(quiz.id) === Number(quizId)
        ? { ...quiz, questions: updatedQuestions.length }
        : quiz
    );

    localStorage.setItem(
      "quizzes",
      JSON.stringify(updatedQuizzes)
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    const savedQuestions = JSON.parse(
      localStorage.getItem("questions") || "{}"
    );

    const currentQuestions = savedQuestions[quizId] || [];

    if (editId !== null) {
      const updatedQuestions = currentQuestions.map((item) =>
        item.id === editId
          ? {
              ...item,
              text: question,
              options: [option1, option2, option3, option4],
              answer: correctAnswer,
              category: category,
            }
          : item
      );

      saveQuestions(updatedQuestions);
      alert("Question updated successfully");
    } else {
      const newQuestion = {
        id: Date.now(),
        text: question,
        options: [option1, option2, option3, option4],
        answer: correctAnswer,
        category: category,
      };

      saveQuestions([...currentQuestions, newQuestion]);
      alert("Question added successfully");
    }

    resetForm();
  }

  function handleDelete(id) {
    const updatedQuestions = questions.filter(
      (item) => item.id !== id
    );

    saveQuestions(updatedQuestions);

    setSelectedQuestions((previous) =>
      previous.filter((itemId) => itemId !== id)
    );

    setAvailableChecked((previous) =>
      previous.filter((itemId) => itemId !== id)
    );

    setSelectedChecked((previous) =>
      previous.filter((itemId) => itemId !== id)
    );

    setSelectedIds((previous) =>
      previous.filter((itemId) => itemId !== id)
    );
  }

  // Move checked questions from Available to Selected
  function moveToSelected() {
    setSelectedQuestions((previous) => [
      ...new Set([...previous, ...availableChecked]),
    ]);

    setAvailableChecked([]);
    setSelectedIds([]);
    setSelectedChecked([]);
  }

  // Move checked questions back to Available
  function moveToAvailable() {
    setSelectedQuestions((previous) =>
      previous.filter((id) => !selectedChecked.includes(id))
    );

    setSelectedChecked([]);
    setAvailableChecked([]);
    setSelectedIds([]);
  }

  function toggleAvailable(id) {
    setAvailableChecked((previous) =>
      previous.includes(id)
        ? previous.filter((itemId) => itemId !== id)
        : [...previous, id]
    );
  }

  function toggleSelected(id) {
    setSelectedChecked((previous) =>
      previous.includes(id)
        ? previous.filter((itemId) => itemId !== id)
        : [...previous, id]
    );
  }

  const availableQuestions = questions.filter(
    (item) => !selectedQuestions.includes(item.id)
  );

  const chosenQuestions = questions.filter(
    (item) => selectedQuestions.includes(item.id)
  );

  return (
    <div className="admin-page">
      <h1>Question Management</h1>
      <p>Managing questions for Quiz ID: {quizId}</p>
      <p>Total Questions: {questions.length}</p>

      <div className="question-steps">
        <div className="step active">1. Question</div>
        <div className="step">2. Options</div>
        <div className="step">3. Answer</div>
      </div>

      {!showForm && (
        <button onClick={() => setShowForm(true)}>
          Add Question
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit}>
          <h2>
            {editId !== null ? "Edit Question" : "Add Question"}
          </h2>

          <label>Question</label>
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Enter question"
            required
          />

          <label>Question Category</label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="Java">Programming / Java</option>
            <option value="JavaScript">Programming / JavaScript</option>
            <option value="SQL">Database / SQL</option>
            <option value="React">Frontend / React</option>
          </select>

          <label>Option 1</label>
          <input
            value={option1}
            onChange={(event) => setOption1(event.target.value)}
            placeholder="Enter option 1"
            required
          />

          <label>Option 2</label>
          <input
            value={option2}
            onChange={(event) => setOption2(event.target.value)}
            placeholder="Enter option 2"
            required
          />

          <label>Option 3</label>
          <input
            value={option3}
            onChange={(event) => setOption3(event.target.value)}
            placeholder="Enter option 3"
            required
          />

          <label>Option 4</label>
          <input
            value={option4}
            onChange={(event) => setOption4(event.target.value)}
            placeholder="Enter option 4"
            required
          />

          <label>Correct Answer</label>
          <select
            value={correctAnswer}
            onChange={(event) =>
              setCorrectAnswer(event.target.value)
            }
            required
          >
            <option value="">Select correct answer</option>
            {[option1, option2, option3, option4].map(
              (option, index) => (
                <option
                  key={index}
                  value={option}
                  disabled={!option.trim()}
                >
                  {`Option ${index + 1}: ${option || "(Empty)"}`}
                </option>
              )
            )}
          </select>

          <br />
          <br />

          <button type="submit">
            {editId !== null ? "Update Question" : "Save Question"}
          </button>

          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        </form>
      )}

      {/* Question selection */}
      <div className="transfer-box">
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
                {item.text}
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
                {item.text}
              </label>
            ))}

            {chosenQuestions.length === 0 && (
              <p>No questions selected.</p>
            )}
          </div>
        </div>
      </div>

      {/* Saved questions */}
      <div>
        <h2>Questions</h2>

        {questions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Question</th>
                <th>Category</th>
                <th>Correct Answer</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {questions.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.text}</td>
                  <td>{item.category || "—"}</td>
                  <td>{item.answer}</td>
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