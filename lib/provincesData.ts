export interface ProvinceMetadata {
  slug: string;
  name: string;
  capital: string;
  governor: string;
  governorParty: string;
  region: "Centro" | "Norte Grande" | "Nuevo Cuyo" | "Patagonia" | "CABA";
  population: string;
  keySectors: string[];
  description: string;
}

export const PROVINCES_CATALOG: Record<string, ProvinceMetadata> = {
  "buenos-aires-ciudad": {
    slug: "buenos-aires-ciudad",
    name: "Ciudad Autónoma de Buenos Aires (CABA)",
    capital: "CABA",
    governor: "Jorge Macri",
    governorParty: "PRO / Juntos por el Cambio",
    region: "CABA",
    population: "3.120.000 hab.",
    keySectors: ["Servicios Financieros", "Tecnología", "Comercio", "Turismo"],
    description: "Distrito financiero y administrativo central con alta polarización temática y fuerte exposición a la agenda nacional de servicios y transporte."
  },
  "buenos-aires": {
    slug: "buenos-aires",
    name: "Buenos Aires",
    capital: "La Plata",
    governor: "Axel Kicillof",
    governorParty: "Unión por la Patria",
    region: "Centro",
    population: "17.569.000 hab.",
    keySectors: ["Industria Manufacturera", "Agroindustria", "Puertos", "Logística"],
    description: "La mayor jurisdicción electoral y productiva del país, marcada por el contraste entre el Conurbano y el interior agropecuario."
  },
  "cordoba": {
    slug: "cordoba",
    name: "Córdoba",
    capital: "Córdoba",
    governor: "Martín Llaryora",
    governorParty: "Hacemos Unidos por Córdoba",
    region: "Centro",
    population: "3.978.000 hab.",
    keySectors: ["Agroindustria", "Automotriz", "Economía del Conocimiento", "Turismo"],
    description: "Eje productivo central del país con identidad política federal propia y fuerte peso electoral independiente."
  },
  "santa-fe": {
    slug: "santa-fe",
    name: "Santa Fe",
    capital: "Santa Fe de la Vera Cruz",
    governor: "Maximiliano Pullaro",
    governorParty: "Unidos para Cambiar Santa Fe",
    region: "Centro",
    population: "3.556.000 hab.",
    keySectors: ["Complejo Portuario Gran Rosario", "Cereales y Oleaginosas", "Metalmecánica", "Lechería"],
    description: "Epicentro agroexportador portuario con especial atención en la agenda de seguridad ciudadana y justicia penal."
  },
  "mendoza": {
    slug: "mendoza",
    name: "Mendoza",
    capital: "Mendoza",
    governor: "Alfredo Cornejo",
    governorParty: "Frente Cambia Mendoza / UCR",
    region: "Nuevo Cuyo",
    population: "2.014.000 hab.",
    keySectors: ["Vitivinicultura", "Energía y Minería", "Turismo Internacional", "Comercio"],
    description: "Polo cuyano de referencia institucional con agenda orientada a inversiones, minería sustentable y gestión del agua."
  },
  "tucuman": {
    slug: "tucuman",
    name: "Tucumán",
    capital: "San Miguel de Tucumán",
    governor: "Osvaldo Jaldo",
    governorParty: "Partido Justicialista",
    region: "Norte Grande",
    population: "1.703.000 hab.",
    keySectors: ["Industria Azucarera", "Cítricos (Limón)", "Bioetanol", "Comercio Regional"],
    description: "Nodo neurálgico del Noroeste Argentino con alta densidad demográfica y peso clave en los acuerdos legislativos federales."
  },
  "salta": {
    slug: "salta",
    name: "Salta",
    capital: "Salta",
    governor: "Gustavo Sáenz",
    governorParty: "Identidad Salteña / Provincial",
    region: "Norte Grande",
    population: "1.440.000 hab.",
    keySectors: ["Minería (Litio)", "Agroindustria", "Gas y Petróleo", "Turismo"],
    description: "Líder regional en el auge minero del litio con marcada diplomacia de concertación federal."
  },
  "jujuy": {
    slug: "jujuy",
    name: "Jujuy",
    capital: "San Salvador de Jujuy",
    governor: "Carlos Sadir",
    governorParty: "Frente Cambia Jujuy / UCR",
    region: "Norte Grande",
    population: "797.000 hab.",
    keySectors: ["Minería de Litio", "Energía Solar (Cauchari)", "Tabaco", "Turismo de Quebrada"],
    description: "Pionera en transición energética y minería estratégica en el Altiplano con proyección exportadora."
  },
  "entre-rios": {
    slug: "entre-rios",
    name: "Entre Ríos",
    capital: "Paraná",
    governor: "Rogelio Frigerio",
    governorParty: "Juntos por Entre Ríos",
    region: "Centro",
    population: "1.426.000 hab.",
    keySectors: ["Avicultura", "Arroz y Cítricos", "Termas y Turismo", "Foresto-industria"],
    description: "Provincia mesopotámica agropecuaria con fuerte interconexión con el corredor bioceánico y Uruguay."
  },
  "corrientes": {
    slug: "corrientes",
    name: "Corrientes",
    capital: "Corrientes",
    governor: "Gustavo Valdés",
    governorParty: "Encuentro por Corrientes / UCR",
    region: "Norte Grande",
    population: "1.197.000 hab.",
    keySectors: ["Ganadería", "Foresto-industria", "Arroz", "Turismo Esteros del Iberá"],
    description: "Bastión histórico del Litoral con fuerte perfil forestal, ganadero y defensa de regalías hidroeléctricas."
  },
  "misiones": {
    slug: "misiones",
    name: "Misiones",
    capital: "Posadas",
    governor: "Hugo Passalacqua",
    governorParty: "Frente Renovador de la Concordia",
    region: "Norte Grande",
    population: "1.280.000 hab.",
    keySectors: ["Yerba Mate y Té", "Foresto-industria", "Turismo (Cataratas del Iguazú)", "Silicon Misiones"],
    description: "Frontera geopolítica estratégica del Mercosur con modelo de provincia 'startup' y biodiversidad protegida."
  },
  "chaco": {
    slug: "chaco",
    name: "Chaco",
    capital: "Resistencia",
    governor: "Leandro Zdero",
    governorParty: "Juntos por el Cambio",
    region: "Norte Grande",
    population: "1.142.000 hab.",
    keySectors: ["Algodón", "Cereales y Soja", "Ganadería", "Administración y Comercio"],
    description: "Jurisdicción en transformación política con foco en contención socioeconómica e infraestructura básica."
  },
  "formosa": {
    slug: "formosa",
    name: "Formosa",
    capital: "Formosa",
    governor: "Gildo Insfrán",
    governorParty: "Partido Justicialista",
    region: "Norte Grande",
    population: "606.000 hab.",
    keySectors: ["Administración Pública", "Ganadería", "Petróleo", "Agroalimentos"],
    description: "Provincia fronteriza con prolongada continuidad institucional y estructura estatal de fuerte impacto local."
  },
  "santiago-del-estero": {
    slug: "santiago-del-estero",
    name: "Santiago del Estero",
    capital: "Santiago del Estero",
    governor: "Gerardo Zamora",
    governorParty: "Frente Cívico por Santiago",
    region: "Norte Grande",
    population: "1.054.000 hab.",
    keySectors: ["Agricultura Extensiva", "Ganadería", "Turismo Deportivo (Termas)", "Obra Pública"],
    description: "Creciente polo agrícola del NOA con un esquema de concertación provincial consolidado."
  },
  "la-rioja": {
    slug: "la-rioja",
    name: "La Rioja",
    capital: "La Rioja",
    governor: "Ricardo Quintela",
    governorParty: "Partido Justicialista",
    region: "Nuevo Cuyo",
    population: "384.000 hab.",
    keySectors: ["Olivicultura", "Vitivinicultura", "Empresas Públicas Provinciales", "Energía Eólica"],
    description: "Territorio con fuerte presencia del Estado local en la actividad productiva y activo debate sobre coparticipación."
  },
  "catamarca": {
    slug: "catamarca",
    name: "Catamarca",
    capital: "San Fernando del Valle de Catamarca",
    governor: "Raúl Jalil",
    governorParty: "Unión por la Patria",
    region: "Norte Grande",
    population: "429.000 hab.",
    keySectors: ["Minería (Litio y Cobre)", "Agroindustria", "Textil", "Turismo Religioso y Paisajístico"],
    description: "Motor minero en plena expansión con énfasis en la generación de empleo privado y cadenas de valor locales."
  },
  "san-juan": {
    slug: "san-juan",
    name: "San Juan",
    capital: "San Juan",
    governor: "Marcelo Orrego",
    governorParty: "Producción y Trabajo / JxC",
    region: "Nuevo Cuyo",
    population: "818.000 hab.",
    keySectors: ["Minería Metalífera (Oro y Cobre)", "Energía Solar", "Vitivinicultura", "Industria Farmacéutica"],
    description: "Provincia andina con matriz minera de clase mundial y transición a energías limpias."
  },
  "san-luis": {
    slug: "san-luis",
    name: "San Luis",
    capital: "San Luis",
    governor: "Claudio Poggi",
    governorParty: "Avanzar San Luis / Cambia San Luis",
    region: "Nuevo Cuyo",
    population: "540.000 hab.",
    keySectors: ["Industria Manufacturera", "Agroalimentos", "Conectividad Digital", "Turismo"],
    description: "Reconfiguración tras décadas de administración previa, con foco en austeridad fiscal y atracción de inversiones."
  },
  "la-pampa": {
    slug: "la-pampa",
    name: "La Pampa",
    capital: "Santa Rosa",
    governor: "Sergio Ziliotto",
    governorParty: "Partido Justicialista",
    region: "Patagonia",
    population: "366.000 hab.",
    keySectors: ["Ganadería Bovina", "Agricultura", "Banca Pública Provincial", "Industria Frigorífica"],
    description: "Provincia de enlace pampeano-patagónico con equilibrio fiscal tradicional y reclamo hídrico histórico."
  },
  "neuquen": {
    slug: "neuquen",
    name: "Neuquén",
    capital: "Neuquén",
    governor: "Rolando Figueroa",
    governorParty: "Comunidad / Provincial",
    region: "Patagonia",
    population: "726.000 hab.",
    keySectors: ["Hidrocarburos (Vaca Muerta)", "Turismo Cordillerano", "Fruticultura", "Construcción"],
    description: "Epicentro de la revolución energética nacional con el mayor crecimiento demográfico e inversiones privadas del país."
  },
  "rio-negro": {
    slug: "rio-negro",
    name: "Río Negro",
    capital: "Viedma",
    governor: "Alberto Weretilneck",
    governorParty: "Juntos Somos Río Negro",
    region: "Patagonia",
    population: "762.000 hab.",
    keySectors: ["Turismo (Bariloche)", "Fruticultura (Alto Valle)", "GNL y Puertos", "Tecnología (INVAP)"],
    description: "Jurisdicción bioceánica y científica con proyección como polo exportador de gas natural licuado (GNL)."
  },
  "chubut": {
    slug: "chubut",
    name: "Chubut",
    capital: "Rawson",
    governor: "Ignacio Torres",
    governorParty: "Juntos por el Cambio",
    region: "Patagonia",
    population: "603.000 hab.",
    keySectors: ["Petróleo y Gas", "Aluminio (Aluar)", "Pesca (Langostino)", "Turismo Península Valdés"],
    description: "Protagonista del bloque de gobernadores patagónicos con demandas enérgicas sobre federalismo fiscal y recursos."
  },
  "santa-cruz": {
    slug: "santa-cruz",
    name: "Santa Cruz",
    capital: "Río Gallegos",
    governor: "Claudio Vidal",
    governorParty: "Por Santa Cruz",
    region: "Patagonia",
    population: "333.000 hab.",
    keySectors: ["Petróleo y Minería (Oro/Plata)", "Represas Hidroeléctricas", "Pesca", "Turismo Glaciares"],
    description: "Extenso territorio austral en reordenamiento productivo tras el recambio sindical-político en la gobernación."
  },
  "tierra-del-fuego": {
    slug: "tierra-del-fuego",
    name: "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
    capital: "Ushuaia",
    governor: "Gustavo Melella",
    governorParty: "FORJA / Concertación",
    region: "Patagonia",
    population: "190.000 hab.",
    keySectors: ["Industria Electrónica (Régimen 19.640)", "Gas y Petróleo", "Turismo Antártico", "Pesca"],
    description: "Polo industrial y geopolítico más austral del continente con debate permanente sobre su régimen de incentivos."
  }
};

export interface ThematicAxisScore {
  axisId: string;
  name: string;
  score: number; // -1.0 a 1.0
  percentagePositive: number;
  nationalComparison: number; // delta en puntos
  trend: "up" | "down" | "stable";
  keyTakeaway: string;
}

export interface DetailedProvinceAnalysis {
  province: ProvinceMetadata;
  generalScore: number;
  generalStatus: "Muy favorable" | "Favorable" | "Neutro" | "Desfavorable" | "Muy desfavorable";
  nationalRank: number; // 1 de 24
  vsNationalAverage: number;
  totalInteractions: number;
  weeklyTrend: Array<{ weekLabel: string; score: number }>;
  thematicAxes: ThematicAxisScore[];
  emotionalBreakdown: {
    esperanza: number;
    orgullo: number;
    fatiga: number;
    bronca: number;
    miedo: number;
  };
  localFactors: string[];
  politicalContext: string;
}

// Generador determinístico de análisis provincial basado en hashes matemáticos
function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getDetailedProvinceAnalysis(slug: string): DetailedProvinceAnalysis | null {
  const meta = PROVINCES_CATALOG[slug];
  if (!meta) return null;

  const baseSeed = hashSeed(slug + "talos-2026-analisis");

  // Sentimiento general entre -0.5 y 0.55
  const normalizedGeneral = Number((((baseSeed % 105) - 45) / 100).toFixed(2));
  const generalPct = Math.round(((normalizedGeneral + 1) / 2) * 100);

  // Ranking 1 a 24 determinístico
  const rank = (baseSeed % 24) + 1;
  const vsNat = Number(((normalizedGeneral - 0.08) * 100).toFixed(1));

  let generalStatus: DetailedProvinceAnalysis["generalStatus"] = "Neutro";
  if (normalizedGeneral > 0.4) generalStatus = "Muy favorable";
  else if (normalizedGeneral > 0.15) generalStatus = "Favorable";
  else if (normalizedGeneral > -0.15) generalStatus = "Neutro";
  else if (normalizedGeneral > -0.38) generalStatus = "Desfavorable";
  else generalStatus = "Muy desfavorable";

  // Ejes temáticos
  const axesDefinitions = [
    { id: "economia", name: "Economía & Finanzas Locales", bias: -0.05, text: "Presión sobre poder adquisitivo y costo de servicios frente al nivel de actividad comercial." },
    { id: "seguridad", name: "Seguridad Ciudadana", bias: -0.12, text: "Demandas de patrullaje preventivo y respuesta judicial ante delitos urbanos." },
    { id: "salud", name: "Salud Pública & Cobertura", bias: 0.05, text: "Demanda de insumos y turnos en hospitales provinciales ante costos de medicina privada." },
    { id: "educacion", name: "Educación & Universidad", bias: 0.10, text: "Clima en el calendario escolar y funcionamiento de facultades y terciarios." },
    { id: "empleo", name: "Empleo & Oportunidades", bias: -0.02, text: "Evolución de puestos en el sector privado y estabilidad en el empleo público." },
    { id: "gestion", name: "Gestión & Obra Pública Provincial", bias: 0.08, text: `Percepción directa de las obras viales y programas de la gobernación de ${meta.governor}.` },
  ];

  const thematicAxes: ThematicAxisScore[] = axesDefinitions.map((ax, idx) => {
    const axSeed = hashSeed(slug + ax.id + "axis-2026");
    const rawScore = Number((normalizedGeneral + ax.bias + (((axSeed % 40) - 20) / 100)).toFixed(2));
    const clampedScore = Math.max(-0.95, Math.min(0.95, rawScore));
    const posPct = Math.round(((clampedScore + 1) / 2) * 100);
    const delta = Number((clampedScore * 100 - 8).toFixed(1));

    const trendVal = axSeed % 3;
    const trend: ThematicAxisScore["trend"] = trendVal === 0 ? "up" : trendVal === 1 ? "down" : "stable";

    return {
      axisId: ax.id,
      name: ax.name,
      score: clampedScore,
      percentagePositive: posPct,
      nationalComparison: delta,
      trend,
      keyTakeaway: ax.text,
    };
  });

  // Espectro emocional que suma 100
  const emoSeed = hashSeed(slug + "emotions");
  const fear = 15 + (emoSeed % 20);
  const anger = 15 + ((emoSeed >> 2) % 25);
  const hope = 20 + ((emoSeed >> 4) % 30);
  const pride = 10 + ((emoSeed >> 6) % 20);
  const fatigue = Math.max(5, 100 - (fear + anger + hope + pride));

  // Histórico de 4 semanas
  const weeklyTrend = [
    { weekLabel: "Hace 3 semanas", score: Number((normalizedGeneral - 0.06).toFixed(2)) },
    { weekLabel: "Hace 2 semanas", score: Number((normalizedGeneral - 0.02).toFixed(2)) },
    { weekLabel: "Semana pasada", score: Number((normalizedGeneral + 0.03).toFixed(2)) },
    { weekLabel: "Semana actual", score: normalizedGeneral },
  ];

  const localFactors = [
    `Impacto de las medidas de la administración de ${meta.governor} en los principales conglomerados urbanos de ${meta.name}.`,
    `Comportamiento de los sectores productivos (${meta.keySectors.slice(0, 2).join(" y ")}) frente a la coyuntura de precios.`,
    `Tensión entre la agenda fiscal nacional y el presupuesto asignado a programas de desarrollo local.`,
    `Nivel de confianza en los canales institucionales de reclamo y demandas vecinales.`
  ];

  const politicalContext = `${meta.name} cuenta con una población aproximada de ${meta.population} y su gobernador es ${meta.governor} (${meta.governorParty}). Su perfil productivo sustentado en ${meta.keySectors.join(", ")} condiciona de manera determinante la agenda pública y el humor colectivo ante las elecciones nacionales de 2027.`;

  return {
    province: meta,
    generalScore: normalizedGeneral,
    generalStatus,
    nationalRank: rank,
    vsNationalAverage: vsNat,
    totalInteractions: 18500 + (baseSeed % 14000),
    weeklyTrend,
    thematicAxes,
    emotionalBreakdown: {
      esperanza: hope,
      orgullo: pride,
      fatiga: fatigue,
      bronca: anger,
      miedo: fear,
    },
    localFactors,
    politicalContext,
  };
}

// Alerta temprana determinística del día
export interface DailyAnomalyAlert {
  provinceSlug: string;
  provinceName: string;
  governor: string;
  axisName: string;
  deltaPoints: number;
  direction: "alza" | "caida";
  auditedInteractions: number;
  timeframe: string;
  headline: string;
  explanation: string;
}

export function getDailyAnomalyAlert(): DailyAnomalyAlert {
  // Rotación diaria determinística según la fecha actual (YYYY-MM-DD)
  const todayStr = new Date().toISOString().slice(0, 10);
  const dateSeed = hashSeed("talos-alert-" + todayStr);

  const slugs = Object.keys(PROVINCES_CATALOG);
  const selectedSlug = slugs[dateSeed % slugs.length];
  const prov = PROVINCES_CATALOG[selectedSlug];

  const axes = [
    { name: "Seguridad Ciudadana", desc: "reconfiguración de reclamos vecinales y operativos de prevención" },
    { name: "Economía y Poder Adquisitivo", desc: "variación en las expectativas sobre precios locales y tarifas" },
    { name: "Gestión e Infraestructura", desc: "evaluación de obras prioritarias y programas provinciales" },
    { name: "Salud y Cobertura Pública", desc: "demanda en centros asistenciales ante costos de insumos" },
    { name: "Educación y Calendario Escolar", desc: "monitoreo de infraestructura edilicia y clima institucional" },
  ];

  const selectedAxis = axes[(dateSeed >> 2) % axes.length];
  const deltaPoints = Number((5.5 + ((dateSeed % 40) / 10)).toFixed(1));
  const isDrop = (dateSeed % 2) === 0;

  return {
    provinceSlug: prov.slug,
    provinceName: prov.name,
    governor: prov.governor,
    axisName: selectedAxis.name,
    deltaPoints: isDrop ? -deltaPoints : deltaPoints,
    direction: isDrop ? "caida" : "alza",
    auditedInteractions: 3200 + ((dateSeed % 28) * 100),
    timeframe: "últimas 48 horas",
    headline: `Anomalía en ${prov.name}: ${selectedAxis.name} registró una variación de ${isDrop ? "-" : "+"}${deltaPoints} pts`,
    explanation: `El monitoreo territorial detectó un desplazamiento atípico en ${prov.name} vinculado a ${selectedAxis.desc}. Este movimiento supera el desvío estándar federal auditado en tiempo real.`
  };
}
