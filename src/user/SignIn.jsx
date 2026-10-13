
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const savedUsers = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const user = savedUsers.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    if (user.status === "Inactive") {
      setError("Your account is inactive. Please contact the administrator.");
      return;
    }

    if (user.role === "Admin") {
      setError("Please use the Admin Sign In page.");
      return;
    }

    sessionStorage.setItem(
      "userLoggedIn",
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
    );

    alert("Sign in successful!");
    navigate("/user");
  }

  return (
    <div className="form-page">
      <h1>Sign In</h1>

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

        <button type="submit">Sign In</button>
      </form>

      <p>
        Don't have an account? <Link to="/user/register">Register</Link>
      </p>
    </div>
  );
}

export default SignIn;
