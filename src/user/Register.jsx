
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const savedUsers = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    // Check whether the email is already registered
    const existingUser = savedUsers.find(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existingUser) {
      setError("This email is already registered.");
      return;
    }

    const newId =
      savedUsers.length > 0
        ? Math.max(...savedUsers.map((user) => Number(user.id) || 0)) + 1
        : 1;

    const newUser = {
      id: newId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: "User",
      status: "Active",
    };

    localStorage.setItem(
      "users",
      JSON.stringify([...savedUsers, newUser])
    );

    alert("Registration successful! Please sign in.");
    navigate("/user/signin");
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
          minLength={6}
          required
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/user/signin">Sign In</Link>
      </p>
    </div>
  );
}

export default Register;
