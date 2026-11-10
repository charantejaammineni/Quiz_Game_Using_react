import { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";

const RESULTS_API = "http://localhost:5000/api/results";

function Reports() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Loads quiz results from the backend API
  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true);
        const response = await fetch(RESULTS_API);

        if (!response.ok) {
          throw new Error("Failed to fetch reports data");
        }

        const data = await response.json();

        // Format raw backend records to match report expectations
        const formattedResults = data.map((item, index) => {
          const score = Number(item.score) || 0;
          const total = Number(item.totalQuestions || item.total) || 5;
          const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

          return {
            id: item.id || index + 1,
            user: item.username || item.name || item.user || "Guest",
            quiz: item.quizTitle || item.quizName || item.category || "Quiz Attempt",
            score,
            total,
            percentage,
            date: item.date
              ? new Date(item.date).toLocaleDateString("en-IN")
              : "-",
          };
        });

        setResults(formattedResults);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, []);

  const totalAttempts = results.length;

  const totalScore = results.reduce(
    (sum, result) => sum + result.percentage,
    0
  );

  const averageScore =
    totalAttempts > 0
      ? (totalScore / totalAttempts).toFixed(1)
      : 0;

  // Creates a report for each quiz
  const quizReports = [];

  results.forEach((result) => {
    const existingQuiz = quizReports.find(
      (item) => item.quiz === result.quiz
    );

    if (existingQuiz) {
      existingQuiz.attempts += 1;
      existingQuiz.totalPercentage += result.percentage;
    } else {
      quizReports.push({
        quiz: result.quiz,
        attempts: 1,
        totalPercentage: result.percentage,
      });
    }
  });

  // Calculates average score for each quiz
  quizReports.forEach((quiz) => {
    quiz.averageScore = (
      quiz.totalPercentage / quiz.attempts
    ).toFixed(1);
  });

  return (
    <div className="admin-page">
      <Breadcrumb />
      <h1>Reports</h1>

      <p>View overall quiz performance reports.</p>

      {/* Report summary */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <h3>Total Attempts</h3>
          <p>{totalAttempts}</p>
        </div>

        <div className="admin-stat-card">
          <h3>Average Score</h3>
          <p>{averageScore}%</p>
        </div>

        <div className="admin-stat-card">
          <h3>Highest Score</h3>
          <p>
            {results.length > 0
              ? Math.max(...results.map((result) => result.percentage))
              : 0}
            %
          </p>
        </div>

        <div className="admin-stat-card">
          <h3>Lowest Score</h3>
          <p>
            {results.length > 0
              ? Math.min(...results.map((result) => result.percentage))
              : 0}
            %
          </p>
        </div>
      </div>

      {loading ? (
        <p>Loading reports...</p>
      ) : (
        <>
          {/* Quiz-wise report */}
          <h2>Quiz-wise Performance</h2>

          <table>
            <thead>
              <tr>
                <th>Quiz</th>
                <th>Attempts</th>
                <th>Average Score</th>
              </tr>
            </thead>

            <tbody>
              {quizReports.map((quiz) => (
                <tr key={quiz.quiz}>
                  <td>{quiz.quiz}</td>
                  <td>{quiz.attempts}</td>
                  <td>{quiz.averageScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          {quizReports.length === 0 && (
            <p>No quiz-specific data available yet.</p>
          )}

          {/* Quiz performance table */}
          <h2>Quiz Performance</h2>

          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Quiz</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {results.map((result) => (
                <tr key={result.id}>
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

          {results.length === 0 && (
            <p>No report data available.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Reports;