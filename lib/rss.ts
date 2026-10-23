import Parser from "rss-parser";

const parser = new Parser({
  timeout: 5000,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
  }
});

// Cache en memoria para evitar saturar feeds externos y reducir tiempos de respuesta a <10ms
const rssCache = new Map<string, { data: RSSArticle[]; expiresAt: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutos

// Feeds RSS verificados y categorizados por sección
export const CATEGORY_RSS_MAP: Record<string, { name: string; url: string }[]> = {
  deportes: [
    { name: "Clarín Deportes", url: "https://www.clarin.com/rss/deportes/" },
    { name: "Olé", url: "https://www.ole.com.ar/rss/ultimas-noticias/" },
    { name: "Ámbito Deportes", url: "https://www.ambito.com/rss/pages/deportes.xml" },
    { name: "Perfil Deportes", url: "https://www.perfil.com/rss/deportes" }
  ],
  politica: [
    { name: "Clarín Política", url: "https://www.clarin.com/rss/politica/" },
    { name: "Ámbito Política", url: "https://www.ambito.com/rss/pages/politica.xml" },
    { name: "Ámbito Economía", url: "https://www.ambito.com/rss/pages/economia.xml" },
    { name: "La Nación", url: "https://www.lanacion.com.ar/arc/outboundfeeds/rss/?outputType=xml" }
  ],
  tecnologia: [
    { name: "Clarín Tecno", url: "https://www.clarin.com/rss/tecnologia/" },
    { name: "Ámbito Tecnología", url: "https://www.ambito.com/rss/pages/tecnologia.xml" },
    { name: "Perfil Tecno", url: "https://www.perfil.com/rss/tecnologia" }
  ],
  ciencia: [
    { name: "Clarín Buena Vida / Ciencia", url: "https://www.clarin.com/rss/buena-vida/" },
    { name: "Ámbito Información General", url: "https://www.ambito.com/rss/pages/informacion-general.xml" },
    { name: "La Nación", url: "https://www.lanacion.com.ar/arc/outboundfeeds/rss/?outputType=xml" }
  ],
  locales: [
    { name: "Clarín Sociedad / Ciudades", url: "https://www.clarin.com/rss/sociedad/" },
    { name: "Ámbito Nacional", url: "https://www.ambito.com/rss/pages/nacional.xml" },
    { name: "La Gaceta Tucumán", url: "https://www.lagaceta.com.ar/rss/portada" }
  ],
  general: [
    { name: "Clarín Lo Último", url: "https://www.clarin.com/rss/lo-ultimo/" },
    { name: "Ámbito Portada", url: "https://www.ambito.com/rss/pages/home.xml" },
    { name: "La Nación Portada", url: "https://www.lanacion.com.ar/arc/outboundfeeds/rss/?outputType=xml" }
  ]
};

// Palabras clave obligatorias para validar pertinencia por categoría
export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  deportes: [
    "fútbol", "futbol", "messi", "scaloni", "selección", "seleccion", "boca", "river", "san lorenzo", "racing",
    "independiente", "liga profesional", "gol", "partido", "afa", "champions", "tenis", "rugby", "pumas", "basquet",
    "básquet", "automovilismo", "fórmula 1", "f1", "copa", "dt", "entrenador", "campeonato", "derrota", "triunfo",
    "olímpicos", "deporte", "deportes", "jugador", "plantel", "estadio", "árbitro", "penal", "colapinto"
  ],
  politica: [
    "milei", "gobierno", "congreso", "senado", "diputados", "ley", "decreto", "canciller", "ministro", "presidente",
    "oposición", "oposicion", "peronismo", "radicalismo", "pro", "lla", "villarruel", "caputo", "bullrich", "gobernador",
    "kicillof", "política", "politica", "elecciones", "partido", "voto", "presupuesto", "oficialismo", "dnu", "justicia"
  ],
  tecnologia: [
    "inteligencia artificial", "ia", "software", "hardware", "apple", "google", "meta", "whatsapp", "iphone",
    "android", "startup", "app", "cripto", "bitcoin", "tecnología", "tecnologia", "algoritmo", "chatgpt", "openai",
    "ciberseguridad", "hacker", "redes sociales", "robot", "robótica", "chip", "semiconductor", "plataforma"
  ],
  ciencia: [
    "ciencia", "conicet", "investigación", "investigacion", "científico", "cientifico", "salud", "vacuna", "virus",
    "cáncer", "cancer", "espacio", "nasa", "astronomía", "astronomia", "estudio", "descubrimiento", "fármaco",
    "farmaco", "medicina", "biología", "biologia", "planeta", "tierra", "laboratorio", "ensayo"
  ],
  locales: [
    "buenos aires", "córdoba", "cordoba", "santa fe", "rosario", "mendoza", "tucumán", "salta", "jujuy",
    "patagonia", "neuquén", "misiones", "corrientes", "san juan", "municipio", "provincia", "localidad",
    "intendente", "barrio", "vecinos", "comuna", "obra pública", "tránsito"
  ]
};

export interface RSSArticle {
  title: string;
  source_name: string;
  link: string;
  pubDate: string;
  description?: string;
}

/**
 * Escanea los feeds RSS de una categoría específica y filtra por palabras clave pertinentes.
 * Cuenta con caché en memoria con TTL de 10 minutos para alta velocidad de respuesta.
 */
export async function fetchArgentineRSS(query: string = "", category: string = ""): Promise<RSSArticle[]> {
  const normCategory = category.toLowerCase().trim();
  const cacheKey = `${normCategory}:${query.toLowerCase().trim()}`;

  // 1. Revisar caché en memoria
  const cached = rssCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const feeds = CATEGORY_RSS_MAP[normCategory] || CATEGORY_RSS_MAP.general;
  const keywords = CATEGORY_KEYWORDS[normCategory] || [];

  // Palabras ruidosas/genericas a ignorar de la query
  const STOP_WORDS = new Set(["argentina", "noticias", "ultimo", "momento", "hoy", "diario", "prensa"]);

  const queryTerms = query
    .toLowerCase()
    .replace(/["']/g, '')
    .split(" ")
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));

  const promises = feeds.map(async (feed) => {
    try {
      const feedData = await parser.parseURL(feed.url);
      let items = feedData.items || [];

      // 1. Filtrado obligatorio por pertinencia de Categoría (si está especificada)
      if (keywords.length > 0) {
        items = items.filter(item => {
          const textToSearch = `${item.title || ""} ${item.contentSnippet || ""} ${item.content || ""}`.toLowerCase();
          return keywords.some(kw => textToSearch.includes(kw));
        });
      }

      // 2. Filtrado adicional por términos específicos de búsqueda de la query
      if (queryTerms.length > 0) {
        items = items.filter(item => {
          const textToSearch = `${item.title || ""} ${item.contentSnippet || ""} ${item.content || ""}`.toLowerCase();
          return queryTerms.some(term => textToSearch.includes(term));
        });
      }

      return items.map(item => ({
        title: item.title || "Sin título",
        source_name: feed.name,
        link: item.link || "",
        pubDate: item.isoDate || item.pubDate || new Date().toISOString(),
        description: item.contentSnippet || item.content || ""
      }));
    } catch (error) {
      // Ignorar de forma segura y continuar con las fuentes disponibles
      return [];
    }
  });

  const results = await Promise.all(promises);
  
  // Aplanar el array de arrays y ordenar por fecha más reciente
  const allArticles = results.flat().sort((a, b) => {
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });

  // Guardar en caché si obtuvimos resultados
  if (allArticles.length > 0) {
    rssCache.set(cacheKey, { data: allArticles, expiresAt: Date.now() + CACHE_TTL_MS });
  }

  return allArticles;
}
