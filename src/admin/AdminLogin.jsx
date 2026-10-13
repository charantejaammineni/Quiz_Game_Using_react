
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect to dashboard if admin is already signed in
  if (sessionStorage.getItem("adminLoggedIn") === "true") {
    return <Navigate to="/admin" replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();

    // Demo credentials for the frontend version
    if (
      email.trim().toLowerCase() === "admin@quizmaster.com" &&
      password === "Admin@123"
    ) {
      sessionStorage.setItem("adminLoggedIn", "true");
      navigate("/admin", { replace: true });
    } else {
      setError("Invalid admin email or password.");
    }
  }

  return (
    <div className="form-page">
      <h1>Admin Sign In</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="adminEmail">Admin Email</label>
        <input
          id="adminEmail"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter admin email"
          required
        />

        <label htmlFor="adminPassword">Password</label>
        <input
          id="adminPassword"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter admin password"
          required
        />

        {error && <p className="admin-login-error">{error}</p>}

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default AdminLogin;

























