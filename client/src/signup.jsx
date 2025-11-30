import React, { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "./api";

function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    const name = fullName.trim();

    try {
      const data = await apiFetch("/api/users/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      // After successful signup, redirect back to landing page
      // and pass a small success message via location state so
      // the landing page can inform the user they may now log in.
      navigate("/", {
        state: { signupSuccess: true, message: "Account created! You can now log in." },
      });
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="auth-page auth-signup">
      <Navbar />
      <main className="login-shell">
        <section className="login-card">
          <h1 className="login-title">Create Account</h1>

          {error && <p className="login-error">{error}</p>}

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-input">
              <span className="sr-only">Full Name</span>
              <input
                type="text"
                name="fullName"
                required
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <svg className="input-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2h19.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </label>

            <label className="login-input">
              <span className="sr-only">Email Address</span>
              <input
                type="email"
                name="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <svg className="input-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.1-.5 7.4 5.1c.3.2.7.2 1 0L19.9 6H4.1ZM20 8.4l-6.3 4.4a2.5 2.5 0 0 1-2.9 0L4 8.4V17.5c0 .3.2.5.5.5h15c.3 0 .5-.2.5-.5V8.4Z" />
              </svg>
            </label>

            <label className="login-input">
              <span className="sr-only">Password</span>
              <input
                type="password"
                name="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <svg className="input-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17 9h-1V7a4 4 0 00-8 0v2H7a1 1 0 00-1 1v9a1 1 0 001 1h10a1 1 0 001-1v-9a1 1 0 00-1-1zM9 7a3 3 0 016 0v2H9V7zm8 12H7v-7h10v7z" />
              </svg>
            </label>

            <label className="login-input">
              <span className="sr-only">Repeat Password</span>
              <input
                type="password"
                name="confirmPassword"
                required
                placeholder="Repeat Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <svg className="input-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17 9h-1V7a4 4 0 00-8 0v2H7a1 1 0 00-1 1v9a1 1 0 001 1h10a1 1 0 001-1v-9a1 1 0 00-1-1zM9 7a3 3 0 016 0v2H9V7zm8 12H7v-7h10v7z" />
              </svg>
            </label>

            <button className="login-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>

            <p className="login-register">
              Already have an account? <a href="/login">Login</a>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Signup;
