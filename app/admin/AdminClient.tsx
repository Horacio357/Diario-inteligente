"use client";

import { useState, useEffect, useRef } from "react";
import {
  FileText, Megaphone, Plus, Pencil, Trash2, Eye, EyeOff, Save, X, Lock, LogOut, CheckCircle, AlertTriangle,
  Globe, Sparkles, Wand2, Upload, BarChart3, Layout, Users, Radio, MessageSquare, Flame, TrendingUp, Search
} from "lucide-react";

// ─── Interfaces ─────────────────────────────────────────────────────────────────
interface Article {
  id: string; title: string; slug: string; summary: string; content: string;
  category: string; author: string; imageUrl?: string; videoUrl?: string;
  published: boolean; publishedAt: string;
}

interface Ad {
  id: string; section: string; title?: string; imageUrl?: string;
  linkUrl?: string; code?: string; active: boolean; priority: number;
}

interface NewspaperSpace {
  id: string; spaceKey: string; name: string; description?: string;
  active: boolean; contentJson?: string;
}

interface UserRole {
  id: string; name: string; email: string; passToken: string;
  role: "ADMIN" | "EDITOR" | "REDACTOR"; bio?: string;
}

interface AnalyticsData {
  summary: { totalEvents: number; articleViewsCount: number; aiQueriesCount: number; categoryVisitsCount: number };
  topAiQueries: Array<{ query: string; count: number }>;
  topArticles: Array<{ targetId: string; count: number }>;
  popularCategories: Array<{ category: string; count: number }>;
  recentEvents: Array<{ id: string; eventType: string; query?: string; category?: string; targetId?: string; createdAt: string }>;
}

const SECTIONS = ["global", "politica", "deportes", "tecnologia", "ciencia", "locales"];
const CATEGORIES = ["General", "Política", "Deportes", "Tecnología", "Ciencia", "Locales", "Economía", "Internacional"];
const ACCENT = "#00d4ff";

// ─── UI Helpers ────────────────────────────────────────────────────────────────
function Input({ label, value, onChange, type = "text", placeholder = "", rows = 0 }: any) {
  const base = {
    width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px", padding: "0.6rem 0.8rem", color: "#fff",
    fontFamily: "Inter, sans-serif", fontSize: "0.85rem", outline: "none",
    boxSizing: "border-box" as const, resize: "vertical" as const, transition: "border-color 0.2s",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      {label && <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.45)", fontFamily: "Outfit, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</label>}
      {rows > 0
        ? <textarea value={value} onChange={(e: any) => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={base} />
        : <input type={type} value={value} onChange={(e: any) => onChange(e.target.value)} placeholder={placeholder} style={base} />
      }
    </div>
  );
}

function Select({ label, value, onChange, options }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      {label && <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.45)", fontFamily: "Outfit, sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</label>}
      <select value={value} onChange={(e: any) => onChange(e.target.value)} style={{
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "8px", padding: "0.6rem 0.8rem", color: "#fff",
        fontFamily: "Inter, sans-serif", fontSize: "0.85rem", outline: "none", width: "100%",
      }}>
        {options.map((o: any) => (
          <option key={typeof o === "string" ? o : o.value} value={typeof o === "string" ? o : o.value} style={{ background: "#0a0e1a" }}>
            {typeof o === "string" ? o : o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", disabled, size = "md", danger, type = "button" }: any) {
  const bg = danger ? "rgba(255,23,68,0.15)" : variant === "primary" ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.07)";
  const border = danger ? "rgba(255,23,68,0.4)" : variant === "primary" ? "rgba(0,212,255,0.4)" : "rgba(255,255,255,0.12)";
  const color = danger ? "#ff1744" : variant === "primary" ? "#00d4ff" : "rgba(255,255,255,0.7)";
  const pad = size === "sm" ? "0.35rem 0.7rem" : "0.55rem 1.1rem";
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      background: bg, border: `1px solid ${border}`, borderRadius: "8px",
      color, fontFamily: "Outfit, sans-serif", fontSize: size === "sm" ? "0.72rem" : "0.82rem",
      fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", padding: pad,
      display: "flex", alignItems: "center", gap: "0.4rem", transition: "all 0.2s", opacity: disabled ? 0.5 : 1,
    }}>
      {children}
    </button>
  );
}

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div style={{
      position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 9999,
      background: ok ? "rgba(0,230,118,0.15)" : "rgba(255,23,68,0.15)",
      border: `1px solid ${ok ? "#00e676" : "#ff1744"}60`,
      borderRadius: "10px", padding: "0.75rem 1.1rem",
      display: "flex", alignItems: "center", gap: "0.5rem",
      fontFamily: "Inter, sans-serif", fontSize: "0.82rem",
      color: ok ? "#00e676" : "#ff1744",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)", animation: "slideIn 0.3s ease",
    }}>
      {ok ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
      {msg}
    </div>
  );
}

// ─── Modales Forms ────────────────────────────────────────────────────────────
function ArticleForm({ token, userRole, initial, onSave, onClose }: any) {
  const [form, setForm] = useState({
    title: initial?.title ?? "", summary: initial?.summary ?? "",
    content: initial?.content ?? "", category: initial?.category ?? "General",
    imageUrl: initial?.imageUrl ?? "", videoUrl: initial?.videoUrl ?? "",
    author: initial?.author ?? "Redacción Talos", published: initial?.published ?? (userRole !== "REDACTOR"),
    isSponsored: initial?.isSponsored ?? false, sponsorName: initial?.sponsorName ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const f = (key: string) => (val: any) => setForm(p => ({ ...p, [key]: val }));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-token": token },
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.url) f("imageUrl")(data.url);
      else alert(data.error || "Error al subir imagen");
    } catch { alert("Error al subir archivo"); }
  };

  const handleAiAction = async (action: string) => {
    if (!form.content && !form.title) {
      alert("Por favor ingresá un título o contenido antes de usar la IA.");
      return;
    }
    setAiLoading(action);
    try {
      const res = await fetch("/api/admin/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ action, text: form.content, title: form.title, category: form.category }),
      });
      const data = await res.json();
      if (res.ok && data.result) {
        if (action === "summary") f("summary")(data.result);
        if (action === "improve") f("content")(data.result);
      }
    } catch { alert("Error con la Asistencia IA"); }
    finally { setAiLoading(null); }
  };

  const handleSave = async () => {
    if (!form.title || !form.content) {
      alert("El título y contenido son requeridos.");
      return;
    }
    setSaving(true);
    const endpoint = "/api/admin";
    const method = initial?.id ? "PATCH" : "POST";
    const payload = initial?.id ? { type: "article", id: initial.id, ...form } : { type: "article", ...form };

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) onSave();
    else alert("Error al guardar la nota");
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", backdropFilter: "blur(6px)" }}>
      <div style={{ background: "#0a0e1a", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "16px", padding: "1.5rem", width: "100%", maxWidth: "750px", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.2rem", color: "#fff", fontWeight: 800 }}>
            {initial?.id ? "Editar Nota" : "Nueva Nota Editorial"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}><X size={18} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input label="Título de la Noticia" value={form.title} onChange={f("title")} placeholder="Ej: Tensión presupuestaria en el Congreso..." />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Select label="Categoría / Sección" value={form.category} onChange={f("category")} options={CATEGORIES} />
            <Input label="Autor / Firma" value={form.author} onChange={f("author")} placeholder="Redacción Talos" />
          </div>

          <div style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.12)", borderRadius: "10px", padding: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#00d4ff", textTransform: "uppercase" }}>Copilot IA Editorial</span>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <Btn size="sm" onClick={() => handleAiAction("summary")} disabled={!!aiLoading}><Sparkles size={11} /> {aiLoading === "summary" ? "Generando..." : "Generar Bajada"}</Btn>
                <Btn size="sm" onClick={() => handleAiAction("improve")} disabled={!!aiLoading}><Wand2 size={11} /> {aiLoading === "improve" ? "Optimizando..." : "Mejorar Texto"}</Btn>
              </div>
            </div>
            <Input label="Copete / Bajada (Resumen)" value={form.summary} onChange={f("summary")} rows={2} placeholder="Breve síntesis periodística..." />
          </div>

          <Input label="Cuerpo de la Nota (Markdown / Texto)" value={form.content} onChange={f("content")} rows={8} placeholder="Redactá la noticia aquí..." />

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <Input label="URL Imagen Principal" value={form.imageUrl} onChange={f("imageUrl")} placeholder="https://..." />
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />
            <div style={{ paddingTop: "1.2rem" }}>
              <Btn type="button" onClick={() => fileInputRef.current?.click()} variant="secondary" size="sm"><Upload size={12} /> Subir</Btn>
            </div>
          </div>

          {userRole !== "REDACTOR" && (
            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "rgba(255,255,255,0.7)" }}>
              <input type="checkbox" checked={form.published} onChange={e => f("published")(e.target.checked)} style={{ accentColor: ACCENT }} />
              Publicar inmediatamente en el diario
            </label>
          )}

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", paddingTop: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <Btn onClick={onClose} variant="secondary">Cancelar</Btn>
            <Btn onClick={handleSave} disabled={saving}><Save size={13} /> {saving ? "Guardando..." : "Guardar Nota"}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserForm({ token, initial, onSave, onClose }: any) {
  const [form, setForm] = useState({
    name: initial?.name ?? "", email: initial?.email ?? "",
    passToken: initial?.passToken ?? "", role: initial?.role ?? "REDACTOR",
    bio: initial?.bio ?? "",
  });
  const [saving, setSaving] = useState(false);
  const f = (k: string) => (v: any) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.name || !form.email || !form.passToken) {
      alert("Nombre, Email y Clave/Token son requeridos.");
      return;
    }
    setSaving(true);
    const method = initial?.id ? "PATCH" : "POST";
    const body = initial?.id ? { id: initial.id, ...form } : form;

    const res = await fetch("/api/admin/users", {
      method,
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) onSave();
    else alert("Error al guardar usuario");
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", backdropFilter: "blur(6px)" }}>
      <div style={{ background: "#0a0e1a", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "16px", padding: "1.5rem", width: "100%", maxWidth: "500px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.1rem", color: "#fff", fontWeight: 800 }}>
            {initial?.id ? "Editar Perfil de Redacción" : "Nuevo Integrante / Redactor"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}><X size={18} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <Input label="Nombre del Integrante" value={form.name} onChange={f("name")} placeholder="Ej: Dr. Carlos Pellegrini" />
          <Input label="Email Institucional" type="email" value={form.email} onChange={f("email")} placeholder="redactor@talos.com" />
          <Input label="Clave / Token de Acceso" value={form.passToken} onChange={f("passToken")} placeholder="Token único de login" />
          <Select label="Rol de Permisos" value={form.role} onChange={f("role")} options={[
            { label: "📝 REDACTOR (Solo crea y edita sus propias notas)", value: "REDACTOR" },
            { label: "✍️ EDITOR (Publica notas y administra espacios)", value: "EDITOR" },
            { label: "👑 ADMINISTRADOR (Acceso total)", value: "ADMIN" }
          ]} />
          <Input label="Bio / Presentación (Opcional)" value={form.bio} onChange={f("bio")} placeholder="Columnista de opinión..." rows={2} />

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", paddingTop: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <Btn onClick={onClose} variant="secondary">Cancelar</Btn>
            <Btn onClick={handleSave} disabled={saving}><Save size={13} /> {saving ? "Guardando..." : "Guardar Usuario"}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ADMIN CLIENT ────────────────────────────────────────────────────────
export default function AdminClient() {
  const [token, setToken] = useState("");
  const [inputPass, setInputPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: "ADMIN" | "EDITOR" | "REDACTOR" } | null>(null);

  const [tab, setTab] = useState<"analytics" | "spaces" | "articles" | "ads" | "users">("analytics");
  const [articles, setArticles] = useState<Article[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [spaces, setSpaces] = useState<NewspaperSpace[]>([]);
  const [usersList, setUsersList] = useState<UserRole[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  const [articleModal, setArticleModal] = useState<{ open: boolean; data?: Article }>({ open: false });
  const [userModal, setUserModal] = useState<{ open: boolean; data?: UserRole }>({ open: false });
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const toastTimer = useRef<any>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = async () => {
    setAuthError(false);
    const res = await fetch(`/api/admin?resource=auth&token=${encodeURIComponent(inputPass)}`);
    if (res.ok) {
      const data = await res.json();
      setToken(inputPass);
      setCurrentUser(data.user);
      setAuthed(true);
      if (data.user.role === "REDACTOR") setTab("articles");
    } else {
      setAuthError(true);
    }
  };

  const fetchData = async (t: string) => {
    setLoading(true);
    try {
      const [arRes, adRes, spRes, anRes, usRes] = await Promise.all([
        fetch(`/api/admin?resource=articles`, { headers: { "x-admin-token": t } }).then(r => r.ok ? r.json() : {}),
        fetch(`/api/admin?resource=ads`, { headers: { "x-admin-token": t } }).then(r => r.ok ? r.json() : {}),
        fetch(`/api/admin/spaces`, { headers: { "x-admin-token": t } }).then(r => r.ok ? r.json() : {}),
        fetch(`/api/admin/analytics`, { headers: { "x-admin-token": t } }).then(r => r.ok ? r.json() : null),
        fetch(`/api/admin/users`, { headers: { "x-admin-token": t } }).then(r => r.ok ? r.json() : {}),
      ]);
      setArticles(arRes.articles ?? []);
      setAds(adRes.ads ?? []);
      setSpaces(spRes.spaces ?? []);
      if (anRes) setAnalytics(anRes);
      setUsersList(usRes.users ?? []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { if (authed) fetchData(token); }, [authed, token]);

  const deleteItem = async (type: "article" | "ad" | "user", id: string) => {
    if (!confirm("¿Eliminar este elemento?")) return;
    if (type === "user") {
      await fetch(`/api/admin/users?id=${id}`, { method: "DELETE", headers: { "x-admin-token": token } });
    } else {
      await fetch(`/api/admin?type=${type}&id=${id}`, { method: "DELETE", headers: { "x-admin-token": token } });
    }
    showToast("Eliminado correctamente");
    fetchData(token);
  };

  const togglePublished = async (article: Article) => {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ type: "article", id: article.id, published: !article.published }),
    });
    showToast(article.published ? "Despublicado" : "Publicado");
    fetchData(token);
  };

  const toggleSpaceActive = async (space: NewspaperSpace) => {
    await fetch("/api/admin/spaces", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ id: space.id, active: !space.active }),
    });
    showToast(space.active ? "Espacio deshabilitado" : "Espacio activado");
    fetchData(token);
  };

  // ─── LOGIN ─────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#060812", padding: "1rem" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "16px", padding: "2.5rem 2rem", width: "100%", maxWidth: "420px", textAlign: "center" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>🔐</div>
            <h1 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900, fontSize: "1.6rem", color: "#fff" }}>TALOS DIARIO</h1>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", fontFamily: "Inter, sans-serif", marginTop: "0.25rem" }}>
              Portal de Redacción y Gestión de Espacios
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ position: "relative" }}>
              <Lock size={14} color="rgba(255,255,255,0.3)" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="password"
                placeholder="Clave o Token de Usuario (Admin/Editor/Redactor)"
                value={inputPass}
                onChange={e => setInputPass(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{
                  width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${authError ? "#ff1744" : "rgba(255,255,255,0.12)"}`,
                  borderRadius: "10px", padding: "0.7rem 0.75rem 0.7rem 2.4rem",
                  color: "#fff", fontFamily: "Inter, sans-serif", fontSize: "0.88rem", outline: "none",
                }}
              />
            </div>
            {authError && <p style={{ fontSize: "0.72rem", color: "#ff1744", fontFamily: "Inter, sans-serif" }}>Token o contraseña incorrecta</p>}

            <div style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: "8px", padding: "0.6rem", textAlign: "left", fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", fontFamily: "Inter, sans-serif" }}>
              <strong>Perfiles de acceso demo:</strong><br />
              • Admin: <code style={{ color: "#00d4ff" }}>talos2025</code><br />
              • Editor: <code style={{ color: "#00d4ff" }}>editor2025</code><br />
              • Redactor: <code style={{ color: "#00d4ff" }}>redactor2025</code>
            </div>

            <button onClick={handleLogin} style={{
              background: "rgba(0,212,255,0.18)", border: "1px solid rgba(0,212,255,0.4)",
              borderRadius: "10px", padding: "0.75rem", color: "#00d4ff",
              fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer", width: "100%",
            }}>
              Ingresar al Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isRedactor = currentUser?.role === "REDACTOR";
  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <div style={{ minHeight: "100vh", background: "#060812", color: "#fff" }}>
      {/* Top Navbar */}
      <div style={{
        background: "rgba(10,14,26,0.95)", borderBottom: "1px solid rgba(0,212,255,0.12)",
        padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px", sticky: "top", zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 900, fontSize: "1.2rem", color: "#00d4ff" }}>TALOS</span>
          <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.06)", padding: "0.2rem 0.5rem", borderRadius: "100px", fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>
            {currentUser?.role === "ADMIN" ? "👑 ADMINISTRADOR" : currentUser?.role === "EDITOR" ? "✍️ EDITOR JEFE" : "📝 REDACTOR INVITADO"}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", fontFamily: "Inter, sans-serif", marginRight: "0.5rem" }}>{currentUser?.name}</span>
          <a href="/" target="_blank" style={{ textDecoration: "none" }}><Btn size="sm" variant="secondary"><Eye size={11} /> Ver sitio</Btn></a>
          <Btn size="sm" danger onClick={() => { setAuthed(false); setToken(""); setCurrentUser(null); }}><LogOut size={11} /> Salir</Btn>
        </div>
      </div>

      <div style={{ maxWidth: "1250px", margin: "0 auto", padding: "1.5rem" }}>
        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.75rem", overflowX: "auto" }}>
          {!isRedactor && (
            <>
              <button onClick={() => setTab("analytics")} style={{
                background: tab === "analytics" ? "rgba(0,212,255,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${tab === "analytics" ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: "8px", padding: "0.5rem 1rem", color: tab === "analytics" ? "#00d4ff" : "rgba(255,255,255,0.5)",
                fontFamily: "Outfit, sans-serif", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem"
              }}><BarChart3 size={14} /> Dashboard Analíticas</button>

              <button onClick={() => setTab("spaces")} style={{
                background: tab === "spaces" ? "rgba(0,212,255,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${tab === "spaces" ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: "8px", padding: "0.5rem 1rem", color: tab === "spaces" ? "#00d4ff" : "rgba(255,255,255,0.5)",
                fontFamily: "Outfit, sans-serif", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem"
              }}><Layout size={14} /> Espacios del Diario</button>
            </>
          )}

          <button onClick={() => setTab("articles")} style={{
            background: tab === "articles" ? "rgba(0,212,255,0.12)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${tab === "articles" ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.07)"}`,
            borderRadius: "8px", padding: "0.5rem 1rem", color: tab === "articles" ? "#00d4ff" : "rgba(255,255,255,0.5)",
            fontFamily: "Outfit, sans-serif", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem"
          }}><FileText size={14} /> {isRedactor ? "Mis Notas Redactadas" : "Notas Editoriales"}</button>

          {!isRedactor && (
            <button onClick={() => setTab("ads")} style={{
              background: tab === "ads" ? "rgba(0,212,255,0.12)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${tab === "ads" ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: "8px", padding: "0.5rem 1rem", color: tab === "ads" ? "#00d4ff" : "rgba(255,255,255,0.5)",
              fontFamily: "Outfit, sans-serif", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem"
            }}><Megaphone size={14} /> Publicidad y Banners</button>
          )}

          {isAdmin && (
            <button onClick={() => setTab("users")} style={{
              background: tab === "users" ? "rgba(0,212,255,0.12)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${tab === "users" ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: "8px", padding: "0.5rem 1rem", color: tab === "users" ? "#00d4ff" : "rgba(255,255,255,0.5)",
              fontFamily: "Outfit, sans-serif", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem"
            }}><Users size={14} /> Redacción y Roles</button>
          )}
        </div>

        {/* ─── TAB 1: ANALYTICS DASHBOARD ─── */}
        {tab === "analytics" && !isRedactor && (
          <div>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#fff", marginBottom: "1rem" }}>
              📊 Dashboard de Audiencia y Métricas de Uso
            </h2>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { label: "Lecturas Totales Registradas", value: analytics?.summary.totalEvents ?? 0, icon: "📖" },
                { label: "Vistas a Noticias", value: analytics?.summary.articleViewsCount ?? 0, icon: "📰" },
                { label: "Búsquedas IA Realizadas", value: analytics?.summary.aiQueriesCount ?? 0, icon: "🧠" },
                { label: "Visitas por Sección", value: analytics?.summary.categoryVisitsCount ?? 0, icon: "🗺️" },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(0,212,255,0.12)", borderRadius: "12px", padding: "1rem 1.1rem" }}>
                  <div style={{ fontSize: "1.4rem" }}>{s.icon}</div>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.8rem", fontWeight: 900, color: "#00d4ff", lineHeight: 1.1, marginTop: "0.2rem" }}>{s.value}</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginTop: "0.2rem" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }}>
              {/* Top AI Queries */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1.25rem" }}>
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <Flame size={15} color="#ff9100" /> Lo que más busca la gente en el Analizador IA
                </h3>
                {(!analytics?.topAiQueries || analytics.topAiQueries.length === 0) ? (
                  <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", fontFamily: "Inter, sans-serif" }}>No hay registros de búsquedas aún.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {analytics.topAiQueries.map((item, idx) => (
                      <div key={item.query} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.45rem 0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
                        <span style={{ fontSize: "0.82rem", fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#fff" }}>
                          #{idx + 1} {item.query}
                        </span>
                        <span style={{ fontSize: "0.75rem", fontFamily: "Outfit, sans-serif", color: "#00d4ff", fontWeight: 800 }}>
                          {item.count} búsquedas
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Popular Categories */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1.25rem" }}>
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <TrendingUp size={15} color="#00e676" /> Secciones Más Leídas y Populares
                </h3>
                {(!analytics?.popularCategories || analytics.popularCategories.length === 0) ? (
                  <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", fontFamily: "Inter, sans-serif" }}>No hay visitas registradas en las secciones.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {analytics.popularCategories.map(cat => (
                      <div key={cat.category} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.45rem 0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
                        <span style={{ fontSize: "0.82rem", fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#fff" }}>
                          {cat.category}
                        </span>
                        <span style={{ fontSize: "0.75rem", fontFamily: "Outfit, sans-serif", color: "#00e676", fontWeight: 800 }}>
                          {cat.count} lecturas
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: ESPACIOS DEL DIARIO ─── */}
        {tab === "spaces" && !isRedactor && (
          <div>
            <div style={{ marginBottom: "1.25rem" }}>
              <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#fff" }}>
                🖼️ Administración de Espacios y Módulos Físicos del Diario
              </h2>
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", fontFamily: "Inter, sans-serif" }}>
                Activá, desactivá o configurá en vivo la columna de invitados, radio/podcast, bloque auspiciado y marquesina.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {spaces.map(space => (
                <div key={space.id} style={{
                  background: space.active ? "rgba(0,212,255,0.03)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${space.active ? "rgba(0,212,255,0.2)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "12px", padding: "1.25rem",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.05rem", color: "#fff" }}>
                          {space.name}
                        </span>
                        <span style={{ fontSize: "0.65rem", background: space.active ? "rgba(0,230,118,0.15)" : "rgba(255,23,68,0.15)", color: space.active ? "#00e676" : "#ff1744", border: `1px solid ${space.active ? "#00e676" : "#ff1744"}40`, borderRadius: "4px", padding: "0.1rem 0.4rem", fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>
                          {space.active ? "ACTIVO EN PORTADA" : "DESACTIVADO"}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", fontFamily: "Inter, sans-serif", marginTop: "0.2rem" }}>
                        {space.description}
                      </p>
                    </div>
                    <Btn size="sm" variant={space.active ? "secondary" : "primary"} onClick={() => toggleSpaceActive(space)}>
                      {space.active ? "Desactivar Espacio" : "Activar Espacio"}
                    </Btn>
                  </div>

                  {space.contentJson && (
                    <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "0.75rem", fontSize: "0.75rem", fontFamily: "monospace", color: "rgba(255,255,255,0.7)" }}>
                      {space.contentJson}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 3: NOTAS EDITORIALES ─── */}
        {tab === "articles" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#fff" }}>
                  {isRedactor ? "Mis Notas de Redacción" : "Notas Editoriales del Diario"}
                </h2>
                {isRedactor && (
                  <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", fontFamily: "Inter, sans-serif" }}>
                    Como Redactor, podés escribir y editar tus artículos. Un Editor revisará y publicará la nota.
                  </p>
                )}
              </div>
              <Btn onClick={() => setArticleModal({ open: true })}>
                <Plus size={13} /> Nueva nota
              </Btn>
            </div>

            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {[...Array(4)].map((_, i) => <div key={i} style={{ height: "56px", borderRadius: "10px", background: "rgba(255,255,255,0.03)" }} />)}
              </div>
            ) : articles.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.25)", fontFamily: "Inter, sans-serif" }}>
                No hay notas redactadas aún. ¡Creá la primera!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {articles.map(article => (
                  <div key={article.id} style={{
                    background: "rgba(255,255,255,0.02)", border: `1px solid ${article.published ? "rgba(0,230,118,0.12)" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: "10px", padding: "0.85rem 1rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap",
                  }}>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", fontWeight: 600, color: "#fff", marginBottom: "0.2rem", lineHeight: 1.3 }}>
                        {article.title}
                      </p>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontSize: "0.65rem", background: "rgba(0,212,255,0.1)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "4px", padding: "0.1rem 0.4rem", fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>
                          {article.category}
                        </span>
                        <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", fontFamily: "Inter, sans-serif" }}>
                          ✍️ {article.author}
                        </span>
                        {!article.published && (
                          <span style={{ fontSize: "0.65rem", color: "#ffc400", background: "rgba(255,196,0,0.1)", border: "1px solid rgba(255,196,0,0.2)", borderRadius: "4px", padding: "0.1rem 0.4rem", fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>
                            EN REVISIÓN / BORRADOR
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                      {!isRedactor && (
                        <Btn size="sm" variant="secondary" onClick={() => togglePublished(article)}>
                          {article.published ? <EyeOff size={11} /> : <Eye size={11} />}
                          {article.published ? "Despublicar" : "Publicar"}
                        </Btn>
                      )}
                      <Btn size="sm" variant="secondary" onClick={() => setArticleModal({ open: true, data: article })}>
                        <Pencil size={11} /> Editar
                      </Btn>
                      <Btn size="sm" danger onClick={() => deleteItem("article", article.id)}>
                        <Trash2 size={11} />
                      </Btn>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 4: ADS ─── */}
        {tab === "ads" && !isRedactor && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#fff" }}>
                Avisos Publicitarios y Banners Promocionales
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {ads.map(ad => (
                <div key={ad.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "0.85rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>{ad.title || "Banner sin título"}</div>
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", fontFamily: "Inter, sans-serif" }}>Sección: {ad.section} | Posición: {ad.position}</div>
                  </div>
                  <Btn size="sm" danger onClick={() => deleteItem("ad", ad.id)}><Trash2 size={11} /></Btn>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 5: USUARIOS Y ROLES (SOLO ADMIN) ─── */}
        {tab === "users" && isAdmin && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#fff" }}>
                  👥 Gestión de Integrantes de Redacción y Permisos (RBAC)
                </h2>
                <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", fontFamily: "Inter, sans-serif" }}>
                  Creá redactores, editores o columnistas invitados otorgando tokens de acceso restringido.
                </p>
              </div>
              <Btn onClick={() => setUserModal({ open: true })}>
                <Plus size={13} /> Nuevo Usuario
              </Btn>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {usersList.map(u => (
                <div key={u.id} style={{
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px", padding: "0.85rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "#fff" }}>{u.name}</span>
                      <span style={{ fontSize: "0.65rem", background: "rgba(0,212,255,0.1)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "4px", padding: "0.1rem 0.4rem", fontFamily: "Outfit, sans-serif", fontWeight: 700 }}>
                        {u.role}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", fontFamily: "Inter, sans-serif", marginTop: "0.1rem" }}>
                      {u.email} • Token: <code style={{ color: "#00d4ff" }}>{u.passToken}</code>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <Btn size="sm" variant="secondary" onClick={() => setUserModal({ open: true, data: u })}><Pencil size={11} /></Btn>
                    <Btn size="sm" danger onClick={() => deleteItem("user", u.id)}><Trash2 size={11} /></Btn>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      {articleModal.open && (
        <ArticleForm token={token} userRole={currentUser?.role} initial={articleModal.data} onClose={() => setArticleModal({ open: false })} onSave={() => { setArticleModal({ open: false }); fetchData(token); showToast("Nota guardada ✓"); }} />
      )}
      {userModal.open && (
        <UserForm token={token} initial={userModal.data} onClose={() => setUserModal({ open: false })} onSave={() => { setUserModal({ open: false }); fetchData(token); showToast("Usuario actualizado ✓"); }} />
      )}

      {toast && <Toast msg={toast.msg} ok={toast.ok} />}

      <style>{`
        @keyframes slideIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>
    </div>
  );
}
