
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function AdminHome() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalUsers: 0,
    totalAttempts: 0,
    averageScore: 0,
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  // Logout admin
  function handleLogout() {
    sessionStorage.removeItem("adminLoggedIn");
    navigate("/admin/signin", { replace: true });
  }

  // Load dashboard statistics
  useEffect(() => {
    function updateDashboard() {
      const quizzes = JSON.parse(
        localStorage.getItem("quizzes") || "[]"
      );

      const users = JSON.parse(
        localStorage.getItem("users") || "[]"
      );

      const results = JSON.parse(
        localStorage.getItem("quizResults") || "[]"
      );

      // Exclude admin accounts from the user count
      const regularUsers = users.filter(
        (user) => user.role !== "Admin"
      );

      // Calculate average percentage across all quiz attempts
      const validResults = results.filter(
        (result) =>
          Number(result.totalQuestions) > 0 &&
          Number.isFinite(Number(result.score))
      );

      const totalPercentage = validResults.reduce(
        (total, result) =>
          total +
          (Number(result.score) / Number(result.totalQuestions)) * 100,
        0
      );

      const averageScore = validResults.length
        ? Math.round(totalPercentage / validResults.length)
        : 0;

      setStats({
        totalQuizzes: quizzes.length,
        totalUsers: regularUsers.length,
        totalAttempts: results.length,
        averageScore,
      });
    }

    updateDashboard();

    // Refresh periodically and when this tab becomes active
    const interval = setInterval(updateDashboard, 2000);

    window.addEventListener("focus", updateDashboard);
    window.addEventListener("storage", updateDashboard);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", updateDashboard);
      window.removeEventListener("storage", updateDashboard);
    };
  }, []);

  // Featured quizzes for the carousel
  const featuredQuizzes = [
    {
      title: "Java Basics",
      description: "Test core Java concepts.",
      category: "Programming",
    },
    {
      title: "SQL Basics",
      description: "Practice SQL queries and databases.",
      category: "Database",
    },
    {
      title: "JavaScript Basics",
      description: "Explore JavaScript fundamentals.",
      category: "Web Development",
    },
  ];

  // Dynamic dashboard statistics
  const dashboardStats = [
    {
      title: "Total Quizzes",
      value: stats.totalQuizzes,
      icon: "📝",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
    },
    {
      title: "Quiz Attempts",
      value: stats.totalAttempts,
      icon: "📊",
    },
    {
      title: "Average Score",
      value: `${stats.averageScore}%`,
      icon: "⭐",
    },
  ];

  return (
    <div className="admin-dashboard">
      {/* Dashboard heading */}
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage your QuizMaster application from here.</p>
        </div>

        {/* Admin avatar and logout */}
        <div className="admin-header-actions">
          <div className="admin-avatar">A</div>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <hr />

      {/* Statistics cards */}
      
<div className="admin-stats">
  {dashboardStats.map((item) => (
    <div
      className="admin-stat-card"
      key={item.title}
      onClick={() => {
        if (item.title === "Total Users") {
          navigate("/admin/users");
        }
      }}
      style={{
        cursor: item.title === "Total Users" ? "pointer" : "default",
      }}
    >
      <div className="stat-icon">{item.icon}</div>
      <div>
        <h3>{item.title}</h3>
        <p>{item.value}</p>
      </div>
    </div>
  ))}
</div>


      {/* Featured quiz carousel */}
      <div className="admin-section">
        <h2>Featured Quizzes</h2>

        <div className="quiz-carousel">
          <div className="carousel-content">
            <span className="activity-badge">
              {featuredQuizzes[currentSlide].category}
            </span>

            <h3>{featuredQuizzes[currentSlide].title}</h3>
            <p>{featuredQuizzes[currentSlide].description}</p>
          </div>

          <div className="carousel-controls">
            <button
              type="button"
              onClick={() =>
                setCurrentSlide(
                  (currentSlide - 1 + featuredQuizzes.length) %
                    featuredQuizzes.length
                )
              }
            >
              Previous
            </button>

            <span>
              {currentSlide + 1} / {featuredQuizzes.length}
            </span>

            <button
              type="button"
              onClick={() =>
                setCurrentSlide(
                  (currentSlide + 1) % featuredQuizzes.length
                )
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Overall performance */}
      <div className="admin-section">
        <h2>Overall Performance</h2>

        <div className="progress-box">
          <div className="progress-header">
            <span>Average Quiz Score</span>
            <span>{stats.averageScore}%</span>
          </div>

          <progress
            value={stats.averageScore}
            max="100"
          ></progress>
        </div>
      </div>

      {/* Recent activity */}
      <div className="admin-section">
        <h2>Recent Activity</h2>

        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-badge">Users</span>
            <div>
              <strong>Registered Users</strong>
              <p>
                Total registered users: {stats.totalUsers}
              </p>
            </div>
          </div>

          <div className="activity-item">
            <span className="activity-badge">Quizzes</span>
            <div>
              <strong>Available Quizzes</strong>
              <p>
                Total quizzes created: {stats.totalQuizzes}
              </p>
            </div>
          </div>

          <div className="activity-item">
            <span className="activity-badge">Results</span>
            <div>
              <strong>Quiz Attempts</strong>
              <p>
                Total completed attempts: {stats.totalAttempts}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="admin-section">
        <h2>Quick Actions</h2>

        <div className="admin-actions">
          <Link to="/admin/quizzes">
            <button type="button">Manage Quizzes</button>
          </Link>

          <Link to="/admin/users">
            <button type="button">Manage Users</button>
          </Link>

          <button
            type="button"
            onClick={() => navigate("/admin/results")}
          >
            View Results
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/reports")}
          >
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
