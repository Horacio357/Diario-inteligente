"use client";

import { useState, useEffect, useRef } from "react";
import { Radio, Play, Pause, Volume2, VolumeX, Globe, Music, RefreshCw } from "lucide-react";

interface RadioStation {
  stationuuid: string;
  name: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  countrycode: string;
  country: string;
  tags: string;
  bitrate: number;
}

const COUNTRIES = [
  { code: "AR", name: "🇦🇷 Argentina" },
  { code: "ES", name: "🇪🇸 España" },
  { code: "US", name: "🇺🇸 EE.UU." },
  { code: "GB", name: "🇬🇧 Reino Unido" },
  { code: "BR", name: "🇧🇷 Brasil" },
  { code: "FR", name: "🇫🇷 Francia" },
  { code: "IT", name: "🇮🇹 Italia" },
  { code: "MX", name: "🇲🇽 México" },
  { code: "JP", name: "🇯🇵 Japón" },
];

const TAGS = [
  { label: "Todas", value: "" },
  { label: "📰 Noticias / Talk", value: "news" },
  { label: "💃 Tango", value: "tango" },
  { label: "🎸 Rock", value: "rock" },
  { label: "🎹 Jazz", value: "jazz" },
  { label: "🎵 Pop", value: "pop" },
];

const API_MIRRORS = [
  "https://de1.api.radio-browser.info",
  "https://at1.api.radio-browser.info",
  "https://nl1.api.radio-browser.info"
];

// High quality fallback streams for Argentina
const AR_FALLBACK_STATIONS: RadioStation[] = [
  {
    stationuuid: "fb-mitre",
    name: "Radio Mitre AM 790",
    url_resolved: "https://radiomitre-lh.akamaihd.net/i/radiomitre_1@507718/master.m3u8",
    homepage: "https://radiomitre.cienradios.com/",
    favicon: "https://radiomitre.cienradios.com/favicon.ico",
    countrycode: "AR",
    country: "Argentina",
    tags: "news,talk",
    bitrate: 128
  },
  {
    stationuuid: "fb-cadena3",
    name: "Cadena 3 Argentina (Córdoba)",
    url_resolved: "https://cadena3.cdn.305stream.com/cadena3",
    homepage: "https://www.cadena3.com/",
    favicon: "",
    countrycode: "AR",
    country: "Argentina",
    tags: "news,talk",
    bitrate: 128
  },
  {
    stationuuid: "fb-lared",
    name: "Radio La Red AM 910",
    url_resolved: "https://lared.cdn.305stream.com/lared",
    homepage: "https://www.lared.am/",
    favicon: "",
    countrycode: "AR",
    country: "Argentina",
    tags: "news,sports",
    bitrate: 128
  },
  {
    stationuuid: "fb-continental",
    name: "Radio Continental AM 590",
    url_resolved: "https://continental.cdn.305stream.com/continental",
    homepage: "https://www.continental.com.ar/",
    favicon: "",
    countrycode: "AR",
    country: "Argentina",
    tags: "news",
    bitrate: 128
  }
];

export default function WorldRadioPlayer() {
  const [country, setCountry] = useState("AR");
  const [selectedTag, setSelectedTag] = useState("");
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const audioRef = useRef<HTMLAudioElement>(null);

  const fetchStations = async (countryCode: string, tag: string) => {
    setLoading(true);
    setErrorMsg("");
    let fetched = false;

    for (const mirror of API_MIRRORS) {
      try {
        let url = `${mirror}/json/stations/bycountrycodeexact/${countryCode}?limit=30&order=clickcount&reverse=true`;
        if (tag) {
          url = `${mirror}/json/stations/search?countrycode=${countryCode}&tag=${tag}&limit=30&order=clickcount&reverse=true`;
        }
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) {
          const data: RadioStation[] = await res.json();
          const valid = data
            .map(s => ({ ...s, name: s.name.trim() }))
            .filter(s => s.url_resolved && s.name.length > 0);
          
          if (valid.length > 0) {
            setStations(valid);
            if (!currentStation || !valid.some(s => s.stationuuid === currentStation.stationuuid)) {
              setCurrentStation(valid[0]);
            }
            fetched = true;
            break;
          }
        }
      } catch {
        // Try next mirror
      }
    }

    if (!fetched) {
      if (countryCode === "AR") {
        setStations(AR_FALLBACK_STATIONS);
        if (!currentStation) setCurrentStation(AR_FALLBACK_STATIONS[0]);
      } else {
        setErrorMsg("Servidores de radio no disponibles temporalmente.");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStations(country, selectedTag);
  }, [country, selectedTag]);

  const togglePlay = (station?: RadioStation) => {
    const target = station || currentStation;
    if (!target) return;

    if (currentStation?.stationuuid !== target.stationuuid) {
      setCurrentStation(target);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = target.url_resolved;
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    } else {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().catch(() => setIsPlaying(false));
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  };

  const toggleMute = () => {
    setMuted(m => !m);
    if (audioRef.current) {
      audioRef.current.muted = !muted;
    }
  };

  return (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--card-border)",
      borderRadius: "16px",
      padding: "1.25rem",
      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      display: "flex",
      flexDirection: "column",
      gap: "1rem"
    }}>
      {/* Audio element oculto */}
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />

      {/* Header Widget */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "rgba(0,212,255,0.12)", border: "1px solid var(--accent-primary)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Radio size={16} color="var(--accent-primary)" />
          </div>
          <div>
            <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "var(--heading-color)", margin: 0 }}>
              Radio Mundial en Vivo
            </h3>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>
              Sintonizá +40.000 emisoras internacionales
            </span>
          </div>
        </div>

        {/* Indicador Ecualizador En Vivo */}
        {isPlaying && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "16px" }}>
            <span style={{ width: "3px", height: "12px", background: "var(--accent-primary)", borderRadius: "2px", animation: "breathe 0.6s ease infinite" }} />
            <span style={{ width: "3px", height: "16px", background: "var(--accent-primary)", borderRadius: "2px", animation: "breathe 0.9s ease infinite" }} />
            <span style={{ width: "3px", height: "8px", background: "var(--accent-primary)", borderRadius: "2px", animation: "breathe 0.4s ease infinite" }} />
          </div>
        )}
      </div>

      {/* Controles de Filtros: País y Género */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        <div>
          <label style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.2rem" }}>
            País
          </label>
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            style={{
              width: "100%", background: "rgba(0,0,0,0.1)", border: "1px solid var(--glass-border)",
              borderRadius: "8px", padding: "0.4rem 0.6rem", color: "var(--text-primary)",
              fontFamily: "Inter, sans-serif", fontSize: "0.78rem", outline: "none"
            }}
          >
            {COUNTRIES.map(c => <option key={c.code} value={c.code} style={{ background: "#0a0e1a", color: "#fff" }}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.2rem" }}>
            Género
          </label>
          <select
            value={selectedTag}
            onChange={e => setSelectedTag(e.target.value)}
            style={{
              width: "100%", background: "rgba(0,0,0,0.1)", border: "1px solid var(--glass-border)",
              borderRadius: "8px", padding: "0.4rem 0.6rem", color: "var(--text-primary)",
              fontFamily: "Inter, sans-serif", fontSize: "0.78rem", outline: "none"
            }}
          >
            {TAGS.map(t => <option key={t.value} value={t.value} style={{ background: "#0a0e1a", color: "#fff" }}>{t.label}</option>)}
          </select>
        </div>
      </div>

      {/* Emisora Actual Reproduciéndose */}
      {currentStation && (
        <div style={{
          background: "rgba(0,212,255,0.06)", border: "1px solid var(--glass-border)",
          borderRadius: "12px", padding: "0.85rem", display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", overflow: "hidden" }}>
            {currentStation.favicon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentStation.favicon} alt="logo" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Music size={16} color="var(--accent-primary)" />
              </div>
            )}
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.85rem", fontWeight: 800, color: "var(--heading-color)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {currentStation.name}
              </div>
              <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>
                {currentStation.country} {currentStation.bitrate ? `· ${currentStation.bitrate} kbps` : ""}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              onClick={() => togglePlay()}
              style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: isPlaying ? "#ff1744" : "var(--accent-primary)",
                border: "none", color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 16px rgba(0,212,255,0.4)"
              }}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: "2px" }} />}
            </button>
          </div>
        </div>
      )}

      {/* Control de Volumen */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <button onClick={toggleMute} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
          {muted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={muted ? 0 : volume}
          onChange={e => handleVolumeChange(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: "var(--accent-primary)", cursor: "pointer" }}
        />
      </div>

      {/* Lista de Emisoras Encontradas */}
      <div style={{ maxHeight: "160px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        {loading ? (
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center", padding: "0.5rem" }}>
            Sintonizando radios...
          </div>
        ) : stations.length === 0 ? (
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center", padding: "0.5rem" }}>
            No se encontraron radios en esta categoría.
          </div>
        ) : (
          stations.map(st => {
            const isSelected = currentStation?.stationuuid === st.stationuuid;
            return (
              <button
                key={st.stationuuid}
                onClick={() => togglePlay(st)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  textAlign: "left", background: isSelected ? "rgba(0,212,255,0.12)" : "rgba(0,0,0,0.05)",
                  border: `1px solid ${isSelected ? "var(--accent-primary)" : "transparent"}`,
                  borderRadius: "6px", padding: "0.35rem 0.6rem", color: "var(--text-primary)",
                  fontFamily: "Inter, sans-serif", fontSize: "0.75rem", cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }}>
                  {isSelected && isPlaying ? "▶ " : ""}{st.name}
                </span>
                <span style={{ fontSize: "0.62rem", color: "var(--text-muted)" }}>
                  {st.tags?.split(",")[0] || "Radio"}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
