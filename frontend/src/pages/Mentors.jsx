import React, { useEffect, useState } from "react";
import { axiosPrivate } from "../api/axios";
import Header from "../components/Header";
import { toast } from "sonner";
import { Star, ChatCircle } from "@phosphor-icons/react";

export default function Mentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await axiosPrivate.get('/all-user');
        if (response.data?.success) {
          const allUsers = response.data.data || [];
          const mentorsOnly = allUsers.filter(u => String(u.role).toUpperCase() === 'MENTOR');
          setMentors(mentorsOnly);
        }
      } catch (error) {
        console.error("Failed to load mentors:", error);
        toast.error("Failed to load mentors");
      } finally { 
        setLoading(false); 
      }
    })();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="px-6 md:px-10 lg:px-16 py-10 space-y-8">
        <section>
          <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-[var(--cs-primary)]">§ mentorship</div>
          <h1 className="font-display text-5xl sm:text-6xl tracking-tighter mt-2" data-testid="mentorship-heading">Stand on shoulders.</h1>
          <p className="mt-3 text-muted-ink max-w-lg">Curated mentors — ex-Google, ex-Stripe, published researchers. Most offer a free first call.</p>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? Array.from({length:3}).map((_,i) => <div key={i} className="h-64 border-2 border-[var(--cs-ink)] bg-white animate-pulse" />) :
            mentors.map((m) => (
              <div key={m._id} className="border-2 border-[var(--cs-ink)] bg-white p-6 shadow-brutal relative overflow-hidden" data-testid={`mentor-${m._id}`}>
                <div className="absolute -top-8 -right-8 w-28 h-28 bg-[var(--cs-pink)] border-2 border-[var(--cs-ink)] rotate-12" />
                <div className="relative flex items-start gap-4">
                  <img src={m.picture || `https://i.pravatar.cc/100?u=${m._id}`} alt={m.name} className="w-16 h-16 border-2 border-[var(--cs-ink)] bg-gray-100" />
                  <div>
                    <div className="font-display text-xl tracking-tight">{m.name}</div>
                    <div className="text-xs text-muted-ink">{m.rate || "Free for students"}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-ink mt-4 line-clamp-2">{m.bio || "Happy to help you with your capstone journey!"}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(m.expertise || m.skills || []).slice(0, 4).map(e => (
                    <span key={e} className="border border-[var(--cs-ink)] px-2 py-0.5 text-[11px] font-semibold bg-[var(--cs-yellow)]">{e}</span>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-[var(--cs-orange)]">
                    {Array.from({length:5}).map((_,i) => <Star key={i} weight="fill" size={14} />)}
                  </div>
                  <span className="text-xs text-muted-ink">4.9 · 127 sessions</span>
                </div>
                <button onClick={() => toast.success(`Request sent to ${m.name}`)} className="mt-5 w-full btn-brutal bg-[var(--cs-ink)] text-white px-4 py-2.5 text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer" data-testid={`mentor-book-${m._id}`}>
                  <ChatCircle size={16} weight="fill" /> Request session
                </button>
              </div>
            ))
          }
          {!loading && mentors.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3 border-2 border-[var(--cs-ink)] bg-white p-10 text-center">
              <div className="font-display text-2xl">No mentors available right now.</div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}


