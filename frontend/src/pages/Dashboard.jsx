import React, { useEffect, useState } from "react";
import { axiosPrivate } from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import { Plus, MagnifyingGlass, GraduationCap, Folder, FolderOpen, ChatCircle, LinkSimple, FileText, Sparkle, ArrowRight, TrendUp, Lightning } from "@phosphor-icons/react";

const API = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:8080"}/api`;

const SpotlightCard = ({ children, className, onClick, ...props }) => (
  <div className={className} onClick={onClick} {...props}>
    {children}
  </div>
);

const quickActions = [
  { to: "/create-project", label: "Create Project", sub: "Start something new today", icon: Plus, accent: "var(--cs-primary)" },
  { to: "/smart-matches", label: "Find Teammates", sub: "Discover matching collaborators", icon: MagnifyingGlass, accent: "var(--cs-orange)" },
  { to: "/mentorship", label: "Find Mentor", sub: "Get expert guidance", icon: GraduationCap, accent: "var(--cs-pink)" },
  { to: "/projects", label: "Browse Projects", sub: "See what others are building", icon: FolderOpen, accent: "var(--cs-ink)" },
];

export default function Dashboard() {
  const { auth } = useAuth();
  const user = auth?.user;
  const navigate = useNavigate();
  const [stats, setStats] = useState({ active_projects: 0, connections: 0, messages: 0, posts: 0 });
  const [rec, setRec] = useState({ projects: [], reasoning: "", powered_by: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, r] = await Promise.all([
          axiosPrivate.get(`/project/stats`),
          axiosPrivate.get(`/student/recommended-projects`),
        ]);
        setStats({
          active_projects: s.data?.data?.activeProjects || 0,
          connections: s.data?.data?.connections || 0,
          messages: 0,
          posts: 0
        });
        const projectsData = r.data?.data || r.data || [];
        setRec({
          projects: Array.isArray(projectsData) ? projectsData : (projectsData.projects || []),
          reasoning: projectsData.reasoning || "",
          powered_by: projectsData.powered_by || ""
        });
      } catch (e) { /* ignore */ }
      finally { setLoading(false); }
    })();
  }, []);

  const firstName = (user?.name || "You").split(" ")[0];
  const needsProfile = !(user?.skills?.length) && !(user?.interests?.length);

  return (
    <div className="min-h-screen bg-[var(--cs-bg)]">
      <Header />

      <main className="px-6 md:px-10 lg:px-16 py-10 space-y-10">
        {/* Welcome hero */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="relative border-2 border-[var(--cs-ink)] bg-white p-8 md:p-12 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[var(--cs-yellow)] rotate-12 z-0" />
            <div className="absolute -bottom-12 right-32 w-28 h-28 border-2 border-[var(--cs-ink)] bg-[var(--cs-primary)] z-0" />
            <div className="relative z-10">
              <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-[var(--cs-primary)]">dashboard · {new Date().toLocaleDateString("en", { weekday: "long" })}</div>
              <h1 className="font-display text-5xl sm:text-7xl tracking-tighter mt-3" data-testid="dashboard-welcome">
                Welcome back, <span className="italic">{firstName}.</span>
              </h1>
              <p className="mt-4 text-muted-ink max-w-xl">Here's what's happening inside your sphere today.</p>

              {needsProfile && (
                <div className="mt-6 inline-flex items-center gap-3 border-2 border-[var(--cs-ink)] bg-[var(--cs-yellow)] px-4 py-2 shadow-brutal">
                  <Lightning size={18} weight="fill" />
                  <span className="text-sm font-semibold">Add skills & interests to unlock AI-powered project matches →</span>
                  <Link to="/profile" className="font-mono-cs text-[10px] tracking-widest uppercase underline underline-offset-2" data-testid="dashboard-profile-cta">Complete profile</Link>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Stats cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-[var(--cs-ink)] bg-white">
          {[
            { label: "Active Projects", value: stats.active_projects, icon: Folder, accent: "var(--cs-primary)" },
            { label: "Connections", value: stats.connections, icon: LinkSimple, accent: "var(--cs-orange)" },
            { label: "Messages", value: stats.messages, icon: ChatCircle, accent: "var(--cs-pink)" },
            { label: "Posts", value: stats.posts, icon: FileText, accent: "var(--cs-ink)" },
          ].map((s, i) => (
            <div
              key={s.label}
              data-testid={`stat-${s.label.toLowerCase().replace(" ", "-")}`}
              className={`p-6 md:p-8 ${i < 3 ? "md:border-r-2 border-[var(--cs-ink)]" : ""} ${i < 2 ? "border-b-2 lg:border-b-0" : ""} ${i === 0 || i === 2 ? "border-r-2" : ""} relative`}
            >
              <div className="flex items-center justify-between">
                <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-muted-ink">{s.label}</div>
                <TrendUp size={14} className="text-[var(--cs-primary)]" />
              </div>
              <div className="mt-4 flex items-end gap-3">
                <div className="font-display text-6xl tracking-tighter leading-none">{s.value}</div>
                <div className="mb-1 w-10 h-10 grid place-items-center border border-[var(--cs-ink)]" style={{ background: s.accent, color: s.accent === "var(--cs-ink)" ? "white" : "black" }}>
                  <s.icon size={20} weight="duotone" />
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-ink">No updates yet</div>
            </div>
          ))}
        </section>

        {/* Quick actions */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-[var(--cs-primary)]">§ quick actions</div>
              <h2 className="font-display text-3xl sm:text-4xl tracking-tighter mt-1">Move fast today.</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((a, i) => (
              <SpotlightCard
                key={i}
                accent={a.accent}
                onClick={() => navigate(a.to)}
                role="button"
                data-testid={`quick-action-${a.label.toLowerCase().replace(/ /g, "-")}`}
                className="cursor-pointer border-2 border-[var(--cs-ink)] bg-white p-6 shadow-brutal hover:shadow-brutal-lg transition-shadow"
              >
                <div className="w-12 h-12 grid place-items-center border border-[var(--cs-ink)]" style={{ background: a.accent, color: a.accent === "var(--cs-ink)" ? "white" : "black" }}>
                  <a.icon size={24} weight="duotone" />
                </div>
                <div className="mt-5 font-display text-xl tracking-tight">{a.label}</div>
                <div className="mt-1 text-sm text-muted-ink">{a.sub}</div>
                <div className="mt-4 font-mono-cs text-[10px] tracking-[0.22em] uppercase inline-flex items-center gap-1 text-[var(--cs-primary)]">
                  Go <ArrowRight size={12} />
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>

        {/* Recommended Projects (AI) */}
        <section>
          <div className="flex flex-wrap items-end justify-between mb-6 gap-3">
            <div>
              <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase inline-flex items-center gap-2">
                <Sparkle size={12} weight="fill" className="text-[var(--cs-primary)]" />
                <span className="gradient-text font-bold">Matched for you</span>
                <span className="text-muted-ink">· skill-similarity scoring</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl tracking-tighter mt-1" data-testid="recommended-heading">Recommended projects for you.</h2>
              {rec.reasoning && <p className="text-muted-ink text-sm mt-2 max-w-2xl">"{rec.reasoning}"</p>}
            </div>
            <Link to="/projects" className="btn-brutal bg-white px-4 py-2 text-sm font-semibold inline-flex items-center gap-2" data-testid="recommended-see-all">
              Browse all <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid lg:grid-cols-3 gap-4">
              {[0,1,2].map(i => <div key={i} className="h-64 border-2 border-[var(--cs-ink)] bg-white animate-pulse" />)}
            </div>
          ) : rec.projects.length === 0 ? (
            <div className="border-2 border-[var(--cs-ink)] bg-white p-10 text-center">
              <div className="font-display text-2xl tracking-tight">No matches yet</div>
              <p className="text-muted-ink mt-2">Add skills and interests on your profile, or create the first project.</p>
              <Link to="/profile" className="mt-4 inline-block btn-brutal bg-[var(--cs-ink)] text-white px-4 py-2 text-sm font-semibold">Complete profile</Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-4">
              {rec.projects.slice(0, 3).map((p, i) => (
                <motion.div
                  key={p.project_id || p._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="ai-card border-2 border-[var(--cs-ink)] bg-white p-6 flex flex-col"
                  data-testid={`recommended-card-${i}`}
                >
                  <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-[var(--cs-primary)] inline-flex items-center gap-1">
                    <Sparkle size={10} weight="fill" /> match #{i + 1}
                  </div>
                  <div className="font-display text-2xl tracking-tight mt-3 leading-tight">{p.title}</div>
                  <p className="text-sm text-muted-ink mt-2 line-clamp-3">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {(p.tags || []).slice(0, 4).map((t, idx) => (
                      <span key={idx} className="border border-[var(--cs-ink)] px-2 py-0.5 text-[11px] font-semibold bg-[var(--cs-yellow)]">{t}</span>
                    ))}
                  </div>
                  <div className="mt-auto pt-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={p.owner_picture || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (p.createdBy?.name || p.owner_name || "User")} alt="" className="w-7 h-7 border border-[var(--cs-ink)] bg-white rounded-full" />
                      <div className="text-xs">
                        <div className="font-bold leading-none">{p.createdBy?.name || p.owner_name || "Unknown"}</div>
                        <div className="text-muted-ink mt-0.5">owner</div>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        try { await axiosPrivate.post(`/projects/${p._id || p.project_id}/join`); navigate("/projects"); } catch { /* noop */ }
                      }}
                      className="btn-brutal bg-[var(--cs-ink)] text-white px-3 py-1.5 text-xs font-semibold"
                      data-testid={`recommended-join-${i}`}
                    >
                      Join →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
