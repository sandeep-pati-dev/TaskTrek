import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/auth";
import toast from "react-hot-toast";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      toast.error("All fields are required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({
        email: form.email.trim(),
        password: form.password,
      });
      const { token, user } = data;
      login({ user, token });
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/dashboard");
    } catch (err) {
      const errMsg = err.response?.data?.message || "Invalid email or password.";
      toast.error(errMsg);
    } finally {
      setForm((prev) => ({ ...prev, password: "" }));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-app flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-display tracking-tight text-white mb-2">
          TaskTrek
        </h2>
        <p className="text-small text-text-muted px-4 leading-relaxed">
          Personal task management, built for high-performance productivity.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-bg-surface py-8 px-4 shadow-xl border border-border-ui rounded-lg sm:px-10">
          <h3 className="text-h3 font-bold mb-6 text-white border-b border-border-ui pb-3">
            Sign In
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="email"
              name="email"
              label="Email Address"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />

            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />

            <Button
              type="submit"
              loading={loading}
              variant="primary"
              size="md"
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center border-t border-border-ui pt-4">
            <p className="text-small text-text-muted">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-400 hover:text-blue-300 font-semibold transition focus-ring rounded px-1"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
