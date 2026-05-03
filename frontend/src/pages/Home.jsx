import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  Star,
  Globe,
  Brain,
  GraduationCap,
} from "@phosphor-icons/react";

gsap.registerPlugin(ScrollTrigger);

const partners = [
  "Y COMBINATOR",
  "TECHSTARS",
  "MIT",
  "STANFORD",
  "IIT BOMBAY",
  "NUS",
  "UC BERKELEY",
  "ETH ZÜRICH",
];

export default function Home() {
  const { auth } = useAuth();
  const user = auth?.user;
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    // Hero spotlight following cursor
    const onMove = (e) => {
      if (!spotlightRef.current) return;
      spotlightRef.current.style.setProperty("--x", `${e.clientX}px`);
      spotlightRef.current.style.setProperty("--y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", onMove);

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

      // Parallax of big marquee
      gsap.utils.toArray("[data-parallax]").forEach((el) => {
        gsap.to(el, {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Stats count-up
      gsap.utils.toArray("[data-count]").forEach((el) => {
        const to = +el.dataset.count;
        gsap.fromTo(
          el,
          { innerText: 0 },
          {
            innerText: to,
            duration: 2,
            ease: "power1.out",
            snap: { innerText: 1 },
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });
    }, heroRef);

    return () => {
      window.removeEventListener("mousemove", onMove);
      ctx.revert();
    };
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
            <a href="#stats" className="hover:text-[var(--cs-primary)]">
              Stats
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
      <section
        ref={spotlightRef}
        className="relative overflow-hidden border-b-2 border-[var(--cs-ink)]"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(600px circle at var(--x,50%) var(--y,30%), rgba(0,51,255,0.18), transparent 50%)",
          }}
        />
        <div className="dot-grid  absolute inset-0 opacity-70" />

        <div className="relative px-6 md:px-10 lg:px-16 pt-20 md:pt-28 pb-24 md:pb-36 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">

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
                  <span
                    className={`word inline-block ${
                      i === 3 || i === 4 ? "italic" : ""
                    }`}
                  >
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
              CollabSphere is where indie builders, students, and mentors find
              each other. Post an idea, get matched by an AI that actually reads
              skills, and ship something that matters — this semester.
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

          {/* Live match card */}
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.96, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="lg:col-span-4 relative"
          >
            <div className="bg-white border-2 border-[var(--cs-ink)] shadow-brutal-xl p-5">
              <div className="font-mono-cs text-[10px] tracking-widest uppercase text-muted-ink">
                LIVE MATCH · 00:03 AGO
              </div>
              <div className="mt-3 flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/80?img=47"
                  alt=""
                  className="w-12 h-12 border border-[var(--cs-ink)]"
                />
                <div className="text-sm">
                  <div className="font-bold">Aanya → NeuralNotes</div>
                  <div className="text-muted-ink">ML Engineer · 98% fit</div>
                </div>
              </div>
              <div className="h-px bg-[var(--cs-ink)] my-4" />
              <div className="text-xs font-mono-cs tracking-widest uppercase text-muted-ink">
                match reasoning
              </div>
              <div className="mt-2 text-sm leading-relaxed">
                Strong PyTorch + LLM background. Has shipped a Chrome ext
                before. Available ~10hr/wk.{" "}
                <span className="bg-[var(--cs-yellow)] px-1">
                  Instant green-light.
                </span>
              </div>
              <div className="mt-5 flex gap-2">
                <span className="border border-[var(--cs-ink)] px-2 py-1 text-xs">
                  PyTorch
                </span>
                <span className="border border-[var(--cs-ink)] px-2 py-1 text-xs">
                  LLMs
                </span>
                <span className="border border-[var(--cs-ink)] px-2 py-1 text-xs">
                  React
                </span>
              </div>
            </div>
            <div className="absolute -z-10 -bottom-6 -right-4 w-40 h-40 bg-[var(--cs-yellow)] border-2 border-[var(--cs-ink)] -rotate-6" />
            <div className="absolute -z-10 -top-4 -left-4 w-24 h-24 bg-[var(--cs-orange)] border-2 border-[var(--cs-ink)] rotate-12" />
          </motion.div> */}
        </div>

        {/* Marquee */}
        <div
          data-parallax
          className="border-t-2 border-[var(--cs-ink)] bg-[var(--cs-ink)] text-white overflow-hidden py-4"
        >
          <div className="marquee whitespace-nowrap font-mono-cs text-sm tracking-[0.25em] uppercase">
            {[...partners, ...partners].map((p, i) => (
              <span key={i} className="inline-flex items-center gap-6">
                <Star weight="fill" size={14} className="text-[var(--cs-yellow)]" />{" "}
                {p}
              </span>
            ))}
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
            A collab stack that feels like <span className="italic">magic</span>{" "}
            — because it is.
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
              Realtime Matchmaking
            </h3>
            <p className="mt-3 text-muted-ink max-w-md">
              Three recommended projects, re-ranked every time your profile
              changes. Not keyword search, but an LLM that actually reads your bio,
              past work and intent.
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
              Filter by skill, timezone, vibe. Send a two-click connect request.
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
              Mentors, on call
            </h3>
            <p className="mt-3 text-muted-ink">
              Ex-Google, ex-Stripe, PhDs. Most offer a free first call.
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
              Ship faster than solo
            </h3>
            <p className="mt-3 text-white/70">
              Built-in project boards, weekly nudges, demo-day visibility.
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
              Builder-only. No vanity metrics. Just wins, losses, launches.
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
          From &quot;I have an idea&quot; to &quot;we shipped it&quot; in three
          steps.
        </h2>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {[
            {
              n: "01",
              t: "Declare your stack",
              d: "Skills you actually use, interests that keep you up at night. The AI uses this.",
              color: "var(--cs-primary)",
            },
            {
              n: "02",
              t: "Get 3 matched projects",
              d: "Fresh every login. Join one, or post your own for others to find.",
              color: "var(--cs-orange)",
            },
            {
              n: "03",
              t: "Build in public",
              d: "Weekly standups, mentor check-ins, a feed that celebrates shipping.",
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

      {/* ─── Stats ─── */}
      <section
        id="stats"
        className="border-b-2 border-[var(--cs-ink)] bg-[var(--cs-ink)] text-white px-6 md:px-10 lg:px-16 py-24"
      >
        <div className="grid md:grid-cols-4 gap-10">
          {[
            { n: 4200, s: "builders", accent: "var(--cs-yellow)" },
            { n: 612, s: "projects shipped", accent: "var(--cs-orange)" },
            { n: 127, s: "active mentors", accent: "#FFFFFF" },
            { n: 38, s: "demo-day winners", accent: "var(--cs-pink)" },
          ].map((x, i) => (
            <div key={i} data-reveal>
              <div className="font-display text-6xl lg:text-7xl tracking-tighter">
                <span data-count={x.n}>0</span>
                <span style={{ color: x.accent }}>+</span>
              </div>
              <div className="mt-2 font-mono-cs text-xs tracking-[0.2em] uppercase text-white/70">
                {x.s}
              </div>
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
            <span className="italic">Build with us.</span>
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
          Built together, faster · powered by Groq
        </div>
      </footer>
    </div>
  );
}
