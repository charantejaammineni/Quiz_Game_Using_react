
import { useEffect, useState } from "react";

function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const savedResults = JSON.parse(
      localStorage.getItem("quizResults") || "[]"
    );

    const userScores = {};

    savedResults.forEach((result) => {
      if (!result.userId || result.totalQuestions === 0) {
        return;
      }

      const percentage = Math.round(
        (result.score / result.totalQuestions) * 100
      );

      if (
        !userScores[result.userId] ||
        percentage > userScores[result.userId].score
      ) {
        userScores[result.userId] = {
          id: result.userId,
          name: result.userName || "User",
          score: percentage,
        };
      }
    });

    const rankedUsers = Object.values(userScores)
      .sort((a, b) => b.score - a.score)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

    setUsers(rankedUsers);
  }, []);

  return (
    <div className="leaderboard-page">
      <h1>Leaderboard</h1>

      {users.length === 0 ? (
        <p>No quiz results available yet. Attempt a quiz to appear on the leaderboard.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.rank}</td>
                <td>{user.name}</td>
                <td>{user.score}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;