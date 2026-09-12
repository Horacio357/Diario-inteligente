export interface CategoryArticleFallback {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment: number;
  description: string;
  imageUrl: string;
}

export const CATEGORY_FALLBACKS: Record<string, CategoryArticleFallback[]> = {
  deportes: [
    {
      id: "dep-1",
      title: "La Selección Argentina define el equipo titular para el próximo compromiso de Eliminatorias",
      source: "Olé / Clarín Deportes",
      url: "https://www.clarin.com/deportes/",
      publishedAt: new Date().toISOString(),
      sentiment: 0.6,
      description: "Lionel Scaloni analiza variantes tácticas en el mediocampo con el regreso de titulares clave en la formación.",
      imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "dep-2",
      title: "Superclásico a la vista: Boca y River ultiman detalles tácticos antes del cruce decisivo",
      source: "Infobae Deportes",
      url: "https://www.infobae.com/deportes/",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      sentiment: 0.4,
      description: "Ambos entrenadores prueban esquemas ofensivos en las prácticas a puertas cerradas de la semana.",
      imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "dep-3",
      title: "Franco Colapinto y un nuevo desafío en la Fórmula 1: Análisis de telemetría y ritmo de carrera",
      source: "La Nación Deportes",
      url: "https://www.lanacion.com.ar/deportes/",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      sentiment: 0.8,
      description: "El piloto argentino trabaja junto a los ingenieros de boxes de cara a las sesiones de clasificación oficial.",
      imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "dep-4",
      title: "Los Pumas confirman el XV titular para el cierre de la ventana internacional de Rugby",
      source: "Perfil Deportes",
      url: "https://www.perfil.com/deportes",
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      sentiment: 0.5,
      description: "El seleccionado argentino busca consolidar su sistema defensivo ante una de las potencias del hemisferio sur.",
      imageUrl: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "dep-5",
      title: "Tenis: Francisco Cerúndolo avanza a cuartos de final tras un épico triunfo en tres sets",
      source: "TyC Sports",
      url: "https://www.tycsports.com/",
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      sentiment: 0.7,
      description: "La primera raqueta nacional mostró solvencia con el drive y se metió entre los ocho mejores del torneo ATP.",
      imageUrl: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "dep-6",
      title: "Liga Profesional: Análisis de posiciones, promedios y clasificación a copas internacionales",
      source: "Clarín Deportes",
      url: "https://www.clarin.com/deportes/",
      publishedAt: new Date(Date.now() - 18000000).toISOString(),
      sentiment: 0.2,
      description: "La tabla de posiciones se comprime a falta de cuatro fechas con tres equipos peleando el liderazgo.",
      imageUrl: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "dep-7",
      title: "Básquet: La Selección Argentina inicia su concentración para el torneo clasificatorio",
      source: "La Nación Deportes",
      url: "https://www.lanacion.com.ar/deportes/",
      publishedAt: new Date(Date.now() - 21600000).toISOString(),
      sentiment: 0.5,
      description: "El combinado nacional convoca a referentes jóvenes que juegan en ligas europeas y de la Liga Nacional.",
      imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80"
    }
  ],
  politica: [
    {
      id: "pol-1",
      title: "El Gobierno y el Congreso negocian los dictámenes del proyecto presupuestario",
      source: "La Nación Política",
      url: "https://www.lanacion.com.ar/politica/",
      publishedAt: new Date().toISOString(),
      sentiment: -0.1,
      description: "Reuniones de comisión decisivas entre funcionarios del Poder Ejecutivo y legisladores de bloques aliados.",
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "pol-2",
      title: "Debate legislativo: Diputados trata la reforma de los marcos normativos electorales",
      source: "Clarín Política",
      url: "https://www.clarin.com/politica/",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      sentiment: 0.1,
      description: "Las comisiones analizan la implementación de la boleta única y el financiamiento de partidos políticos.",
      imageUrl: "https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "pol-3",
      title: "Reunión de gobernadores: Las provincias exigen certezas sobre los giros de fondos coparticipables",
      source: "Infobae Política",
      url: "https://www.infobae.com/politica/",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      sentiment: -0.3,
      description: "Mandatarios del centro y norte del país conformaron una mesa de trabajo conjunto para presentar una postura unificada.",
      imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "pol-4",
      title: "Agenda de Cancillería: Encuentros bilaterales para consolidar acuerdos comerciales estratégicos",
      source: "Perfil Política",
      url: "https://www.perfil.com/politica",
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      sentiment: 0.5,
      description: "Funcionarios del Ministerio de Relaciones Exteriores mantuvieron audiencias con delegaciones internacionales.",
      imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "pol-5",
      title: "El Poder Judicial acelera las audiencias en causas de auditoría de fondos públicos",
      source: "Página/12 Política",
      url: "https://www.pagina12.com.ar/",
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      sentiment: -0.4,
      description: "Los tribunales federales fijaron fechas para las declaraciones testimoniales y pericias técnicas.",
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80"
    }
  ],
  tecnologia: [
    {
      id: "tec-1",
      title: "La integración de Inteligencia Artificial Generativa acelera el desarrollo en startups argentinas",
      source: "Infobae Tecno",
      url: "https://www.infobae.com/tecno/",
      publishedAt: new Date().toISOString(),
      sentiment: 0.7,
      description: "Modelos avanzados de procesamiento de lenguaje permiten automatizar flujos operativos en empresas locales.",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "tec-2",
      title: "Ciberseguridad: Alerta por campañas de phishing dirigidas a plataformas financieras y homebanking",
      source: "Clarín Tecnología",
      url: "https://www.clarin.com/tecnologia/",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      sentiment: -0.5,
      description: "Especialistas recomiendan activar autenticación de dos factores y verificar dominios oficiales de ingreso.",
      imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "tec-3",
      title: "El despliegue de redes 5G avanza en los principales centros urbanos del interior del país",
      source: "La Nación Tecnología",
      url: "https://www.lanacion.com.ar/tecnologia/",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      sentiment: 0.6,
      description: "Operadores de telecomunicaciones instalan nuevas antenas para triplicar la velocidad de transferencia móvil.",
      imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "tec-4",
      title: "Lanzamientos del año: Comparativa de smartphones, procesadores y autonomía de batería",
      source: "CanalAR / Tecno",
      url: "https://www.infobae.com/tecno/",
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      sentiment: 0.4,
      description: "Analizamos el rendimiento de los chips de última generación fabricados en procesos de 3 nanómetros.",
      imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"
    }
  ],
  ciencia: [
    {
      id: "cie-1",
      title: "Investigadores del CONICET logran un avance prometedor en terapias dirigidas contra el cáncer",
      source: "La Nación Ciencia",
      url: "https://www.lanacion.com.ar/ciencia/",
      publishedAt: new Date().toISOString(),
      sentiment: 0.8,
      description: "El hallazgo fue publicado en una prestigiosa revista internacional tras 5 años de ensayos en laboratorios nacionales.",
      imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "cie-2",
      title: "Misión espacial y astronomía: El Observatorio de San Juan detecta una nueva estrella exoplanetaria",
      source: "Clarín Ciencia",
      url: "https://www.clarin.com/buena-vida/",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      sentiment: 0.7,
      description: "Telescopios de alta precisión captaron la curva de luz generada por el tránsito del cuerpo celeste.",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "cie-3",
      title: "Salud Pública: Lanzan la campaña de vacunación preventiva previa al inicio de la temporada invernal",
      source: "Infobae Salud",
      url: "https://www.infobae.com/salud/",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      sentiment: 0.5,
      description: "Las dosis estarán disponibles gratuitamente en todos los hospitales y centros de atención primaria del país.",
      imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80"
    }
  ],
  locales: [
    {
      id: "loc-1",
      title: "Obras públicas y conectividad: Finalizan los trabajos de pavimentación en rutas provinciales clave",
      source: "La Nación Sociedad",
      url: "https://www.lanacion.com.ar/sociedad/",
      publishedAt: new Date().toISOString(),
      sentiment: 0.6,
      description: "La habilitación del tramo mejorará la logística de transporte de granos e insumos entre municipios del interior.",
      imageUrl: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "loc-2",
      title: "Córdoba y Rosario impulsan programas de incentivos para comercios y pymes de barrio",
      source: "Clarín Ciudades",
      url: "https://www.clarin.com/sociedad/",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      sentiment: 0.5,
      description: "Los gobiernos locales presentaron líneas de crédito a tasa subsidiada para la modernización tecnológica comercial.",
      imageUrl: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "loc-3",
      title: "Patagonia: Se intensifican los operativos de prevención ante las bajas temperaturas extremas",
      source: "Infobae Sociedad",
      url: "https://www.infobae.com/sociedad/",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      sentiment: 0.1,
      description: "Defensa Civil desplegó camiones de asistencia alimentaria y abrigo en pasos cordilleranos y parajes aislados.",
      imageUrl: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&auto=format&fit=crop&q=80"
    }
  ]
};
