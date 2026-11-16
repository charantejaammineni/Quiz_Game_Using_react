import { useEffect, useState } from "react";

const USERS_API = "http://localhost:5000/api/users";
const RESULTS_API = "http://localhost:5000/api/results";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  // Generate notifications from actual backend data
  useEffect(() => {
    async function loadNotifications() {
      try {
        const [usersRes, resultsRes] = await Promise.all([
          fetch(USERS_API),
          fetch(RESULTS_API),
        ]);

        const users = usersRes.ok ? await usersRes.json() : [];
        const results = resultsRes.ok ? await resultsRes.json() : [];

        const items = [];

        // Show latest registered users
        const regularUsers = users.filter(
          (u) => (u.role || "").toLowerCase() !== "admin"
        );
        if (regularUsers.length > 0) {
          const latest = regularUsers[regularUsers.length - 1];
          items.push({
            id: "user-latest",
            message: `New user registered: ${latest.name || latest.username}`,
            type: "User",
            time: `${regularUsers.length} total users`,
          });
        }

        // Show latest quiz result
        if (results.length > 0) {
          const latest = results[results.length - 1];
          items.push({
            id: "result-latest",
            message: `${latest.username || "A user"} scored ${latest.score}/${latest.totalQuestions} on ${latest.quizTitle || "a quiz"}`,
            type: "Result",
            time: latest.date || "Recently",
          });
        }

        if (items.length === 0) {
          items.push({
            id: "empty",
            message: "No recent activity.",
            type: "Info",
            time: "Now",
          });
        }

        setNotifications(items);
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    }

    loadNotifications();
  }, []);

  function handleRemove(id) {
    const updatedNotifications = notifications.filter(
      (item) => item.id !== id
    );

    setNotifications(updatedNotifications);
  }

  return (
    <div className="admin-page">
      <h1>Notifications</h1>

      <p>View recent QuizMaster notifications.</p>

      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <div className="notification-list">
          {notifications.map((item) => (
            <div
              className="notification-card"
              key={item.id}
            >
              <span className="notification-badge">
                {item.type}
              </span>

              <h3>🔔 {item.message}</h3>

              <p>{item.time}</p>

              <button
                onClick={() => handleRemove(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;