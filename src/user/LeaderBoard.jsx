import { useEffect, useState } from "react";

const RESULTS_API = "http://localhost:5000/api/results";

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        const response = await fetch(RESULTS_API);
        if (!response.ok) throw new Error("Failed to load results");

        const allResults = await response.json();

        // 1. Group results by user and find their highest score percentage
        const userStatsMap = {};

        allResults.forEach((result) => {
          const total = Number(result.totalQuestions) || 5;
          const score = Number(result.score) || 0;
          const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
          const username = result.username || result.name || "Anonymous";

          if (!userStatsMap[username]) {
            userStatsMap[username] = {
              name: username,
              bestPercentage: percentage,
              bestScore: `${score} / ${total}`,
              totalAttempts: 1,
            };
          } else {
            userStatsMap[username].totalAttempts += 1;
            if (percentage > userStatsMap[username].bestPercentage) {
              userStatsMap[username].bestPercentage = percentage;
              userStatsMap[username].bestScore = `${score} / ${total}`;
            }
          }
        });

        // 2. Convert to an array and sort descending by best percentage
        const sortedLeaders = Object.values(userStatsMap)
          .sort((a, b) => b.bestPercentage - a.bestPercentage)
          .slice(0, 10); // Display top 10

        setLeaders(sortedLeaders);
      } catch (error) {
        console.error("Error loading leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-page">
      <h1>Quiz Leaderboard</h1>
      <p>Top performers across all quizzes.</p>

      {loading ? (
        <p>Loading rankings...</p>
      ) : leaders.length === 0 ? (
        <p>No quiz attempts recorded yet. Be the first to take a quiz!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Best Score</th>
              <th>Percentage</th>
              <th>Total Attempts</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((player, index) => (
              <tr key={player.name}>
                <td>
                  {index === 0
                    ? "🥇 1"
                    : index === 1
                    ? "🥈 2"
                    : index === 2
                    ? "🥉 3"
                    : index + 1}
                </td>
                <td>
                  <strong>{player.name}</strong>
                </td>
                <td>{player.bestScore}</td>
                <td>
                  <span className="tag">{player.bestPercentage}%</span>
                </td>
                <td>{player.totalAttempts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;