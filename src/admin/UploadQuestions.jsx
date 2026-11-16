import { useState, useRef, useEffect } from "react";
import Breadcrumb from "../components/Breadcrumb";

const QUESTIONS_API = "http://localhost:5000/api/questions";
const QUIZZES_API = "http://localhost:5000/api/quizzes";

function UploadQuestions() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const fileInputRef = useRef(null);

  // Load quizzes for the dropdown
  useEffect(() => {
    fetch(QUIZZES_API)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setQuizzes(data))
      .catch(() => setQuizzes([]));
  }, []);

  function handleUpload(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    try {
      setLoading(true);
      setMessage("Reading and importing questions...");

      const xmlText = await file.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");

      const questionNodes = xmlDoc.getElementsByTagName("question");

      if (questionNodes.length === 0) {
        throw new Error("No <question> elements found in this XML file.");
      }

      let importedCount = 0;

      for (let i = 0; i < questionNodes.length; i++) {
        const node = questionNodes[i];

        const text =
          node.getElementsByTagName("text")[0]?.textContent ||
          node.getElementsByTagName("question")[0]?.textContent ||
          "";

        const category =
          node.getElementsByTagName("category")[0]?.textContent ||
          "General";

        const answer =
          node.getElementsByTagName("answer")[0]?.textContent ||
          node.getElementsByTagName("correctAnswer")[0]?.textContent ||
          "";

        const optionNodes = node.getElementsByTagName("option");
        const options = [];
        for (let j = 0; j < optionNodes.length; j++) {
          options.push(optionNodes[j].textContent.trim());
        }

        if (text.trim() && options.length > 0 && answer.trim()) {
          const payload = {
            question: text.trim(),
            text: text.trim(),
            category: category.trim(),
            options: options,
            correctAnswer: answer.trim(),
            answer: answer.trim(),
          };

          // Assign quizId if a quiz is selected
          if (selectedQuizId) {
            payload.quizId = selectedQuizId;
          }

          const res = await fetch(QUESTIONS_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            importedCount++;
          }
        }
      }

      setMessage(
        `Successfully imported ${importedCount} questions from ${file.name} to the database!`
      );
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("XML Import Error:", error);
      setMessage(`Import failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-page">
      <Breadcrumb />
      <h1>Upload Questions</h1>

      <p>Upload quiz questions using an XML file.</p>

      <form onSubmit={handleSubmit}>
        <label>Assign to Quiz (optional)</label>
        <select
          value={selectedQuizId}
          onChange={(e) => setSelectedQuizId(e.target.value)}
        >
          <option value="">-- No specific quiz --</option>
          {quizzes.map((quiz) => (
            <option key={quiz.id} value={quiz.id}>
              {quiz.name || quiz.title} ({quiz.category})
            </option>
          ))}
        </select>

        <label>Choose Question File</label>

        {/* File upload */}
        <input
          type="file"
          accept=".xml"
          ref={fileInputRef}
          onChange={handleUpload}
        />

        {file && (
          <p>
            Selected file: <strong>{file.name}</strong>
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Importing..." : "Upload Questions"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadQuestions;