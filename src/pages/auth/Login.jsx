import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";

function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(form.email, form.password);

      if (!result.success) {
        setError(result.message || "Invalid email or password.");
        return;
      }

      navigate("/dashboard");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark">B</div>
          <div>
            <strong>BookYourAppointments</strong>
            {/* <strong>BookFlow</strong>
            <span>Appointment management</span> */}
          </div>
        </div>

        <div className="auth-heading">
          <h1>Welcome back</h1>
          <p>Sign in to manage your appointments and availability.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="google-auth-section">
          <GoogleSignInButton
            onCredential={async (credential) => {
              setError("");
              setLoading(true);

              try {
                const result = await loginWithGoogle(credential);

                if (!result.success) {
                  setError(
                    result.message || "Unable to sign in with Google."
                  );
                  return;
                }

                navigate("/dashboard");
              } catch (requestError) {
                setError(
                  requestError.response?.data?.message ||
                    "Unable to sign in with Google."
                );
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          />

          <div className="auth-divider">
            {/* <span>or continue with email</span> */}
          </div>
        </div>

        {/* <form onSubmit={handleSubmit} className="form-stack">
          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <Field
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <Button type="submit" loading={loading}>
            Sign in
          </Button>
        </form> */}

        {/* <p className="auth-footer">
          New to BookFlow? <Link to="/register">Create an account</Link>
        </p> */}
      </div>
    </div>
  );
}

export default Login;
