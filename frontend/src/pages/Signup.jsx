import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";
import { Sphere, ArrowRight } from "@phosphor-icons/react";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be ≥ 6 chars"); return; }
    setLoading(true);
    try {
      // By default this new design form registers a 'STUDENT'. 
      // Existing logic needed a role, passing "STUDENT" explicitly.
      const result = await signup(name.trim(), email.trim().toLowerCase(), password, "STUDENT", {});
      
      if (result && !result.success) {
        toast.error(result.message || "Signup failed");
      } else {
        toast.success("Account created. Let's build.");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.detail || "Signup failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="p-8 md:p-16 flex flex-col justify-center">
        <Link to="/" className="flex items-center gap-2 mb-12" data-testid="register-logo-link">
          <div className="w-9 h-9 grid place-items-center bg-[var(--cs-ink)] text-white"><Sphere weight="duotone" size={22} /></div>
          <span className="font-display text-xl tracking-tighter">CollabSphere</span>
        </Link>
        <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-[var(--cs-primary)]">claim your seat</div>
        <h1 className="font-display text-5xl sm:text-6xl tracking-tighter mt-3" data-testid="register-heading">Create your profile.</h1>
        <p className="mt-3 text-muted-ink max-w-sm">30 seconds. Then we'll AI-match you to 3 projects you'll actually love.</p>

        <GoogleAuthButton testId="register-google-btn" label="Sign up with Google" />

        <div className="flex items-center gap-4 max-w-md my-6">
          <div className="h-px bg-[var(--cs-ink)] flex-1" />
          <span className="font-mono-cs text-[10px] tracking-[0.25em] uppercase text-muted-ink">or email</span>
          <div className="h-px bg-[var(--cs-ink)] flex-1" />
        </div>

        <form onSubmit={onSubmit} className="max-w-md space-y-4">
          <label className="block">
            <span className="font-mono-cs text-[10px] tracking-[0.2em] uppercase">Name</span>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
              data-testid="register-name-input"
              className="mt-2 w-full px-4 py-3 bg-white border-2 border-[var(--cs-ink)] focus:outline-none focus:shadow-brutal-blue"
              placeholder="Your full name" />
          </label>
          <label className="block">
            <span className="font-mono-cs text-[10px] tracking-[0.2em] uppercase">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              data-testid="register-email-input"
              className="mt-2 w-full px-4 py-3 bg-white border-2 border-[var(--cs-ink)] focus:outline-none focus:shadow-brutal-blue"
              placeholder="you@college.edu" />
          </label>
          <label className="block">
            <span className="font-mono-cs text-[10px] tracking-[0.2em] uppercase">Password</span>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              data-testid="register-password-input"
              className="mt-2 w-full px-4 py-3 bg-white border-2 border-[var(--cs-ink)] focus:outline-none focus:shadow-brutal-blue"
              placeholder="min. 6 characters" />
          </label>
          <button type="submit" disabled={loading} data-testid="register-submit-btn"
            className="w-full btn-brutal bg-[var(--cs-primary)] text-white px-5 py-3.5 font-semibold inline-flex items-center justify-center gap-2">
            {loading ? "Creating…" : (<>Create my profile <ArrowRight size={18} /></>)}
          </button>
        </form>

        <div className="mt-6 text-sm">
          Already have an account? <Link to="/login" className="font-bold underline underline-offset-4 decoration-[var(--cs-primary)]" data-testid="register-to-login">Log in</Link>
        </div>
      </div>

      <div className="hidden md:block relative bg-[var(--cs-yellow)] overflow-hidden">
        <div className="absolute inset-0 grain" />
        <div className="relative h-full p-16 flex flex-col justify-end">
          <div className="font-display text-5xl tracking-tighter leading-[0.95]">
            Matched projects. <br/>Not <span className="italic gradient-text">keyword search</span>.
          </div>
          <div className="mt-6 font-mono-cs text-xs tracking-[0.25em] uppercase">Skill-similarity matching, scored per project</div>
        </div>
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-[var(--cs-primary)] border-2 border-[var(--cs-ink)] -rotate-6" />
        <div className="absolute top-20 right-20 w-32 h-32 border-2 border-[var(--cs-ink)] rotate-12" />
      </div>
    </div>
  );
}
