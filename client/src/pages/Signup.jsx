import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../services/auth";
import toast from "react-hot-toast";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      toast.error("All fields are required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await signupUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      toast.success("Account created successfully! Please sign in.");
      setForm({ name: "", email: "", password: "" });
      navigate("/login");
    } catch (err) {
      const errMsg = err.response?.data?.message || "Signup failed! Please try again.";
      toast.error(errMsg);
    } finally {
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
          Create an account and start managing your tasks productively today.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-bg-surface py-8 px-4 shadow-xl border border-border-ui rounded-lg sm:px-10">
          <h3 className="text-h3 font-bold mb-6 text-white border-b border-border-ui pb-3">
            Sign Up
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="name"
              name="name"
              label="Full Name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />

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
            <p className="text-xs text-gray-500 font-medium">
              * Password must be at least 6 characters.
            </p>

            <Button
              type="submit"
              loading={loading}
              variant="primary"
              size="md"
              className="w-full"
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center border-t border-border-ui pt-4">
            <p className="text-small text-text-muted">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-semibold transition focus-ring rounded px-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
