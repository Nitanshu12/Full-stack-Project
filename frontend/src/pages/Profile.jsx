import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Check, Plus, X, Folder, LinkSimple, Trash, ArrowRight, Sparkle, PencilSimple, ChatCircle, FileText, Handshake } from "@phosphor-icons/react";

const skillSuggestions = ["React", "Python", "Node.js", "AI/ML", "Figma", "PyTorch", "Next.js", "Rust", "Mobile", "Design", "Go", "Web3", "TypeScript", "Postgres"];
const interestSuggestions = ["Startups", "SaaS", "AI Agents", "Climate", "Education", "Gaming", "Music", "Fintech", "Health", "AR/VR", "Productivity", "DevTools"];

export default function Profile() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(auth?.user || null);
  
  const [form, setForm] = useState({ name: "", bio: "", skills: [], interests: [], role: "student" });
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("overview"); // overview | edit

  // Data for overview
  const [myProjects, setMyProjects] = useState({ owned: [], joined: [] });
  const [connections, setConnections] = useState([]);
  const [stats, setStats] = useState({ active_projects: 0, connections: 0, messages: 0, posts: 0 });
  const [posts, setPosts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoadingData(true);
      try {
        // Refresh user details to get latest skills/interests
        const userRes = await axiosPrivate.get('/user-details');
        let currentUser = auth?.user;
        if (userRes.data?.success) {
          currentUser = userRes.data.data;
          setUser(currentUser);
        }
        
        if (currentUser) {
          setForm({
            name: currentUser.name || "", 
            bio: currentUser.bio || "",
            skills: currentUser.skills || [], 
            interests: currentUser.interests || [],
            role: currentUser.role || "student",
          });
        }

        const [projRes, connRes] = await Promise.all([
          axiosPrivate.get('/project/mine').catch(() => ({ data: { data: { projects: [] } } })),
          axiosPrivate.get('/connections/my').catch(() => ({ data: { data: [] } })),
        ]);
        
        const ownedProjects = projRes.data?.data?.projects || [];
        const myConns = connRes.data?.data || [];
        
        setMyProjects({ owned: ownedProjects, joined: [] });
        setConnections(myConns);
        
        setStats({
          active_projects: ownedProjects.length,
          connections: myConns.length,
          messages: 0, 
          posts: 0
        });
        
        setPosts([]); // No posts endpoint currently
      } catch (e) { 
        // noop 
      } finally { 
        setLoadingData(false); 
      }
    };
    
    fetchProfileData();
  }, [auth]);

  const addTag = (field, value, setter) => {
    const v = (value || "").trim();
    if (!v || form[field].includes(v)) { setter(""); return; }
    setForm(f => ({ ...f, [field]: [...f[field], v] }));
    setter("");
  };
  
  const removeTag = (field, value) => setForm(f => ({ ...f, [field]: f[field].filter(x => x !== value) }));

  const save = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      // Backend only supports updating skills and interests via this endpoint
      const res = await axiosPrivate.put('/update-profile', { 
        skills: form.skills,
        interests: form.interests
      });
      
      if (res.data?.success) {
        setUser(res.data.data);
        toast.success("Profile saved");
        setTab("overview");
      } else {
        toast.error("Save failed");
      }
    } catch { 
      toast.error("Save failed"); 
    } finally { 
      setSaving(false); 
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    try {
      await axiosPrivate.delete(`/project/${id}`);
      toast.success("Project deleted");
      setMyProjects(prev => ({
        ...prev,
        owned: prev.owned.filter(p => p._id !== id)
      }));
      setStats(prev => ({ ...prev, active_projects: prev.active_projects - 1 }));
    } catch { 
      toast.error("Delete failed"); 
    }
  };

  const initials = (user?.name || "U").split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="px-6 md:px-10 lg:px-16 py-10 space-y-10 max-w-7xl mx-auto">
        {/* Banner / header */}
        <section className="relative border-2 border-[var(--cs-ink)] bg-white p-6 md:p-8 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-56 h-56 bg-[var(--cs-yellow)] rotate-12 z-0" />
          <div className="absolute -bottom-12 left-40 w-28 h-28 border-2 border-[var(--cs-ink)] bg-[var(--cs-primary)] z-0" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-5">
              {user?.picture ? (
                <img src={user.picture} alt={user.name} className="w-24 h-24 border-2 border-[var(--cs-ink)] object-cover" data-testid="profile-avatar" />
              ) : (
                <div className="w-24 h-24 grid place-items-center border-2 border-[var(--cs-ink)] bg-[var(--cs-yellow)] font-display text-4xl tracking-tighter" data-testid="profile-avatar-fallback">{initials}</div>
              )}
              <div>
                <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-[var(--cs-primary)]">{user?.role || "student"}</div>
                <h1 className="font-display text-4xl sm:text-5xl tracking-tighter mt-1" data-testid="profile-heading">{user?.name}</h1>
                <div className="text-sm text-muted-ink mt-1">{user?.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setTab(tab === "edit" ? "overview" : "edit")} className="btn-brutal bg-[var(--cs-ink)] text-white px-4 py-2 text-sm font-semibold inline-flex items-center gap-2" data-testid="profile-edit-toggle">
                <PencilSimple size={14} /> {tab === "edit" ? "Cancel" : "Edit profile"}
              </button>
            </div>
          </div>

          {user?.bio && <p className="relative z-10 mt-5 max-w-2xl text-ink/80">{user.bio}</p>}

          {/* Skills/interest chips visible on overview */}
          {tab === "overview" && (
            <div className="relative z-10 mt-5 flex flex-wrap gap-1.5">
              {(user?.skills || []).map(s => (
                <span key={s} className="border-2 border-[var(--cs-ink)] bg-[var(--cs-yellow)] px-2.5 py-1 text-xs font-bold">{s}</span>
              ))}
              {(user?.interests || []).map(s => (
                <span key={s} className="border-2 border-[var(--cs-ink)] bg-white px-2.5 py-1 text-xs font-bold">{s}</span>
              ))}
              {!(user?.skills?.length || user?.interests?.length) && (
                <span className="text-sm text-muted-ink flex items-center gap-1 mt-1">No skills or interests yet. Hit <button onClick={() => setTab("edit")} className="underline font-bold">edit</button> to add them.</span>
              )}
            </div>
          )}
        </section>

        {tab === "overview" ? (
          <>
            {/* Stats */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-[var(--cs-ink)] bg-white">
              {[
                { label: "Projects owned", value: stats.active_projects, icon: Folder, accent: "var(--cs-primary)" },
                { label: "Projects joined", value: stats.messages, icon: ArrowRight, accent: "var(--cs-orange)" }, // Placeholder, not tracked yet
                { label: "Connections", value: stats.connections, icon: LinkSimple, accent: "var(--cs-pink)" },
                { label: "Posts", value: stats.posts, icon: FileText, accent: "var(--cs-ink)" },
              ].map((s, i) => (
                <div key={s.label}
                  className={`p-6 ${i < 3 ? "md:border-r-2 border-[var(--cs-ink)]" : ""} ${i < 2 ? "border-b-2 lg:border-b-0 border-[var(--cs-ink)]" : ""} ${i === 0 || i === 2 ? "border-r-2 border-[var(--cs-ink)]" : ""}`}
                  data-testid={`profile-stat-${s.label.toLowerCase().replace(/ /g, "-")}`}>
                  <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-muted-ink">{s.label}</div>
                  <div className="mt-3 flex items-end gap-3">
                    <div className="font-display text-5xl tracking-tighter leading-none">{s.value}</div>
                    <div className="mb-1 w-10 h-10 grid place-items-center border border-[var(--cs-ink)]" style={{ background: s.accent, color: s.accent === "var(--cs-ink)" ? "white" : "black" }}>
                      <s.icon size={18} weight="duotone" />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Projects I own */}
            <section>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-[var(--cs-primary)]">§ my projects</div>
                  <h2 className="font-display text-3xl sm:text-4xl tracking-tighter mt-1">Projects I created.</h2>
                </div>
                <button onClick={() => navigate("/create-project")} className="btn-brutal bg-[var(--cs-primary)] text-white px-4 py-2 text-sm font-semibold inline-flex items-center gap-2" data-testid="profile-new-project-btn">
                  <Plus weight="bold" size={14} /> New project
                </button>
              </div>

              {loadingData ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({length:3}).map((_,i) => <div key={i} className="h-48 border-2 border-[var(--cs-ink)] bg-white animate-pulse" />)}
                </div>
              ) : myProjects.owned.length === 0 ? (
                <div className="border-2 border-[var(--cs-ink)] bg-white p-10 text-center">
                  <div className="font-display text-2xl">No projects yet.</div>
                  <p className="text-muted-ink mt-1">Post your idea and let the AI fetch your team.</p>
                  <button onClick={() => navigate("/create-project")} className="mt-4 btn-brutal bg-[var(--cs-ink)] text-white px-4 py-2 text-sm font-semibold" data-testid="profile-empty-create-btn">
                    Create first project
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myProjects.owned.map((p, i) => (
                    <motion.div key={p._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className="border-2 border-[var(--cs-ink)] bg-white p-5 shadow-brutal flex flex-col"
                      data-testid={`profile-owned-${p._id}`}>
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 grid place-items-center border border-[var(--cs-ink)] bg-[var(--cs-yellow)] text-xl">{"🚀"}</div>
                        <span className="font-mono-cs text-[10px] tracking-widest uppercase bg-[var(--cs-primary)] text-white px-2 py-0.5">{p.status || "active"}</span>
                      </div>
                      <div className="mt-3 font-display text-lg tracking-tight leading-tight">{p.title}</div>
                      <p className="mt-2 text-sm text-muted-ink line-clamp-2">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {(p.tags || []).slice(0, 3).map(t => <span key={t} className="border border-[var(--cs-ink)] px-2 py-0.5 text-[10px] font-semibold">{t}</span>)}
                      </div>
                      <div className="mt-auto pt-4 flex items-center justify-between text-xs">
                        <div className="text-muted-ink">{p.isRemote ? "Remote" : (p.location || "Location not set")}</div>
                        <div className="flex gap-2">
                          <button onClick={() => navigate('/create-project', { state: { projectToEdit: p } })} className="text-[var(--cs-ink)] hover:underline inline-flex items-center gap-1" data-testid={`profile-edit-${p._id}`}>
                            <PencilSimple size={12} /> Edit
                          </button>
                          <button onClick={() => deleteProject(p._id)} className="text-[var(--cs-pink)] hover:underline inline-flex items-center gap-1" data-testid={`profile-delete-${p._id}`}>
                            <Trash size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            {/* Projects joined */}
            {myProjects.joined.length > 0 && (
              <section>
                <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-[var(--cs-orange)]">§ joined</div>
                <h2 className="font-display text-3xl tracking-tighter mt-1">Projects I joined.</h2>
                <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myProjects.joined.map(p => (
                    <div key={p._id} className="border-2 border-[var(--cs-ink)] bg-white p-5 shadow-brutal" data-testid={`profile-joined-${p._id}`}>
                      <div className="text-2xl">{"🚀"}</div>
                      <div className="mt-2 font-display text-lg tracking-tight">{p.title}</div>
                      <p className="mt-2 text-sm text-muted-ink line-clamp-2">{p.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Connections */}
            <section>
              <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-[var(--cs-pink)]">§ network</div>
              <h2 className="font-display text-3xl tracking-tighter mt-1">My connections.</h2>
              {loadingData ? (
                <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({length:3}).map((_,i) => <div key={i} className="h-28 border-2 border-[var(--cs-ink)] bg-white animate-pulse" />)}
                </div>
              ) : connections.length === 0 ? (
                <div className="mt-4 border-2 border-[var(--cs-ink)] bg-white p-8 text-center">
                  <div className="font-display text-xl">No connections yet.</div>
                  <p className="text-muted-ink text-sm mt-1">Visit <Link to="/smart-matches" className="underline font-bold">Find Teammates</Link> to connect.</p>
                </div>
              ) : (
                <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {connections.map(c => {
                    const myId = user?._id;
                    const other = c.requester && c.requester._id === myId ? c.receiver : c.requester;
                    if (!other) return null;
                    return (
                      <div key={c._id} className="border-2 border-[var(--cs-ink)] bg-white p-4 shadow-brutal flex items-center gap-3" data-testid={`profile-connection-${c._id}`}>
                        <div className="w-12 h-12 flex items-center justify-center bg-[var(--cs-primary)] text-white font-bold border border-[var(--cs-ink)] text-sm">
                          {other.name ? other.name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase() : "U"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold truncate">{other.name}</div>
                          <div className="text-xs text-muted-ink truncate">{other.email}</div>
                          <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-mono-cs tracking-widest uppercase">
                            <Handshake size={10} /> Connected
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Recent posts */}
            {posts.length > 0 && (
              <section>
                <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-[var(--cs-ink)]">§ my posts</div>
                <h2 className="font-display text-3xl tracking-tighter mt-1">Latest from me.</h2>
                <div className="mt-4 space-y-3">
                  {posts.slice(0, 4).map(p => (
                    <div key={p.post_id} className="border-2 border-[var(--cs-ink)] bg-white p-4" data-testid={`profile-post-${p.post_id}`}>
                      <div className="text-xs text-muted-ink">{new Date(p.created_at).toLocaleString()}</div>
                      <p className="mt-1 whitespace-pre-wrap">{p.content}</p>
                      <div className="mt-2 text-xs inline-flex items-center gap-1 text-[var(--cs-pink)]"><ChatCircle size={12} /> {p.likes} likes</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          // ===== EDIT MODE =====
          <form onSubmit={save} className="space-y-8">
            <section className="border-2 border-[var(--cs-ink)] bg-white p-6 md:p-8 shadow-brutal space-y-4">
              <div className="flex items-center gap-2">
                <Sparkle weight="fill" className="text-[var(--cs-primary)]" />
                <div className="font-display text-2xl tracking-tight">Identity</div>
              </div>
              <label className="block">
                <div className="font-mono-cs text-[10px] tracking-[0.2em] uppercase">Name</div>
                <input value={form.name} disabled title="Name can only be changed by contacting support currently" className="mt-2 w-full px-4 py-3 border-2 border-[var(--cs-ink)] bg-[var(--cs-bg)] text-muted-ink focus:outline-none cursor-not-allowed" data-testid="profile-name-input" />
              </label>
              <label className="block">
                <div className="font-mono-cs text-[10px] tracking-[0.2em] uppercase">Bio</div>
                <textarea rows={3} value={form.bio} disabled title="Bio updates are not fully supported on backend yet" placeholder="What do you build? What makes you weird?" className="mt-2 w-full px-4 py-3 border-2 border-[var(--cs-ink)] bg-[var(--cs-bg)] text-muted-ink focus:outline-none cursor-not-allowed" data-testid="profile-bio-input" />
              </label>
              <label className="block">
                <div className="font-mono-cs text-[10px] tracking-[0.2em] uppercase">Role</div>
                <select value={form.role} disabled className="mt-2 px-4 py-3 border-2 border-[var(--cs-ink)] bg-[var(--cs-bg)] text-muted-ink cursor-not-allowed" data-testid="profile-role-select">
                  <option value="student">Student / Builder</option>
                  <option value="mentor">Mentor</option>
                </select>
              </label>
            </section>

            <TagSection title="Skills" field="skills" suggestions={skillSuggestions}
              values={form.skills} input={skillInput} setInput={setSkillInput} addTag={addTag} removeTag={removeTag} />
            <TagSection title="Interests" field="interests" suggestions={interestSuggestions}
              values={form.interests} input={interestInput} setInput={setInterestInput} addTag={addTag} removeTag={removeTag} accent="white" />

            <div className="flex items-center gap-3">
              <button type="submit" disabled={saving} className="btn-brutal bg-[var(--cs-primary)] text-white px-6 py-3 font-semibold inline-flex items-center gap-2" data-testid="profile-save-btn">
                <Check weight="bold" size={16} /> {saving ? "Saving…" : "Save changes"}
              </button>
              <button type="button" onClick={() => setTab("overview")} className="btn-brutal bg-white px-6 py-3 font-semibold" data-testid="profile-cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

function TagSection({ title, field, suggestions, values, input, setInput, addTag, removeTag, accent = "var(--cs-yellow)" }) {
  return (
    <section className="border-2 border-[var(--cs-ink)] bg-white p-6 md:p-8 shadow-brutal">
      <div className="font-display text-2xl tracking-tight">{title}</div>
      <p className="text-sm text-muted-ink mt-1">Type & press enter, or click a suggestion.</p>
      <div className="mt-4 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(field, input, setInput); } }}
          placeholder={`Add ${title.toLowerCase().slice(0, -1)}…`}
          className="flex-1 px-4 py-3 border-2 border-[var(--cs-ink)] focus:outline-none"
          data-testid={`profile-${field}-input`} />
        <button type="button" onClick={() => addTag(field, input, setInput)} className="btn-brutal bg-[var(--cs-ink)] text-white px-4 font-semibold">
          <Plus weight="bold" size={16} />
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {values.map(v => (
          <span key={v} className="inline-flex items-center gap-1.5 border-2 border-[var(--cs-ink)] px-3 py-1 text-sm font-semibold" style={{ background: accent }} data-testid={`profile-${field}-tag`}>
            {v}
            <button type="button" onClick={() => removeTag(field, v)} aria-label={`remove ${v}`}><X size={12} weight="bold" /></button>
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {suggestions.filter(s => !values.includes(s)).map(s => (
          <button key={s} type="button" onClick={() => addTag(field, s, () => {})} className="text-xs px-2 py-1 border border-[var(--cs-ink)] hover:bg-[var(--cs-yellow)] transition">
            + {s}
          </button>
        ))}
      </div>
    </section>
  );
}
