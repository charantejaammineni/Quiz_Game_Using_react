import { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";

function Reports() {
  const [results, setResults] = useState([]);

  // Loads quiz results from localStorage
  useEffect(() => {
    const savedResults = JSON.parse(
      localStorage.getItem("results") || "[]"
    );

    setResults(savedResults);
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
      <Breadcrumb/>
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
              ? Math.max(
                  ...results.map((result) => result.percentage)
                )
              : 0}
            %
          </p>
        </div>

        <div className="admin-stat-card">
          <h3>Lowest Score</h3>
          <p>
            {results.length > 0
              ? Math.min(
                  ...results.map((result) => result.percentage)
                )
              : 0}
            %
          </p>
        </div>
      </div>

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
    </div>
  );
}

export default Reports;