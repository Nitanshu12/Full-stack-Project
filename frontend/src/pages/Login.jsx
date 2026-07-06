import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";
import { Sphere, ArrowRight } from "@phosphor-icons/react";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email.trim().toLowerCase(), password);
      // login method from AuthProvider returns { success, message, data, error }
      if (result && !result.success) {
        toast.error(result.message || "Login failed");
      } else {
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.detail || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left — form */}
      <div className="p-8 md:p-16 flex flex-col justify-center">
        <Link to="/" className="flex items-center gap-2 mb-12" data-testid="login-logo-link">
          <div className="w-9 h-9 grid place-items-center bg-[var(--cs-ink)] text-white"><Sphere weight="duotone" size={22} /></div>
          <span className="font-display text-xl tracking-tighter">CollabSphere</span>
        </Link>
        <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-[var(--cs-primary)]">welcome back</div>
        <h1 className="font-display text-5xl sm:text-6xl tracking-tighter mt-3" data-testid="login-heading">Log in.</h1>
        <p className="mt-3 text-muted-ink max-w-sm">Pick up where you left off. Your matches got smarter overnight.</p>

        <GoogleAuthButton testId="login-google-btn" label="Continue with Google" />

        <div className="flex items-center gap-4 max-w-md my-6">
          <div className="h-px bg-[var(--cs-ink)] flex-1" />
          <span className="font-mono-cs text-[10px] tracking-[0.25em] uppercase text-muted-ink">or email</span>
          <div className="h-px bg-[var(--cs-ink)] flex-1" />
        </div>

        <form onSubmit={onSubmit} className="max-w-md space-y-4">
          <label className="block">
            <span className="font-mono-cs text-[10px] tracking-[0.2em] uppercase">Email</span>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="login-email-input"
              className="mt-2 w-full px-4 py-3 bg-white border-2 border-[var(--cs-ink)] focus:outline-none focus:shadow-brutal-blue transition-shadow"
              placeholder="you@college.edu"
            />
          </label>
          <label className="block">
            <span className="font-mono-cs text-[10px] tracking-[0.2em] uppercase">Password</span>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="login-password-input"
              className="mt-2 w-full px-4 py-3 bg-white border-2 border-[var(--cs-ink)] focus:outline-none focus:shadow-brutal-blue transition-shadow"
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit" disabled={loading} data-testid="login-submit-btn"
            className="w-full btn-brutal bg-[var(--cs-ink)] text-white px-5 py-3.5 font-semibold inline-flex items-center justify-center gap-2"
          >
            {loading ? "Logging in…" : (<>Log in <ArrowRight size={18} /></>)}
          </button>
        </form>

        <div className="mt-6 text-sm">
          New here? <Link to="/signup" className="font-bold underline underline-offset-4 decoration-[var(--cs-primary)]" data-testid="login-to-register">Create an account</Link>
        </div>
      </div>

      {/* Right — visual */}
      <div className="hidden md:block relative bg-[var(--cs-ink)] text-white overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="absolute top-10 left-10 right-10 font-mono-cs text-[10px] tracking-[0.25em] uppercase text-white/60">Live · ops.collabsphere</div>
        <div className="relative h-full p-16 flex flex-col justify-end">
          <div className="font-display text-4xl sm:text-5xl tracking-tighter leading-[0.95]">
            Post a project. Get matched by <span className="gradient-text">actual skill fit</span>. Build with people who can help.
          </div>
          <div className="mt-6 font-mono-cs text-xs tracking-[0.25em] uppercase text-white/60">
            skill-match scoring · mentor network · live project feed
          </div>
        </div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[var(--cs-yellow)] rotate-12" />
        <div className="absolute top-20 right-16 w-40 h-40 border-2 border-white" />
      </div>
    </div>
  );
}
