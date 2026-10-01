import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Field from "../../components/ui/Field";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";

function Register() {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    profession: "",
    business_name: "",
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
      const result = await register(form);

      if (!result.success) {
        setError(result.message || "Unable to create your account.");
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
      <div className="auth-card auth-card-wide">
        <div className="auth-brand">
          <div className="brand-mark">B</div>
          <div>
            <strong>BookFlow</strong>
            <span>Appointment management</span>
          </div>
        </div>

        <div className="auth-heading">
          <h1>Create your workspace</h1>
          <p>Set up your professional profile and start accepting bookings.</p>
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
                    result.message ||
                      "Unable to continue with Google. If an account already exists, sign in with your password first."
                  );
                  return;
                }

                navigate("/dashboard");
              } catch (requestError) {
                setError(
                  requestError.response?.data?.message ||
                    "Unable to continue with Google."
                );
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          />

          <div className="auth-divider">
            <span>or create with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <Field
            label="Your name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Rahul Sharma"
            required
          />

          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="rahul@example.com"
            required
          />

          <Field
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Minimum 8 characters"
            required
          />

          <Field
            label="Profession"
            name="profession"
            value={form.profession}
            onChange={handleChange}
            placeholder="Dentist, Lawyer, Consultant..."
          />

          <Field
            label="Business / clinic name"
            name="business_name"
            value={form.business_name}
            onChange={handleChange}
            placeholder="Your business name"
          />

          <div className="form-grid-full">
            <Button type="submit" loading={loading}>
              Create account
            </Button>
          </div>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
