import { useState } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New user registered.",
      type: "User",
      time: "10 minutes ago",
    },
    {
      id: 2,
      message: "Java Basics quiz was updated.",
      type: "Quiz",
      time: "1 hour ago",
    },
    {
      id: 3,
      message: "New quiz result is available.",
      type: "Result",
      time: "2 hours ago",
    },
  ]);

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