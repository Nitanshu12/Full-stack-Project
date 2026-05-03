import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import Header from "../components/Header";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus, Sparkle, X, Rocket, Lightning, Target } from "@phosphor-icons/react";

const suggestedTags = ["React", "Next.js", "Python", "AI/ML", "Node.js", "Mobile", "Design", "Web3", "Unity", "Rust", "Go", "GraphQL", "Postgres", "LLMs"];
const suggestedRoles = ["Frontend Dev", "Backend Dev", "Fullstack", "Designer", "ML Engineer", "Mobile Dev", "Product", "Marketing"];
const emojis = ["🚀", "🧠", "🎨", "🎮", "🎧", "🌱", "📚", "💡", "🔮", "🛸", "🛠️", "🎯", "🎬", "🪐", "🦄"];

export default function CreateProject() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    tags: [],
    looking_for: [],
    stage: "idea",
    timeline: "",
    commitment: "",
    cover_emoji: "🚀",
  });
  const [tagInput, setTagInput] = useState("");
  const [roleInput, setRoleInput] = useState("");

  useEffect(() => {
    const editProject = location.state?.projectToEdit;
    if (editProject) {
      setIsEditMode(true);
      setProjectToEdit(editProject);
      setForm({
        title: editProject.title || "",
        description: editProject.description || "",
        category: "",
        tags: editProject.tags || [],
        looking_for: editProject.lookingFor || [],
        stage: "idea",
        timeline: "",
        commitment: "",
        cover_emoji: "🚀",
      });
    }
  }, [location.state]);

  const add = (field, value, setter) => {
    const v = (value || "").trim();
    if (!v || form[field].includes(v)) { setter(""); return; }
    setForm(f => ({ ...f, [field]: [...f[field], v] }));
    setter("");
  };
  const remove = (field, value) => setForm(f => ({ ...f, [field]: f[field].filter(x => x !== value) }));

  const next = () => setStep(s => Math.min(3, s + 1));
  const back = () => setStep(s => Math.max(1, s - 1));

  const submit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        tags: form.tags,
        lookingFor: form.looking_for,
        location: "", // Required by backend schema loosely, setting default empty
        isRemote: true,
        status: "active"
      };

      let response;
      if (isEditMode && projectToEdit?._id) {
        response = await axiosPrivate.put(`/project/${projectToEdit._id}`, payload);
      } else {
        response = await axiosPrivate.post('/project/create', payload);
      }

      if (response.data.success) {
        toast.success(isEditMode ? "Project updated! 🚀" : "Project launched! 🚀");
        navigate("/dashboard", { state: { projectCreated: true } });
      } else {
        toast.error(response.data.message || (isEditMode ? "Failed to update project" : "Failed to create project"));
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        (isEditMode ? "An error occurred while updating the project" : "An error occurred while creating the project")
      );
    } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="px-6 md:px-10 lg:px-16 py-10 max-w-6xl mx-auto">
        {/* Back link */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-[var(--cs-primary)]" data-testid="create-back-link">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <div className="mt-6 grid lg:grid-cols-3 gap-10">
          {/* Left — Stepper + Hero */}
          <aside className="lg:col-span-1">
            <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-[var(--cs-primary)]">
              § {isEditMode ? "edit project" : "new project"}
            </div>
            <h1 className="font-display text-5xl tracking-tighter mt-2" data-testid="create-heading">
              {isEditMode ? "Update" : "Start"} <span className="italic">{isEditMode ? "your project" : "something"}</span> {isEditMode ? "" : "new."}
            </h1>
            <p className="mt-3 text-muted-ink">
              {isEditMode ? "Update your details and keep your teammates in sync." : "30 seconds to post. The AI will fetch your co-builders."}
            </p>

            <div className="mt-10 space-y-4">
              {[
                { n: 1, t: "The basics", d: "Title, category, what it is." },
                { n: 2, t: "The tech", d: "Stack, roles you need." },
                { n: 3, t: "The vibe", d: "Stage, timeline, commitment." },
              ].map(s => (
                <div key={s.n} className={`border-2 border-[var(--cs-ink)] p-4 ${step === s.n ? "bg-[var(--cs-yellow)] shadow-brutal" : "bg-white"}`} data-testid={`create-step-${s.n}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 grid place-items-center border border-[var(--cs-ink)] font-mono-cs font-bold ${step > s.n ? "bg-[var(--cs-ink)] text-white" : ""}`}>
                      {step > s.n ? "✓" : s.n}
                    </div>
                    <div className="font-bold">{s.t}</div>
                  </div>
                  <div className="text-xs text-muted-ink mt-1 pl-11">{s.d}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 border-2 border-[var(--cs-ink)] bg-[var(--cs-ink)] text-white p-5">
              <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-[var(--cs-yellow)]">pro tip</div>
              <p className="mt-2 text-sm leading-relaxed">
                The clearer your description & roles, the better CollabSphere AI can match you with the right people. <Sparkle size={14} weight="fill" className="inline text-[var(--cs-yellow)]" />
              </p>
            </div>
          </aside>

          {/* Right — Form */}
          <section className="lg:col-span-2">
            <div className="border-2 border-[var(--cs-ink)] bg-white shadow-brutal-lg">
              {/* Live preview strip */}
              <div className="border-b-2 border-[var(--cs-ink)] bg-[var(--cs-bg)] p-5 flex items-center gap-4">
                <div className="w-16 h-16 grid place-items-center border-2 border-[var(--cs-ink)] bg-white text-3xl" data-testid="create-emoji-preview">{form.cover_emoji}</div>
                <div className="min-w-0 flex-1">
                  <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-muted-ink">Live preview</div>
                  <div className="font-display text-2xl tracking-tight truncate">{form.title || "Untitled project"}</div>
                  <div className="text-xs text-muted-ink truncate">{form.description || "Your pitch in one line will appear here"}</div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                    <h2 className="font-display text-2xl tracking-tight">1 · The basics</h2>

                    <label className="block">
                      <div className="font-mono-cs text-[10px] tracking-[0.2em] uppercase">Pick a cover</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {emojis.map(e => (
                          <button key={e} type="button" onClick={() => setForm({...form, cover_emoji: e})}
                            className={`w-10 h-10 grid place-items-center border-2 border-[var(--cs-ink)] text-xl ${form.cover_emoji === e ? "bg-[var(--cs-yellow)] shadow-brutal" : "bg-white hover:bg-[var(--cs-bg)]"}`}
                            data-testid={`create-emoji-${e}`}>
                            {e}
                          </button>
                        ))}
                      </div>
                    </label>

                    <label className="block">
                      <div className="font-mono-cs text-[10px] tracking-[0.2em] uppercase">Title *</div>
                      <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                        placeholder="e.g. NeuralNotes — AI study companion"
                        className="mt-2 w-full px-4 py-3 border-2 border-[var(--cs-ink)] focus:outline-none focus:shadow-brutal-blue"
                        data-testid="create-title-input" />
                    </label>

                    <label className="block">
                      <div className="font-mono-cs text-[10px] tracking-[0.2em] uppercase">Category</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {["AI/ML", "Web App", "Mobile", "DevTools", "Gaming", "Design", "Hardware", "Social"].map(c => (
                          <button key={c} type="button" onClick={() => setForm({...form, category: c})}
                            className={`px-3 py-1.5 text-xs border-2 border-[var(--cs-ink)] font-semibold ${form.category === c ? "bg-[var(--cs-ink)] text-white" : "bg-white"}`}
                            data-testid={`create-category-${c}`}>
                            {c}
                          </button>
                        ))}
                      </div>
                    </label>

                    <label className="block">
                      <div className="font-mono-cs text-[10px] tracking-[0.2em] uppercase">Description *</div>
                      <textarea rows={5} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                        placeholder="What are you building? Who is it for? What makes it different?"
                        className="mt-2 w-full px-4 py-3 border-2 border-[var(--cs-ink)] focus:outline-none focus:shadow-brutal-blue"
                        data-testid="create-desc-input" />
                      <div className="mt-1 text-xs text-muted-ink">{form.description.length} / 500 · clear pitches attract better matches</div>
                    </label>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <h2 className="font-display text-2xl tracking-tight">2 · The tech & team</h2>

                    <TagBlock title="Tech stack / tags" field="tags" suggestions={suggestedTags} values={form.tags} input={tagInput} setInput={setTagInput} add={add} remove={remove} />

                    <TagBlock title="Looking for (roles)" field="looking_for" suggestions={suggestedRoles} values={form.looking_for} input={roleInput} setInput={setRoleInput} add={add} remove={remove} accent="var(--cs-orange)" />
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                    <h2 className="font-display text-2xl tracking-tight">3 · The vibe</h2>

                    <label className="block">
                      <div className="font-mono-cs text-[10px] tracking-[0.2em] uppercase">Stage</div>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {[
                          { v: "idea", t: "Just an idea", icon: Lightning },
                          { v: "mvp", t: "Building MVP", icon: Rocket },
                          { v: "scaling", t: "Scaling up", icon: Target },
                        ].map(s => (
                          <button key={s.v} type="button" onClick={() => setForm({...form, stage: s.v})}
                            className={`p-4 border-2 border-[var(--cs-ink)] text-left ${form.stage === s.v ? "bg-[var(--cs-yellow)] shadow-brutal" : "bg-white"}`}
                            data-testid={`create-stage-${s.v}`}>
                            <s.icon size={20} weight="duotone" />
                            <div className="mt-2 text-sm font-bold">{s.t}</div>
                          </button>
                        ))}
                      </div>
                    </label>

                    <label className="block">
                      <div className="font-mono-cs text-[10px] tracking-[0.2em] uppercase">Timeline</div>
                      <input value={form.timeline} onChange={e => setForm({...form, timeline: e.target.value})}
                        placeholder="e.g. ~3 months · ship by Nov · weekend project"
                        className="mt-2 w-full px-4 py-3 border-2 border-[var(--cs-ink)] focus:outline-none"
                        data-testid="create-timeline-input" />
                    </label>

                    <label className="block">
                      <div className="font-mono-cs text-[10px] tracking-[0.2em] uppercase">Commitment</div>
                      <input value={form.commitment} onChange={e => setForm({...form, commitment: e.target.value})}
                        placeholder="e.g. 5-10 hrs/week · full-time · evenings"
                        className="mt-2 w-full px-4 py-3 border-2 border-[var(--cs-ink)] focus:outline-none"
                        data-testid="create-commitment-input" />
                    </label>

                    <div className="border-2 border-[var(--cs-ink)] bg-[var(--cs-bg)] p-4">
                      <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-[var(--cs-primary)]">ready to launch</div>
                      <div className="mt-1 text-sm">
                        {isEditMode 
                          ? "Tap Update project to save your changes." 
                          : "Tap Launch project to go live. Your teammates are already waiting."}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Nav */}
                <div className="mt-8 flex items-center justify-between">
                  {step > 1 ? (
                    <button type="button" onClick={back} className="btn-brutal bg-white px-5 py-2.5 font-semibold inline-flex items-center gap-2" data-testid="create-back-btn">
                      <ArrowLeft size={16} /> Back
                    </button>
                  ) : <span />}
                  {step < 3 ? (
                    <button type="button" onClick={next} className="btn-brutal bg-[var(--cs-ink)] text-white px-5 py-2.5 font-semibold inline-flex items-center gap-2" data-testid="create-next-btn">
                      Next <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button type="button" onClick={submit} disabled={saving} className="btn-brutal bg-[var(--cs-primary)] text-white px-6 py-3 font-semibold inline-flex items-center gap-2" data-testid="create-submit-btn">
                      <Rocket size={18} weight="fill" /> {saving ? (isEditMode ? "Updating..." : "Launching…") : (isEditMode ? "Update project" : "Launch project")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function TagBlock({ title, field, suggestions, values, input, setInput, add, remove, accent = "var(--cs-yellow)" }) {
  return (
    <div>
      <div className="font-mono-cs text-[10px] tracking-[0.2em] uppercase">{title}</div>
      <div className="mt-2 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(field, input, setInput); } }}
          placeholder={`Type & press enter`}
          className="flex-1 px-4 py-3 border-2 border-[var(--cs-ink)] focus:outline-none"
          data-testid={`create-${field}-input`} />
        <button type="button" onClick={() => add(field, input, setInput)} className="btn-brutal bg-[var(--cs-ink)] text-white px-4">
          <Plus size={16} weight="bold" />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.map(v => (
          <span key={v} className="inline-flex items-center gap-1.5 border-2 border-[var(--cs-ink)] px-3 py-1 text-sm font-semibold" style={{ background: accent, color: accent === "var(--cs-ink)" ? "white" : "black" }}>
            {v}
            <button type="button" onClick={() => remove(field, v)}><X size={12} weight="bold" /></button>
          </span>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {suggestions.filter(s => !values.includes(s)).map(s => (
          <button key={s} type="button" onClick={() => add(field, s, () => {})} className="text-xs px-2 py-1 border border-[var(--cs-ink)] hover:bg-[var(--cs-yellow)]">
            + {s}
          </button>
        ))}
      </div>
    </div>
  );
}

