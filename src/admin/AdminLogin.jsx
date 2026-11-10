import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LOGIN_API = "http://localhost:5000/api/login";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(LOGIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid email or password.");
        return;
      }

      const user = data.user;

      if ((user.role || "").toLowerCase() !== "admin") {
        setError("Access denied: You do not have administrator permissions.");
        return;
      }

      sessionStorage.setItem("adminLoggedIn", "true");
      sessionStorage.setItem("adminUser", JSON.stringify(user));

      alert("Sign in successful!");
      navigate("/admin", { replace: true });
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    }
  }

  return (
    <div className="form-page">
      <h1>Admin Sign In</h1>

      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter admin email"
          required
        />

        <label>Password</label>
        <div style={{ position: "relative", width: "100%" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            style={{ width: "100%", paddingRight: "40px", boxSizing: "border-box" }}
          />
          <i
            className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#666",
              fontSize: "1.1rem",
            }}
          ></i>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit">Signin</button>
      </form>
    </div>
  );
}

export default AdminLogin;