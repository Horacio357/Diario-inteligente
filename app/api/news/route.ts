import { NextRequest, NextResponse } from "next/server";
import { fetchArgentineRSS, RSSArticle } from "@/lib/rss";
import { CATEGORY_FALLBACKS } from "@/lib/categoryFallbacks";

const API_KEY = process.env.NEWSDATA_API_KEY;
const API_URL = process.env.NEWSDATA_API_URL || "https://newsdata.io/api/1/latest";

function heuristicSentiment(text: string): number {
  const clean = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const pos = [
    "logro", "exito", "victoria", "bien", "positivo", "avance", "recuperacion", "crecimiento",
    "apoyo", "reconocimiento", "acuerdo", "mejor", "progreso", "gano", "celebra", "excelente", 
    "historico", "elogio", "record", "superavit", "sube", "alza", "beneficio", "inversion", 
    "reactivacion", "calma", "alivio", "tregua", "optimista", "repunte", "mejora", "supera",
    "crece", "fortalece", "respaldo", "inaugura", "obras", "descuento",
    "estabilidad", "controlado", "inversion", "inversiones", "desarrollo", "empleo", "pyme",
    "acuerdan", "apoya", "luz verde", "satisfecho", "consenso", "baja el dolar", "baja del dolar",
    "baja la inflacion", "caida de la inflacion", "desaceleracion"
  ];

  const neg = [
    "escandalo", "corrupcion", "crisis", "fracaso", "caida", "condena", "juicio", "protesta",
    "conflicto", "deuda", "inflacion", "pobreza", "desempleo", "renuncia", "acusa", "denuncia", 
    "fraude", "robo", "mal", "peor", "grave", "problema", "falla", "error", "ataque", "violencia", 
    "critica", "cuestionado", "cepo", "tension", "ajuste", "deficit", "freno", "devaluacion", 
    "despido", "despidos", "desplome", "derrumbe", "marcha", "paro", "huelga", 
    "reclamo", "descontento", "baja", "tarifazo", "recorte", "licuacion", "recortes", "licua",
    "tensiones", "polemica", "polemico", "denunciado", "imputado", "allanamiento", "delito",
    "inseguridad", "delincuencia", "crimen", "asesinato", "robo", "asalto", "drogas", "narco",
    "narcotrafico", "pobre", "indigencia", "hambre", "escasez", "falta", "quiebra", "suspension",
    "recesion", "cae", "cayo", "pierde", "perdio", "perjudica", "dano", "alerta", "preocupacion",
    "preocupante", "amenaza", "riesgo", "riesgoso", "dificil", "complicado", "sancion"
  ];

  let score = 0;
  
  pos.forEach(w => {
    if (clean.includes(w)) {
      score += 0.20;
    }
  });

  neg.forEach(w => {
    if (clean.includes(w)) {
      score -= 0.20;
    }
  });

  return Math.max(-1, Math.min(1, score));
}

function inferCategoryFromQuery(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("deporte") || lower.includes("futbol") || lower.includes("fútbol") || lower.includes("messi") || lower.includes("selección")) return "deportes";
  if (lower.includes("politica") || lower.includes("política") || lower.includes("milei") || lower.includes("congreso") || lower.includes("gobierno")) return "politica";
  if (lower.includes("tecno") || lower.includes("inteligencia artificial") || lower.includes("startup") || lower.includes("software")) return "tecnologia";
  if (lower.includes("ciencia") || lower.includes("conicet") || lower.includes("salud") || lower.includes("investigación")) return "ciencia";
  if (lower.includes("local") || lower.includes("provincia") || lower.includes("municipio")) return "locales";
  return "";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  let category = searchParams.get("category") || searchParams.get("cat") || "";
  const language = searchParams.get("lang") || "es";
  const country = searchParams.get("country") || "ar";

  if (!category) {
    category = inferCategoryFromQuery(query);
  }

  try {
    // 1. Iniciar búsquedas en paralelo (Feeds específicos por categoría + NewsData)
    const rssPromise = fetchArgentineRSS(query, category);
    
    let newsdataPromise = Promise.resolve([]);
    if (API_KEY) {
      const newsQuery = category ? `${query} ${category}`.trim() : query;
      const params = new URLSearchParams({ apikey: API_KEY, q: newsQuery, language, country, size: "10" });
      newsdataPromise = fetch(`${API_URL}?${params.toString()}`, { next: { revalidate: 300 } })
        .then(res => res.ok ? res.json() : { results: [] })
        .then(data => data.results || [])
        .catch(() => []);
    }

    const [rssArticles, newsdataArticles] = await Promise.all([rssPromise, newsdataPromise]);

    const formattedNewsData = newsdataArticles.map((item: any) => ({
      title: item.title,
      source_name: item.source_id || "NewsData",
      link: item.link,
      pubDate: item.pubDate,
      description: item.description || ""
    }));

    const combined = [...rssArticles, ...formattedNewsData];

    // Remover duplicados
    const uniqueMap = new Map<string, RSSArticle>();
    combined.forEach(item => {
      const key = item.title.slice(0, 30).toLowerCase();
      if (!uniqueMap.has(key) && !uniqueMap.has(item.link)) {
        uniqueMap.set(key, item as RSSArticle);
        uniqueMap.set(item.link, item as RSSArticle);
      }
    });

    const uniqueArticles = Array.from(new Set(Array.from(uniqueMap.values()))).slice(0, 10);

    // Transformar y limpiar los datos para el frontend
    let articles = uniqueArticles.map((item) => ({
      id: Math.random().toString(36),
      title: item.title || "Sin título",
      source: item.source_name || "Desconocido",
      url: item.link || "#",
      publishedAt: item.pubDate || new Date().toISOString(),
      sentiment: heuristicSentiment(item.title || ""),
      description: item.description || "",
      keywords: [],
      imageUrl: null as string | null,
    }));

    // Si la categoría tiene menos de 5 artículos en vivo o está en modo offline, complementar con los fallbacks temáticos exactos
    const normCat = category.toLowerCase().trim();
    if (normCat && CATEGORY_FALLBACKS[normCat]) {
      const fallbacks = CATEGORY_FALLBACKS[normCat];
      if (articles.length < 6) {
        const fallbackFormatted = fallbacks.map(f => ({
          id: f.id,
          title: f.title,
          source: f.source,
          url: f.url,
          publishedAt: f.publishedAt,
          sentiment: f.sentiment,
          description: f.description,
          keywords: [],
          imageUrl: f.imageUrl
        }));
        articles = [...articles, ...fallbackFormatted.slice(0, 10 - articles.length)];
      }
    }

    return NextResponse.json({
      articles,
      totalResults: articles.length,
      nextPage: null,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
