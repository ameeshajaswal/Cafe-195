import React, { useState } from "react";
import { apiFetch } from "./api";

function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    const UserID = Date.now().toString(); // simple placeholder
    const name = fullName.trim();

    try {
      const data = await apiFetch("/api/users/register", {
        method: "POST",
        body: JSON.stringify({
          UserID,
          name,
          email,
          password,
        }),
      });

      setSuccess("Account created! You can now log in.");
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      console.log("Signup success response:", data);
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main>
      <h1>Create Your Account</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Full Name
          <input
            type="text"
            name="fullName"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </label>

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

        <label>
          Repeat Password
          <input
            type="password"
            name="confirmPassword"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </main>
  );
}

export default Signup;
