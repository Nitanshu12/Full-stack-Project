import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useAuth from "../hooks/useAuth";
import Logo from "../assets/Logo.png";
import {
  ArrowUpRight,
  Users,
  Sparkle,
  Code,
  Rocket,
  Globe,
  Brain,
  GraduationCap,
} from "@phosphor-icons/react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { auth } = useAuth();
  const user = auth?.user;
  const navigate = useNavigate();
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split-text style reveal on h1 words
      const words = document.querySelectorAll("[data-split='hero'] .word");
      gsap.from(words, {
        yPercent: 120,
        rotate: 8,
        duration: 1,
        ease: "expo.out",
        stagger: 0.06,
        delay: 0.2,
      });

      // Feature cards scroll reveal
      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%" },
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const HeroTitle = "We wire student ideas to real teammates.";
  const words = HeroTitle.split(" ");

  return (
    <div ref={heroRef} className="min-h-screen">
      {/* ─── Top nav ─── */}
      <header className="sticky top-0 z-40 border-b-2 border-[var(--cs-ink)] bg-[var(--cs-bg)]/80 backdrop-blur-md">
        <div className="px-6 md:px-10 lg:px-16 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2"
            data-testid="landing-logo"
          >
            <div className="w-15 h-15 grid place-items-center bg-[var(--cs-ink)] text-white">
             <img src={Logo} alt="Logo" size={30}/>
            </div>
            <div className="leading-none">
              <div className="font-display text-xl tracking-tighter">
                CollabSphere
              </div>
              <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-muted-ink">
                build · together · faster
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 font-mono-cs text-xs tracking-[0.2em] uppercase">
            <a href="#features" className="hover:text-[var(--cs-primary)]">
              Features
            </a>
            <a href="#how" className="hover:text-[var(--cs-primary)]">
              How it works
            </a>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="btn-brutal bg-[var(--cs-ink)] text-white px-4 py-2 text-sm font-semibold"
                data-testid="landing-to-dashboard"
              >
                Dashboard →
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-semibold hover:underline underline-offset-4"
                  data-testid="landing-login-link"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="btn-brutal bg-[var(--cs-ink)] text-white px-4 py-2 text-sm font-semibold"
                  data-testid="landing-signup-btn"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden border-b-2 border-[var(--cs-ink)]">
        <div className="dot-grid absolute inset-0 opacity-70" />

        <div className="relative px-6 md:px-10 lg:px-16 pt-20 md:pt-28 pb-24 md:pb-32">
          <div className="max-w-4xl">
            <h1
              data-split="hero"
              className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-tighter leading-[0.95] mt-6"
              data-testid="landing-hero-title"
            >
              {words.map((w, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden align-bottom pr-3"
                >
                  <span className="word inline-block">
                    {w === "real" ? (
                      <span className="gradient-text">{w}</span>
                    ) : (
                      w
                    )}
                  </span>
                </span>
              ))}
            </h1>

            <p className="mt-8 max-w-xl text-lg text-muted-ink leading-relaxed">
              CollabSphere is where students post project ideas, find
              teammates by actual skill fit, and keep momentum with mentors
              and a shared feed — all in one place.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="btn-brutal bg-[var(--cs-primary)] text-white px-6 py-4 font-semibold tracking-tight inline-flex items-center gap-2"
                data-testid="landing-cta-primary"
              >
                Start building for free <ArrowUpRight size={18} />
              </Link>
              <a
                href="#features"
                className="btn-brutal bg-white px-6 py-4 font-semibold tracking-tight inline-flex items-center gap-2"
                data-testid="landing-cta-secondary"
              >
                See how it works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features bento ─── */}
      <section
        id="features"
        className="border-b-2 border-[var(--cs-ink)] px-6 md:px-10 lg:px-16 py-24 md:py-32"
      >
        <div className="max-w-5xl">
          <h2 className="font-display text-4xl sm:text-6xl tracking-tighter mt-4">
            Everything you need to go from idea to shipped project.
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-12 gap-0 border-2 border-[var(--cs-ink)]">
          {/* Tile 1 big */}
          <div
            data-reveal
            className="md:col-span-7 p-8 md:p-10 border-r-2 border-b-2 border-[var(--cs-ink)] bg-white"
          >
            <Brain size={36} weight="duotone" className="text-[var(--cs-primary)]" />
            <h3 className="mt-6 font-display text-3xl tracking-tight">
              Smart matchmaking
            </h3>
            <p className="mt-3 text-muted-ink max-w-md">
              A recommendation engine re-ranks projects for you as your
              profile changes, so you see the ones that actually fit your
              skills and interests.
            </p>
          </div>

          <div
            data-reveal
            className="md:col-span-5 p-8 md:p-10 border-b-2 border-[var(--cs-ink)] bg-[var(--cs-yellow)]"
          >
            <Users size={36} weight="duotone" />
            <h3 className="mt-6 font-display text-3xl tracking-tight">
              Find teammates in minutes
            </h3>
            <p className="mt-3 text-ink/80">
              Filter by skill and interest, then send a connect request
              straight from a project page.
            </p>
          </div>

          <div
            data-reveal
            className="md:col-span-4 p-8 md:p-10 border-r-2 border-b-2 md:border-b-0 border-[var(--cs-ink)] bg-white"
          >
            <GraduationCap
              size={36}
              weight="duotone"
              className="text-[var(--cs-orange)]"
            />
            <h3 className="mt-6 font-display text-2xl tracking-tight">
              Mentor guidance
            </h3>
            <p className="mt-3 text-muted-ink">
              Reach out to registered mentors for feedback and direction.
            </p>
          </div>

          <div
            data-reveal
            className="md:col-span-4 p-8 md:p-10 border-r-2 border-b-2 md:border-b-0 border-[var(--cs-ink)] bg-[var(--cs-ink)] text-white"
          >
            <Rocket
              size={36}
              weight="duotone"
              className="text-[var(--cs-yellow)]"
            />
            <h3 className="mt-6 font-display text-2xl tracking-tight">
              Own your project
            </h3>
            <p className="mt-3 text-white/70">
              Post, edit, and manage your projects from one dashboard.
            </p>
          </div>

          <div data-reveal className="md:col-span-4 p-8 md:p-10 bg-white">
            <Code
              size={36}
              weight="duotone"
              className="text-[var(--cs-pink)]"
            />
            <h3 className="mt-6 font-display text-2xl tracking-tight">
              A feed, not a timeline
            </h3>
            <p className="mt-3 text-muted-ink">
              Builder-only updates from projects you follow — no vanity
              metrics.
            </p>
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section
        id="how"
        className="border-b-2 border-[var(--cs-ink)] px-6 md:px-10 lg:px-16 py-24 md:py-32"
      >
        <h2 className="font-display text-4xl sm:text-6xl tracking-tighter mt-4 max-w-3xl">
          From an idea to a shipped project, in three steps.
        </h2>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {[
            {
              n: "01",
              t: "Set up your profile",
              d: "Add the skills you actually use and the areas you're interested in.",
              color: "var(--cs-primary)",
            },
            {
              n: "02",
              t: "Get matched projects",
              d: "See projects ranked for you, join one, or post your own for others to find.",
              color: "var(--cs-orange)",
            },
            {
              n: "03",
              t: "Build together",
              d: "Connect with teammates and mentors, and track progress from your dashboard.",
              color: "var(--cs-pink)",
            },
          ].map((s) => (
            <div
              data-reveal
              key={s.n}
              className="border-2 border-[var(--cs-ink)] bg-white p-8 shadow-brutal"
            >
              <div
                className="font-mono-cs text-5xl font-bold tracking-tighter"
                style={{ color: s.color }}
              >
                {s.n}
              </div>
              <div className="font-display text-2xl tracking-tight mt-4">
                {s.t}
              </div>
              <p className="mt-3 text-muted-ink">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-6 md:px-10 lg:px-16 py-24 md:py-32 relative overflow-hidden border-b-2 border-[var(--cs-ink)]">
        <div className="absolute -top-10 -right-20 w-96 h-96 bg-[var(--cs-primary)] border-2 border-[var(--cs-ink)] -rotate-12" />
        <div className="absolute -bottom-16 -left-20 w-72 h-72 bg-[var(--cs-yellow)] border-2 border-[var(--cs-ink)] rotate-6" />

        <div className="relative max-w-3xl">
          <div className="font-mono-cs text-[10px] tracking-[0.2em] uppercase text-[var(--cs-primary)]">
            § 03 · YOUR MOVE
          </div>
          <h2 className="font-display text-5xl sm:text-7xl tracking-tighter mt-4">
            Stop building alone.{" "}
            <br />
            Build with us.
          </h2>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="btn-brutal bg-[var(--cs-ink)] text-white px-6 py-4 font-semibold inline-flex items-center gap-2"
              data-testid="landing-cta-bottom"
            >
              Claim your seat <Sparkle size={18} weight="fill" />
            </Link>
            <Link
              to="/login"
              className="btn-brutal bg-white px-6 py-4 font-semibold"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="px-6 md:px-10 lg:px-16 py-10 text-sm flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Globe weight="duotone" size={18} />
          <span className="font-display tracking-tighter text-lg">
            CollabSphere
          </span>
          <span className="text-muted-ink">
            © {new Date().getFullYear()}
          </span>
        </div>
        <div className="font-mono-cs text-xs tracking-[0.22em] uppercase text-muted-ink">
          Built together, faster
        </div>
      </footer>
    </div>
  );
}
