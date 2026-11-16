import { useState } from "react";

function AdminSettings() {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("adminSettings"));
      return saved?.notifications ?? true;
    } catch {
      return true;
    }
  });

  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("adminSettings"));
      return saved?.darkMode ?? false;
    } catch {
      return false;
    }
  });

  function handleSave() {
    localStorage.setItem(
      "adminSettings",
      JSON.stringify({ notifications, darkMode })
    );
    alert("Settings saved successfully");
  }

  return (
    <div className="admin-page">
      <h1>Admin Settings</h1>

      <p>Manage your QuizMaster settings.</p>

      <div className="settings-card">
        <h2>General Settings</h2>

        <label>
          Admin Name
        </label>
        <input
          type="text"
          defaultValue="QuizMaster Admin"
        />

        <label>
          Email
        </label>
        <input
          type="email"
          defaultValue="admin@quizmaster.com"
        />

        <h2>Preferences</h2>

        {/* Notification switch */}
        <div className="setting-row">
          <span>Enable Notifications</span>

          <label className="switch">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(event) =>
                setNotifications(event.target.checked)
              }
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* Dark mode switch */}
        <div className="setting-row">
          <span>Enable Dark Mode</span>

          <label className="switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(event) =>
                setDarkMode(event.target.checked)
              }
            />
            <span className="slider"></span>
          </label>
        </div>

        <button onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default AdminSettings;