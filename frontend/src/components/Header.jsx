import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Sphere, SignOut, User } from "@phosphor-icons/react";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/projects", label: "Projects" },
  { to: "/smart-matches", label: "Teammates" },
  { to: "/mentors", label: "Mentorship" },
  { to: "/feed", label: "Feed" },
];

export default function Header() {
  const { auth, logout } = useAuth();
  const user = auth?.user;
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initials = (user?.name || "U").split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[var(--cs-ink)] bg-[var(--cs-bg)]/85 backdrop-blur-md">
      <div className="px-6 md:px-10 lg:px-16 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2" data-testid="nav-logo">
          <div className="w-9 h-9 grid place-items-center bg-[var(--cs-ink)] text-white border border-[var(--cs-ink)]">
            <Sphere weight="duotone" size={22} />
          </div>
          <div className="leading-none">
            <div className="font-display text-xl tracking-tighter">CollabSphere</div>
            <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-muted-ink">build · together · faster</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium tracking-tight ${isActive ? "bg-[var(--cs-ink)] text-white" : "hover:bg-black/5"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2 py-1.5 border-2 border-[var(--cs-ink)] bg-white hover:shadow-brutal transition-all" 
            data-testid="nav-profile-btn"
          >
            <div className="h-7 w-7 flex items-center justify-center bg-[var(--cs-yellow)] text-[var(--cs-ink)] font-bold text-xs border border-[var(--cs-ink)] overflow-hidden">
              {user?.picture ? <img src={user.picture} alt={user?.name} className="w-full h-full object-cover" /> : initials}
            </div>
            <span className="hidden sm:inline text-sm font-semibold">{(user?.name || "").split(" ")[0] || "You"}</span>
          </button>
          
          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border-2 border-[var(--cs-ink)] shadow-brutal flex flex-col z-50">
              <div className="px-3 py-2">
                <div className="font-mono-cs text-[10px] tracking-widest uppercase text-muted-ink">Signed in as</div>
                <div className="font-semibold text-sm truncate">{user?.email}</div>
              </div>
              <div className="h-px bg-[var(--cs-ink)] w-full" />
              <button 
                onClick={() => { setDropdownOpen(false); navigate("/profile"); }} 
                className="flex items-center px-3 py-2 text-sm font-medium hover:bg-black/5 text-left"
                data-testid="nav-menu-profile"
              >
                <User size={16} className="mr-2" /> Edit profile
              </button>
              <button
                onClick={async () => { 
                  setDropdownOpen(false); 
                  await logout(); 
                  navigate("/"); 
                }}
                className="flex items-center px-3 py-2 text-sm font-medium hover:bg-black/5 text-left text-red-600"
                data-testid="nav-menu-logout"
              >
                <SignOut size={16} className="mr-2" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden border-t border-[var(--cs-ink)] px-4 py-2 flex gap-1 overflow-x-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => `px-3 py-1.5 text-xs whitespace-nowrap ${isActive ? "bg-[var(--cs-ink)] text-white" : ""}`}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
