
import { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";

function Results() {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedResults = JSON.parse(
      localStorage.getItem("quizResults") || "[]"
    );

    const formattedResults = savedResults.map((result, index) => ({
      id: result.id || index + 1,
      user: result.userName || "Guest",
      quiz: result.quizName || "Quiz Attempt",
      score: result.score,
      total: result.totalQuestions,
      percentage: result.totalQuestions
        ? Math.round(
            (result.score / result.totalQuestions) * 100
          )
        : 0,
      date: result.date
        ? new Date(result.date).toLocaleDateString("en-IN")
        : "-",
    }));

    setResults(formattedResults);
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

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Quiz</th>
            <th>Score</th>
            <th>Percentage</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {filteredResults.map((result) => (
            <tr key={result.id}>
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

      {filteredResults.length === 0 && (
        <p>No quiz results available.</p>
      )}
    </div>
  );
}

export default Results;