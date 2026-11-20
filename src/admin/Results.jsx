import { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";

const RESULTS_API = "http://localhost:5000/api/results";

function Results() {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all quiz attempts from the backend API
  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true);
        const response = await fetch(RESULTS_API);

        if (!response.ok) {
          throw new Error("Failed to load results from server");
        }

        const data = await response.json();

        // Format backend result records for table display (newest first)
        const formattedResults = [...data].reverse().map((result, index) => {
          const total = Number(result.totalQuestions || result.total || 5);
          const score = Number(result.score || 0);

          return {
            id: result.id || index + 1,
            user: result.username || result.userName || result.user || "Guest",
            quiz: result.quizTitle || result.quizName || result.quiz || "Quiz Attempt",
            score: score,
            total: total,
            percentage: total ? Math.round((score / total) * 100) : 0,
            date: result.date
              ? new Date(result.date).toLocaleDateString("en-IN")
              : "-",
          };
        });

        setResults(formattedResults);
      } catch (error) {
        console.error("Error loading results:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, []);

  const filteredResults = results.filter(
    (result) =>
      result.user.toLowerCase().includes(search.toLowerCase()) ||
      result.quiz.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDeleteResult(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this result?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${RESULTS_API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete result");
      }

      setResults((prev) => prev.filter((r) => String(r.id) !== String(id)));
    } catch (err) {
      alert(err.message || "Could not delete result");
    }
  }

  return (
    <div className="admin-page">
      <Breadcrumb />

      <h1>Quiz Results</h1>
      <p>View quiz attempts and scores from all users.</p>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search user or quiz..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading results...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>ID</th>
              <th>User</th>
              <th>Quiz</th>
              <th>Score</th>
              <th>Percentage</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredResults.map((result, index) => (
              <tr key={result.id}>
                <td>{index + 1}</td>
                <td>{result.id}</td>
                <td>{result.user}</td>
                <td>{result.quiz}</td>
                <td>
                  {result.score} / {result.total}
                </td>
                <td>{result.percentage}%</td>
                <td>{result.date}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleDeleteResult(result.id)}
                    style={{
                      backgroundColor: "#dc2626",
                      color: "#fff",
                      border: "none",
                      padding: "5px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && filteredResults.length === 0 && (
        <p>No quiz results available.</p>
      )}
    </div>
  );
}

export default Results;