import React, { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "./api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
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

      // Send admins to the dashboard, customers to their profile
      const redirectPath = data.role === "admin" ? "/admin" : "/customer";
      navigate(redirectPath, {
        replace: true,
        state: { loginSuccess: true, message: `Welcome back ${data.name}` },
      });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page auth-login">
      <Navbar />
      <main className="login-shell">
        <section className="login-card">
          <h1 className="login-title">Login</h1>

          {error && <p className="login-error">{error}</p>}

          <form className="login-form" onSubmit={handleSubmit}>
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
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2h19.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
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

            <div className="login-options">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <a className="login-link" href="#">
                Forgot Password?
              </a>
            </div>

            <button className="login-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging In..." : "Login"}
            </button>

            <p className="login-register">
              Don’t have an account? <a href="/signup">Register</a>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Login;
