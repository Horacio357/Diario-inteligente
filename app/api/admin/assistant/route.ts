import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const XAI_API_KEY = process.env.XAI_API_KEY || process.env.GROK_API_KEY;

function checkAuth(req: NextRequest) {
  const token = req.headers.get("x-admin-token") ?? req.nextUrl.searchParams.get("token");
  const pass = process.env.ADMIN_PASS ?? "talos2025";
  return token === pass;
}

async function callLLM(prompt: string): Promise<string> {
  if (GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
      const res = await model.generateContent(prompt);
      return res.response.text().trim();
    } catch (e) {
      console.error("Gemini assistant error:", e);
    }
  }

  if (XAI_API_KEY) {
    try {
      const grokRes = await fetch("https://api.xai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${XAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "grok-2",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        }),
      });
      if (grokRes.ok) {
        const data = await grokRes.json();
        return data.choices[0].message.content.trim();
      }
    } catch (e) {
      console.error("Grok assistant error:", e);
    }
  }

  if (GROQ_API_KEY) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        }),
      });
      if (groqRes.ok) {
        const data = await groqRes.json();
        return data.choices[0].message.content.trim();
      }
    } catch (e) {
      console.error("Groq assistant error:", e);
    }
  }

  throw new Error("No hay proveedor de IA disponible");
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { action, text, title, category } = await req.json();

    if (!text && !title) {
      return NextResponse.json({ error: "Se requiere texto o título" }, { status: 400 });
    }

    if (action === "suggest_titles") {
      const prompt = `Sos el editor jefe de un diario argentino de alta tecnología y análisis sociopolítico ("Talos Diario"). 
A partir del siguiente texto/idea, generá exactamente 3 títulos periodísticos atractivos, directos y con alto impacto (CTR):
Texto: "${(text || title).slice(0, 1500)}"

Respondé ÚNICAMENTE con un JSON en este formato:
{
  "titles": ["Título 1", "Título 2", "Título 3"]
}`;
      const raw = await callLLM(prompt);
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        return NextResponse.json({ titles: parsed.titles });
      }
      return NextResponse.json({ titles: [raw] });
    }

    if (action === "generate_summary") {
      const prompt = `Sos un redactor periodístico experto. Escribí un copete/resumen de máximo 200 caracteres para esta noticia. Debe ser informativo, atrapante y conciso.
Título: "${title || ""}"
Contenido: "${text.slice(0, 2000)}"

Respondé ÚNICAMENTE con el texto del resumen (sin comillas, sin introducciones).`;
      const summary = await callLLM(prompt);
      return NextResponse.json({ summary: summary.replace(/^["']|["']$/g, "").trim().slice(0, 220) });
    }

    if (action === "extract_entities") {
      const prompt = `Analizá el siguiente texto de un artículo periodístico. Identificá los nombres de figuras públicas (políticos, deportistas, figuras destacadas) y los temas/conceptos clave.
Reformateá el texto original envolviendo:
- Cada nombre de persona relevante así: [PERSON:Nombre Completo]
- Cada tema/concepto clave así: [TOPIC:Nombre del Tema]

Conservá el resto del contenido exactamente igual.

Texto:
${text}

Respondé ÚNICAMENTE con el texto reformateado (sin explicaciones adicionales ni bloques markdown fuera del texto).`;
      let formattedText = await callLLM(prompt);
      formattedText = formattedText.replace(/^```(markdown|text)?\n?/, "").replace(/\n?```$/, "").trim();
      return NextResponse.json({ formattedText });
    }

    if (action === "analyze_sentiment") {
      const prompt = `Analizá el sentimiento y arquetipo narrativo de esta noticia periodística.
Título: "${title || ""}"
Contenido: "${text.slice(0, 1500)}"

Devolvé ÚNICAMENTE un JSON válido:
{
  "sentiment": <número flotante entre -1.0 y 1.0>,
  "archetype": "<uno de: Héroe | Villano | Sabio | Trickster | Guardián>",
  "explanation": "<explicación breve de 1 oración>"
}`;
      const raw = await callLLM(prompt);
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        return NextResponse.json(parsed);
      }
      return NextResponse.json({ sentiment: 0.0, archetype: "Sabio", explanation: "Análisis básico" });
    }

    return NextResponse.json({ error: "Acción no soportada" }, { status: 400 });
  } catch (error: any) {
    console.error("Error en asistente de IA:", error);
    return NextResponse.json({ error: error.message || "Error al procesar la solicitud de IA" }, { status: 500 });
  }
}
