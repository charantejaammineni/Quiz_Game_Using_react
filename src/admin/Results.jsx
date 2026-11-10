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