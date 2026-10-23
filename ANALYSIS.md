# Análisis Social (Ojo Social) - Documentación Técnica y Funcional

Este documento proporciona un análisis exhaustivo de la arquitectura, tecnologías y capacidades de la aplicación. Es ideal para ser utilizado como documentación técnica detallada en el repositorio (por ejemplo, en el `README.md` o en una wiki).

## 1. Visión General del Proyecto

**Ojo Social** (identificado internamente como tal) es una aplicación web avanzada construida con **Next.js** que actúa como un "analista de inteligencia pública". Su objetivo es diagnosticar la percepción social, el sentimiento y la imagen pública de figuras políticas, del entretenimiento, deportistas o temas nacionales de relevancia en Argentina.

La aplicación recopila datos en tiempo real de múltiples fuentes (noticias, feeds RSS, YouTube, Wikipedia) y utiliza Inteligencia Artificial Generativa (LLMs) para crear perfiles psicológicos, mapas de alianzas, y métricas de polarización basadas en arquetipos de Jung.

## 2. Stack Tecnológico

El proyecto utiliza un stack moderno, rápido y altamente optimizado:

- **Framework Core**: Next.js 16.2 (con App Router) y React 19.
- **Estilos**: Tailwind CSS 4 y componentes UI modernos.
- **Base de Datos y Autenticación**: Supabase (Backend as a Service) y Prisma ORM para el modelado de datos.
- **Visualización de Datos**: 
  - `recharts` para gráficos complejos (gráficos de radar para métricas de personalidad).
  - `react-simple-maps`, `d3-geo` y `topojson-client` para la visualización geoespacial (mapas de sentimiento por provincia en Argentina).
- **Exportación de Reportes**: `jspdf` y `html-to-image` para exportar los análisis en formato PDF o imágenes.
- **Lenguaje**: TypeScript estricto.

## 3. APIs e Integraciones Externas

El núcleo analítico de la app depende de una orquestación paralela de múltiples APIs para la recolección de datos, seguida de un procesamiento de lenguaje natural avanzado.

### APIs de Recolección de Datos (Data Ingestion)
1. **NewsData.io API**: Se utiliza para buscar las noticias más recientes (últimas horas o días) sobre la figura o tema, filtradas por medios argentinos (`country: "ar"`).
2. **YouTube Data API v3**: Busca los videos de política o noticias más relevantes de los últimos 7 días y extrae los comentarios con más "likes" para capturar el sentimiento orgánico y sin filtros de la audiencia.
3. **Wikipedia API**: Extrae un resumen biográfico o enciclopédico de la figura buscada para darle un contexto sólido a la IA.
4. **RSS Feeds Locales**: Un parser (`rss-parser`) configurado a medida para leer feeds de medios y portales argentinos y combinarlos con las noticias de NewsData.

### APIs de Inteligencia Artificial (Procesamiento y Análisis)
El sistema destaca por utilizar una **estrategia de fallback (tolerancia a fallos) en cascada** para los LLMs, garantizando que el análisis siempre se genere:
1. **Google Gemini API** (Motor Principal): Utiliza `gemini-flash-latest` (o similares) para generar el análisis completo a partir de un prompt altamente estructurado.
2. **xAI API (Grok)** (Fallback 1): Si Gemini falla, la aplicación intenta usar `grok-2`, ideal por su naturaleza de análisis "sin filtros".
3. **Groq API (Llama 3.3)** (Fallback 2): Si los anteriores fallan, recurre al modelo Llama 3.3 de Meta a través de la infraestructura ultrarrápida de Groq.
4. **Análisis Heurístico** (Fallback 3 - Local): Si no hay APIs de IA configuradas o disponibles, el sistema usa un algoritmo local (`heuristicSentiment`) basado en un diccionario ponderado de palabras positivas/negativas y frecuencias de aparición para generar métricas.

## 4. Tipos de Análisis que Otorga

La Inteligencia Artificial recibe un prompt estricto que le exige actuar como un "consultor de inteligencia pública con brutal honestidad", devolviendo un JSON con un análisis multidimensional:

### A. Categorización por Arquetipos (Basado en Jung)
Clasifica a la figura analizada en uno de 5 arquetipos que explican su rol en la narrativa colectiva:
- ⚡ **Héroe**: Figura que inspira y unifica (ej. Lionel Messi).
- 🔥 **Villano**: Catalizador de conflicto y proyección del rechazo colectivo; alta polarización.
- 🔮 **Sabio**: Referente moral y de conocimiento, genera alta confianza.
- 🎭 **Tramposo (Trickster)**: Disruptor del statu quo. Impredecible y altamente movilizador (ej. políticos disruptivos).
- 🛡️ **Guardián**: Figura de estabilidad y protección institucional.

### B. Métricas Principales (Escala 0-100)
- **Aprobación**: Nivel general de percepción positiva.
- **Polarización**: Cuánto divide a la sociedad (amor extremo vs. odio extremo).
- **Movilización**: Capacidad de generar acción real en su audiencia (asistir, votar, comentar).
- **Coherencia**: Alineación percibida entre su relato oficial y la realidad que vive la gente.
- **Resonancia**: Qué tan presente y viral es la figura en la agenda mediática y social.
- **Confianza**: Nivel de credibilidad a largo plazo.

### C. Análisis Emocional y Geográfico
- **Perfil Emocional**: Mide los niveles que genera la figura en 5 ejes: Miedo, Enojo, Esperanza, Orgullo y Fatiga social.
- **Mapa Provincial**: Calcula y distribuye el sentimiento (de -1.0 a 1.0) y la intensidad del debate a lo largo de las 24 jurisdicciones de Argentina.

### D. Métricas Avanzadas y Mapa de Poder
- **Contagio Narrativo**: Índice de qué tan rápido se viraliza su mensaje.
- **Disonancia Cognitiva**: La brecha entre lo que dicen los medios o el relato oficial versus lo que percibe el ciudadano de a pie.
- **Red de Aliados y Enemigos**: Genera un mapa de actores clave. Para los aliados mide la "fuerza de alianza", y para los enemigos el "nivel de conflicto", explicando el motivo exacto.
- **Timeline de Percepción**: Evolución simulada de su imagen en los últimos 5 meses.

### E. Recomendaciones Estratégicas
El motor distingue si la persona analizada es de Política, Deportes, Espectáculo/Influencer o si es un Tema Nacional (ej. Inflación, Seguridad). Basado en ello, otorga **3 recomendaciones estratégicas accionables**. Por ejemplo: si es un político con alta polarización, recomienda rutas para llegar al electorado de centro; si es un influencer, recomienda estrategias comerciales.

## 5. Arquitectura del Flujo de Datos

1. **Input**: El usuario busca un nombre o un tema de actualidad.
2. **Caché**: Se revisa el almacenamiento local (`localStorage`) para devolver respuestas instantáneas si la figura fue analizada recientemente.
3. **Data Fetching Paralelo**: Se consultan NewsData, RSS, Wikipedia y YouTube al mismo tiempo para obtener el corpus de datos.
4. **Agrupación y Limpieza**: Se filtran noticias duplicadas mediante algoritmos de similitud de títulos y URLs.
5. **Generación de Prompt**: Se consolida el perfil de Wikipedia, las 8-10 noticias top y los mejores comentarios de YouTube en un único prompt contextual.
6. **Inferencia de LLM**: La IA procesa el corpus y retorna un JSON estrictamente tipado y evaluado.
7. **Renderizado UI**: El frontend (App Router de Next.js) hidrata el dashboard interactivo mostrando radares, mapas de calor, y tarjetas de información.
