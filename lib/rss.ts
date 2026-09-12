import Parser from "rss-parser";

const parser = new Parser({
  timeout: 6000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  }
});

// Feeds RSS categorizados por sección
export const CATEGORY_RSS_MAP: Record<string, { name: string; url: string }[]> = {
  deportes: [
    { name: "Clarín Deportes", url: "https://www.clarin.com/rss/deportes/" },
    { name: "Infobae Deportes", url: "https://www.infobae.com/deportes/feed/" },
    { name: "La Nación Deportes", url: "https://servicios.lanacion.com.ar/herramientas/rss/origen=7" },
    { name: "Perfil Deportes", url: "https://www.perfil.com/rss/deportes" }
  ],
  politica: [
    { name: "Clarín Política", url: "https://www.clarin.com/rss/politica/" },
    { name: "Infobae Política", url: "https://www.infobae.com/politica/feed/" },
    { name: "La Nación Política", url: "https://servicios.lanacion.com.ar/herramientas/rss/origen=1" },
    { name: "Página/12 Política", url: "https://www.pagina12.com.ar/rss/secciones/el-pais/notas.xml" }
  ],
  tecnologia: [
    { name: "Clarín Tecno", url: "https://www.clarin.com/rss/tecnologia/" },
    { name: "Infobae Tecno", url: "https://www.infobae.com/tecno/feed/" },
    { name: "La Nación Tecnología", url: "https://servicios.lanacion.com.ar/herramientas/rss/origen=8" }
  ],
  ciencia: [
    { name: "Clarín Buena Vida / Ciencia", url: "https://www.clarin.com/rss/buena-vida/" },
    { name: "Infobae Salud & Ciencia", url: "https://www.infobae.com/salud/feed/" }
  ],
  locales: [
    { name: "Clarín Sociedad / Ciudades", url: "https://www.clarin.com/rss/sociedad/" },
    { name: "Infobae Sociedad", url: "https://www.infobae.com/sociedad/feed/" },
    { name: "Página/12 Sociedades", url: "https://www.pagina12.com.ar/rss/secciones/sociedad/notas.xml" }
  ],
  general: [
    { name: "Clarín Lo Último", url: "https://www.clarin.com/rss/lo-ultimo/" },
    { name: "Infobae Argentina", url: "https://www.infobae.com/argentina/feed/" },
    { name: "La Nación Portada", url: "https://servicios.lanacion.com.ar/herramientas/rss/origen=2" }
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
 */
export async function fetchArgentineRSS(query: string = "", category: string = ""): Promise<RSSArticle[]> {
  const normCategory = category.toLowerCase().trim();
  const feeds = CATEGORY_RSS_MAP[normCategory] || CATEGORY_RSS_MAP.general;
  const keywords = CATEGORY_KEYWORDS[normCategory] || [];

  // Palabras ruidosas/genericas a ignorar de la query (ej: argentina, noticias, etc.)
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
      console.error(`Error leyendo RSS de ${feed.name}:`, error);
      return [];
    }
  });

  const results = await Promise.all(promises);
  
  // Aplanar el array de arrays y ordenar por fecha más reciente
  const allArticles = results.flat().sort((a, b) => {
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });

  return allArticles;
}
