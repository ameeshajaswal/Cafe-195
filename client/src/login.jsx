import React, { useState } from "react";
import { apiFetch } from "./api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const data = await apiFetch("/api/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      // Persist auth for later use
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role
      }));

      setSuccess("Logged in successfully.");
      setEmail("");
      setPassword("");
      console.log("Login success response:", data);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <h1>Log In</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email Address
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging In..." : "Log In"}
        </button>
      </form>
    </main>
  );
}

export default Login;
