import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const USERS_API = "http://localhost:5000/api/users";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isEmailTaken, setIsEmailTaken] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsEmailTaken(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(USERS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          username: name.trim(),
          email: email.trim().toLowerCase(),
          password: password,
          role: "User",
          status: "Active",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if the backend rejected due to existing email
        const errorMessage = (data.error || "").toLowerCase();
        if (
          errorMessage.includes("already registered") ||
          errorMessage.includes("already exists") ||
          errorMessage.includes("email")
        ) {
          setIsEmailTaken(true);
          setError("This email already exists!");
        } else {
          setError(data.error || "Failed to register.");
        }
        return;
      }

      alert("Registration successful! Please sign in.");
      navigate("/user/signin");
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    }
  }

  return (
    <div className="form-page">
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter your name"
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            // Clear email taken alert as soon as the user starts editing the email
            if (isEmailTaken) {
              setIsEmailTaken(false);
              setError("");
            }
          }}
          placeholder="Enter your email"
          required
        />

        <label>Password</label>
        <div style={{ position: "relative", width: "100%" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            minLength={6}
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

        <label>Confirm Password</label>
        <div style={{ position: "relative", width: "100%" }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm your password"
            minLength={6}
            required
            style={{ width: "100%", paddingRight: "40px", boxSizing: "border-box" }}
          />
          <i
            className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

        {error && (
          <p className="auth-error">
            {error}{" "}
            {isEmailTaken && (
              <span>
                Please{" "}
                <Link
                  to="/user/signin"
                  style={{ textDecoration: "underline", fontWeight: "bold" }}
                >
                  Log In
                </Link>{" "}
                or change your email ID.
              </span>
            )}
          </p>
        )}

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/user/signin">Sign In</Link>
      </p>
    </div>
  );
}

export default Register;