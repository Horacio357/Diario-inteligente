"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const SECTIONS = [
  { label: "Política", href: "/politica" },
  { label: "Deportes", href: "/deportes" },
  { label: "Tecnología", href: "/tecnologia" },
  { label: "Ciencia", href: "/ciencia" },
  { label: "Locales", href: "/locales" },
];

export default function TalosNavbar({ activeSection }: { activeSection?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"cyberpunk" | "light" | "tradicional">("cyberpunk");

  useEffect(() => {
    const saved = localStorage.getItem("talos_theme") as any;
    if (saved && ["cyberpunk", "light", "tradicional"].includes(saved)) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const changeTheme = (newTheme: "cyberpunk" | "light" | "tradicional") => {
    setTheme(newTheme);
    localStorage.setItem("talos_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <nav style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "var(--navbar-bg)",
        backdropFilter: "blur(28px)",
        borderBottom: "1px solid var(--glass-border)",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.2)" : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "0 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "68px",
        }}>

          {/* ─── LOGO ─── */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.85rem" }}>
            {/* Icono de ojo estilizado */}
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "rgba(0,212,255,0.1)",
              border: "1px solid var(--accent-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(0,212,255,0.2)",
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4z" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="11.5" r="3" fill="var(--accent-primary)" opacity="0.9"/>
              </svg>
            </div>

            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
                <span style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "1.35rem",
                  fontWeight: 900,
                  color: "var(--heading-color)",
                  letterSpacing: "-0.02em",
                }}>
                  TALOS
                </span>
                <span style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "var(--accent-primary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.25em",
                  paddingBottom: "2px",
                  borderBottom: "1px solid var(--accent-primary)",
                }}>
                  DIARIO
                </span>
              </div>
              <span style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.58rem",
                fontWeight: 500,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
              }}>
                Periodismo Aumentado
              </span>
            </div>
          </Link>

          {/* ─── MENU DESKTOP ─── */}
          <div style={{
            display: "none",
            alignItems: "center",
            gap: "0.25rem",
          }} className="desktop-nav">
            {SECTIONS.map(s => {
              const isActive = activeSection === s.href.replace("/", "");
              return (
              <Link key={s.href} href={s.href} style={{
                textDecoration: "none",
                fontFamily: "Outfit, sans-serif",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: isActive ? "var(--accent-primary)" : "var(--text-primary)",
                padding: "0.4rem 0.85rem",
                borderRadius: "8px",
                border: isActive ? "1px solid var(--accent-primary)" : "1px solid transparent",
                background: isActive ? "var(--glass-hover)" : "transparent",
                transition: "all 0.2s ease",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-primary)";
                  (e.currentTarget as HTMLAnchorElement).style.background = "var(--glass-hover)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--glass-border)";
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)";
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "transparent";
                }
              }}>
                {s.label}
              </Link>
              );
            })}

            {/* ─── LINK DIRECTO AL ADMIN / REDACCIÓN ─── */}
            <Link href="/admin" style={{
              textDecoration: "none", fontFamily: "Outfit, sans-serif", fontSize: "0.8rem", fontWeight: 800,
              color: "#00d4ff", padding: "0.35rem 0.75rem", borderRadius: "8px",
              background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.25)",
              display: "flex", alignItems: "center", gap: "0.3rem", transition: "all 0.2s ease"
            }}>
              🔑 Admin
            </Link>

            {/* ─── SELECTOR DE TEMA DE EDICIÓN ─── */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.2rem",
              background: "var(--card-bg)",
              border: "1px solid var(--glass-border)",
              borderRadius: "100px",
              padding: "0.2rem",
              marginLeft: "0.25rem",
            }}>
              <button
                title="Modo Neón Cyberpunk"
                onClick={() => changeTheme("cyberpunk")}
                style={{
                  background: theme === "cyberpunk" ? "rgba(0,212,255,0.2)" : "transparent",
                  border: theme === "cyberpunk" ? "1px solid #00d4ff" : "1px solid transparent",
                  borderRadius: "100px", padding: "0.2rem 0.55rem", color: theme === "cyberpunk" ? "#00d4ff" : "var(--text-muted)",
                  fontSize: "0.7rem", fontFamily: "Outfit, sans-serif", fontWeight: 700, cursor: "pointer",
                }}
              >
                ⚡ Neón
              </button>
              <button
                title="Modo Claro"
                onClick={() => changeTheme("light")}
                style={{
                  background: theme === "light" ? "rgba(2,132,199,0.2)" : "transparent",
                  border: theme === "light" ? "1px solid #0284c7" : "1px solid transparent",
                  borderRadius: "100px", padding: "0.2rem 0.55rem", color: theme === "light" ? "#0284c7" : "var(--text-muted)",
                  fontSize: "0.7rem", fontFamily: "Outfit, sans-serif", fontWeight: 700, cursor: "pointer",
                }}
              >
                ☀️ Día
              </button>
              <button
                title="Modo Periódico Tradicional"
                onClick={() => changeTheme("tradicional")}
                style={{
                  background: theme === "tradicional" ? "rgba(153,27,27,0.2)" : "transparent",
                  border: theme === "tradicional" ? "1px solid #991b1b" : "1px solid transparent",
                  borderRadius: "100px", padding: "0.2rem 0.55rem", color: theme === "tradicional" ? "#991b1b" : "var(--text-muted)",
                  fontSize: "0.7rem", fontFamily: "Outfit, sans-serif", fontWeight: 700, cursor: "pointer",
                }}
              >
                📰 Papel
              </button>
            </div>
          </div>

          {/* ─── HAMBURGER BUTTON ─── */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Abrir menú"
            style={{
              background: "transparent",
              border: "1px solid var(--glass-border)",
              borderRadius: "10px",
              width: "42px",
              height: "42px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              cursor: "pointer",
              padding: "0",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent-primary)";
              (e.currentTarget as HTMLButtonElement).style.background = "var(--glass-hover)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--glass-border)";
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            {/* Líneas animadas del hambúrger */}
            <span style={{
              display: "block",
              width: "18px",
              height: "2px",
              background: menuOpen ? "var(--accent-primary)" : "var(--heading-color)",
              borderRadius: "2px",
              transition: "all 0.3s ease",
              transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
            }} />
            <span style={{
              display: "block",
              width: "18px",
              height: "2px",
              background: menuOpen ? "transparent" : "var(--heading-color)",
              borderRadius: "2px",
              transition: "all 0.3s ease",
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: "block",
              width: "18px",
              height: "2px",
              background: menuOpen ? "var(--accent-primary)" : "var(--heading-color)",
              borderRadius: "2px",
              transition: "all 0.3s ease",
              transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
            }} />
          </button>
        </div>
      </nav>

      {/* ─── DRAWER MOBILE MENU ─── */}
      <div style={{
        position: "fixed",
        top: "68px",
        left: 0,
        right: 0,
        zIndex: 999,
        background: "var(--navbar-bg)",
        backdropFilter: "blur(24px)",
        borderBottom: menuOpen ? "1px solid var(--glass-border)" : "none",
        padding: menuOpen ? "1.5rem 1.25rem" : "0 1.25rem",
        maxHeight: menuOpen ? "400px" : "0px",
        overflow: "hidden",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: menuOpen ? "0 20px 60px rgba(0,0,0,0.3)" : "none",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {SECTIONS.map((s, i) => (
            <Link
              key={s.href}
              href={s.href}
              onClick={() => setMenuOpen(false)}
              style={{
                textDecoration: "none",
                fontFamily: "Outfit, sans-serif",
                fontSize: "1.3rem",
                fontWeight: 800,
                color: "var(--heading-color)",
                padding: "1rem 1.25rem",
                borderRadius: "12px",
                border: "1px solid var(--glass-border)",
                background: "var(--card-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                letterSpacing: "-0.01em",
                transition: "all 0.2s ease",
                transitionDelay: menuOpen ? `${i * 40}ms` : "0ms",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(-8px)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-primary)";
                (e.currentTarget as HTMLAnchorElement).style.background = "var(--glass-hover)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--glass-border)";
                (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "1.5rem";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--heading-color)";
                (e.currentTarget as HTMLAnchorElement).style.background = "var(--card-bg)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--glass-border)";
                (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "1.25rem";
              }}
            >
              <span>{s.label}</span>
              <span style={{ fontSize: "0.9rem", color: "var(--accent-primary)" }}>→</span>
            </Link>
          ))}

          {/* Theme selector mobile */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button onClick={() => { changeTheme("cyberpunk"); setMenuOpen(false); }} style={{ flex: 1, padding: "0.5rem", borderRadius: "8px", background: theme === "cyberpunk" ? "rgba(0,212,255,0.2)" : "rgba(255,255,255,0.03)", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", fontWeight: 700, fontFamily: "Outfit, sans-serif", fontSize: "0.78rem" }}>
              ⚡ Neón
            </button>
            <button onClick={() => { changeTheme("light"); setMenuOpen(false); }} style={{ flex: 1, padding: "0.5rem", borderRadius: "8px", background: theme === "light" ? "rgba(2,132,199,0.2)" : "rgba(255,255,255,0.03)", border: "1px solid rgba(2,132,199,0.3)", color: "#0284c7", fontWeight: 700, fontFamily: "Outfit, sans-serif", fontSize: "0.78rem" }}>
              ☀️ Día
            </button>
            <button onClick={() => { changeTheme("tradicional"); setMenuOpen(false); }} style={{ flex: 1, padding: "0.5rem", borderRadius: "8px", background: theme === "tradicional" ? "rgba(153,27,27,0.2)" : "rgba(255,255,255,0.03)", border: "1px solid rgba(153,27,27,0.3)", color: "#ef4444", fontWeight: 700, fontFamily: "Outfit, sans-serif", fontSize: "0.78rem" }}>
              📰 Papel
            </button>
          </div>
        </div>
      </div>

      {/* Overlay que cierra el menú */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 998,
            background: "rgba(0,0,0,0.3)",
            top: "68px",
          }}
        />
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
        }
      `}</style>
    </>
  );
}
