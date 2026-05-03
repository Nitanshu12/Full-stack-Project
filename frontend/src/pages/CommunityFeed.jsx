import React, { useState, useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import api from '../api/axios';
import Header from '../components/Header';
import useAuth from '../hooks/useAuth';
import { toast } from "sonner";
import { Heart, PaperPlaneTilt, ChatCircle } from "@phosphor-icons/react";

export default function CommunityFeed() {
  const { auth } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);

  const [commentTexts, setCommentTexts] = useState({});
  const [showComments, setShowComments] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const response = await api.get('/post/all');
      if (response.data?.success) {
        setPosts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const response = await axiosPrivate.post('/post/create', { 
        content: content.trim(), 
        tags: tags.split(",").map(s=>s.trim()).filter(Boolean) 
      });
      if (response.data?.success) {
        setContent(""); 
        setTags("");
        toast.success("Posted");
        load();
      } else {
        toast.error("Could not post");
      }
    } catch (err) { 
      console.error(err);
      toast.error("Could not post"); 
    }
  };

  const like = async (id) => {
    try { 
      const response = await axiosPrivate.post(`/post/${id}/like`); 
      if (response.data?.success) {
        setPosts(posts.map(post => post._id === id ? response.data.data : post));
      }
    } catch (err) { 
      console.error(err);
    }
  };

  const handleComment = async (postId) => {
    const commentText = commentTexts[postId]?.trim();
    if (!commentText) return;

    try {
      const response = await axiosPrivate.post(`/post/${postId}/comment`, {
        text: commentText
      });

      if (response.data?.success) {
        setCommentTexts({ ...commentTexts, [postId]: '' });
        setPosts(posts.map(post => post._id === postId ? response.data.data : post));
        setShowComments({ ...showComments, [postId]: true });
        toast.success("Comment added");
      }
    } catch (err) {
      console.error('Error commenting:', err);
      toast.error('Failed to add comment.');
    }
  };

  const isLiked = (post) => {
    if (!auth?.user || !post.likes) return false;
    return post.likes.some(like => 
      (typeof like === 'object' ? like._id : like) === auth.user._id
    );
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="px-6 md:px-10 lg:px-16 py-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-[var(--cs-primary)]">§ feed</div>
            <h1 className="font-display text-5xl sm:text-6xl tracking-tighter mt-2" data-testid="feed-heading">The builder feed.</h1>
          </div>
          <form onSubmit={submit} className="border-2 border-[var(--cs-ink)] bg-white p-5 shadow-brutal">
            <div className="flex items-start gap-3">
              <img src={auth?.user?.picture || `https://i.pravatar.cc/80?u=${auth?.user?._id || 'default'}`} alt="" className="w-10 h-10 border border-[var(--cs-ink)] bg-gray-100" />
              <div className="flex-1">
                <textarea value={content} onChange={e => setContent(e.target.value)} rows={3} placeholder="Ship log, ask, hot take…" className="w-full border-2 border-[var(--cs-ink)] px-3 py-2 focus:outline-none" data-testid="feed-content-input" />
                <div className="flex items-center gap-2 mt-2">
                  <input value={tags} onChange={e => setTags(e.target.value)} placeholder="tags (comma)" className="flex-1 border-2 border-[var(--cs-ink)] px-3 py-2 text-sm" data-testid="feed-tags-input" />
                  <button type="submit" disabled={!content.trim()} className="btn-brutal bg-[var(--cs-ink)] text-white px-4 py-2 text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-50" data-testid="feed-post-btn">
                    <PaperPlaneTilt size={14} weight="fill" /> Post
                  </button>
                </div>
              </div>
            </div>
          </form>

          <section className="space-y-4">
            {loading ? Array.from({length:3}).map((_,i) => <div key={i} className="h-40 border-2 border-[var(--cs-ink)] bg-white animate-pulse" />) :
              posts.length === 0 ? (
                <div className="border-2 border-[var(--cs-ink)] bg-white p-10 text-center">
                  <div className="font-display text-2xl">Quiet here. Break the silence.</div>
                </div>
              ) :
              posts.map(p => (
                <article key={p._id} className="border-2 border-[var(--cs-ink)] bg-white p-5 shadow-brutal" data-testid={`feed-post-${p._id}`}>
                  <div className="flex items-center gap-3">
                    <img src={p.author?.picture || `https://i.pravatar.cc/80?u=${p.author?._id || p._id}`} alt="" className="w-10 h-10 border border-[var(--cs-ink)] bg-gray-100" />
                    <div className="text-sm">
                      <div className="font-bold">{p.author?.name || 'Anonymous'}</div>
                      <div className="text-xs text-muted-ink">{new Date(p.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap leading-relaxed">{p.content}</p>
                  {(p.tags || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.tags.map(t => <span key={t} className="text-xs text-[var(--cs-primary)] font-mono-cs">#{t}</span>)}
                    </div>
                  )}
                  
                  <div className="mt-4 flex items-center gap-4">
                    <button onClick={() => like(p._id)} className={`inline-flex items-center gap-1 text-sm transition-colors ${isLiked(p) ? 'text-[var(--cs-pink)]' : 'hover:text-[var(--cs-pink)]'}`} data-testid={`feed-like-${p._id}`}>
                      <Heart weight={isLiked(p) ? "fill" : "regular"} size={16} /> {p.likes?.length || 0}
                    </button>
                    <button onClick={() => setShowComments({...showComments, [p._id]: !showComments[p._id]})} className="inline-flex items-center gap-1 text-sm hover:text-[var(--cs-primary)]">
                      <ChatCircle weight={showComments[p._id] ? "fill" : "regular"} size={16} /> {p.comments?.length || 0}
                    </button>
                  </div>

                  {/* COMMENTS SECTION */}
                  {showComments[p._id] && (
                    <div className="mt-4 pt-4 border-t-2 border-[var(--cs-ink)] space-y-4">
                      {p.comments && p.comments.length > 0 && (
                        <div className="space-y-3">
                          {p.comments.map((c, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div className="w-6 h-6 border border-[var(--cs-ink)] bg-gray-100 flex items-center justify-center text-[10px] font-bold shrink-0">
                                {c.user?.name ? c.user.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div className="flex-1 text-sm">
                                <span className="font-bold mr-2">{c.user?.name || 'Anonymous'}</span>
                                <span className="text-muted-ink">{c.text}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={commentTexts[p._id] || ''}
                          onChange={(e) => setCommentTexts({...commentTexts, [p._id]: e.target.value})}
                          onKeyPress={(e) => e.key === 'Enter' && handleComment(p._id)}
                          placeholder="Write a comment..."
                          className="flex-1 border-2 border-[var(--cs-ink)] px-2 py-1 text-sm focus:outline-none"
                        />
                        <button
                          onClick={() => handleComment(p._id)}
                          disabled={!commentTexts[p._id]?.trim()}
                          className="btn-brutal bg-[var(--cs-primary)] text-white px-3 py-1 text-xs font-bold disabled:opacity-50"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}

                </article>
              ))
            }
          </section>
        </div>

        <aside className="space-y-4">
          <div className="border-2 border-[var(--cs-ink)] bg-[var(--cs-yellow)] p-5">
            <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase">community rule #1</div>
            <div className="font-display text-2xl tracking-tighter mt-2">Ship something. Anything.</div>
          </div>
          <div className="border-2 border-[var(--cs-ink)] bg-white p-5 shadow-brutal">
            <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-muted-ink">trending</div>
            <div className="mt-3 space-y-2 text-sm">
              {["#ai", "#launch", "#hackathon", "#demo-day", "#hiring"].map(t => <div key={t} className="font-semibold">{t}</div>)}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

