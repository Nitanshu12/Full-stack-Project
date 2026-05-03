import React, { useEffect, useState } from "react";
import { axiosPrivate } from '../api/axios';
import Header from '../components/Header';
import useAuth from '../hooks/useAuth';
import { toast } from "sonner";
import { Handshake } from "@phosphor-icons/react";

export default function SmartMatches() {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [connectingIds, setConnectingIds] = useState(new Set());
  const [connectedIds, setConnectedIds] = useState(new Set());

  useEffect(() => {
    fetchUsers();
    fetchConnections();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get('/all-user');
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to load matches.');
    } finally {
      setLoading(false);
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await axiosPrivate.get('/connections/my');
      if (res.data?.success) {
        const myId = auth?.user?._id;
        const ids = new Set();
        (res.data.data || []).forEach((conn) => {
          const requesterId = conn.requester?._id || conn.requester;
          const receiverId = conn.receiver?._id || conn.receiver;
          const otherId = requesterId === myId ? receiverId : requesterId;
          if (otherId) ids.add(String(otherId));
        });
        setConnectedIds(ids);
      }
    } catch (err) {
      console.error('Error fetching connections:', err);
    }
  };

  const filtered = users.filter(u => {
    if (!filter) return true;
    const hay = [u.name, u.email, ...(u.skills || []), ...(u.interests || [])].join(" ").toLowerCase();
    return hay.includes(filter.toLowerCase());
  });

  const handleConnect = async (targetUserId) => {
    if (!targetUserId) return;

    setConnectingIds((prev) => new Set(prev).add(targetUserId));
    try {
      const res = await axiosPrivate.post('/connections/connect', { targetUserId });
      if (res.data?.success) {
        setConnectedIds((prev) => new Set(prev).add(targetUserId));
        toast.success("Request sent!");
      } else {
        toast.error(res.data?.message || 'Failed to connect. Please try again.');
      }
    } catch (err) {
      console.error('Error creating connection:', err);
      toast.error(err.response?.data?.message || 'Failed to connect.');
    } finally {
      setConnectingIds((prev) => {
        const copy = new Set(prev);
        copy.delete(targetUserId);
        return copy;
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="px-6 md:px-10 lg:px-16 py-10 space-y-8">
        <section>
          <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-[var(--cs-primary)]">§ teammates</div>
          <h1 className="font-display text-5xl sm:text-6xl tracking-tighter mt-2" data-testid="teammates-heading">Find your co-builders.</h1>
          <p className="mt-3 text-muted-ink max-w-lg">Search by skill, interest or timezone. The best ones don't stay available long.</p>
        </section>

        <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter by skill, interest, name…"
          className="w-full max-w-md px-4 py-3 bg-white border-2 border-[var(--cs-ink)] focus:outline-none"
          data-testid="teammates-filter" />

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? Array.from({length:6}).map((_,i) => <div key={i} className="h-48 border-2 border-[var(--cs-ink)] bg-white animate-pulse" />) :
            filtered.map((u) => (
              <div key={u._id} className="border-2 border-[var(--cs-ink)] bg-white p-6 shadow-brutal sheen flex flex-col" data-testid={`teammate-${u._id}`}>
                <div className="flex items-start gap-4">
                  <img src={u.picture || `https://i.pravatar.cc/100?u=${u._id}`} alt="" className="w-14 h-14 border border-[var(--cs-ink)] bg-gray-100" />
                  <div className="min-w-0">
                    <div className="font-display text-xl tracking-tight truncate">{u.name || "Anonymous"}</div>
                    <div className="text-xs text-muted-ink truncate">{u.role || "student"} · {u.email}</div>
                  </div>
                </div>
                {u.bio && <p className="text-sm text-muted-ink mt-3 line-clamp-2">{u.bio}</p>}
                
                {u.matchScore !== undefined && (
                  <div className="mt-3 text-xs font-bold text-[var(--cs-primary)]">
                    AI Match: {u.matchScore}%
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(u.skills || []).slice(0, 5).map(s => (
                    <span key={s} className="border border-[var(--cs-ink)] bg-[var(--cs-yellow)] px-2 py-0.5 text-[11px] font-semibold">{s}</span>
                  ))}
                </div>
                
                <div className="mt-auto pt-4 flex justify-end">
                  <button 
                    disabled={connectedIds.has(u._id) || connectingIds.has(u._id)}
                    onClick={() => handleConnect(u._id)} 
                    className={`btn-brutal bg-[var(--cs-ink)] text-white px-3 py-1.5 text-xs font-semibold inline-flex items-center gap-1.5 ${connectedIds.has(u._id) ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    data-testid={`teammate-connect-${u._id}`}
                  >
                    <Handshake size={14} /> 
                    {connectedIds.has(u._id) ? 'Connected' : connectingIds.has(u._id) ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              </div>
            ))
          }
          {!loading && filtered.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3 border-2 border-[var(--cs-ink)] bg-white p-10 text-center">
              <div className="font-display text-2xl">No teammates match your filter.</div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
