import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LOGIN_API = "http://localhost:5000/api/login";

function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

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
        setIsLoading(false);
        return;
      }

      const user = data.user;

      // Check account status
      if (user.status && user.status.toLowerCase() === "inactive") {
        setError("Your account is inactive. Please contact the administrator.");
        setIsLoading(false);
        return;
      }

      // Restrict admin accounts to Admin Signin
      if ((user.role || "").toLowerCase() === "admin") {
        setError("Admin accounts must use the Admin Sign In page.");
        setIsLoading(false);
        return;
      }

      // Store authenticated user session
      sessionStorage.setItem(
        "userLoggedIn",
        JSON.stringify({
          id: user.id,
          name: user.name || user.username,
          email: user.email,
          role: user.role,
          status: user.status || "Active",
        })
      );

      // Clean redirect without alert interruption
      navigate("/user");
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="form-page">
      <h1>User Sign In</h1>

      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          required
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Signin"}
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/user/register">Register</Link>
      </p>
    </div>
  );
}

export default SignIn;
