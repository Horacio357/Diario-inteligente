import { jsPDF } from "jspdf";

export interface ReportPdfData {
  topic: string;
  topicLabel: string;
  mediaSentiment: number; // -1 to 1
  citizenSentiment: number; // -1 to 1
  divergence: number; // Divergencia en puntos porcentuales
  divergenceLabel: string;
  totalCitizenVotes: number;
  positivePct?: number;
  neutralPct?: number;
  negativePct?: number;
  recentReasons?: { reason: string; sentiment: number }[];
  sources?: string[];
  timestamp?: string;
}

const DEFAULT_SOURCES = [
  "Clarín (Política, Economía, Lo Último)",
  "La Nación (Portada Nacional, Información General)",
  "Ámbito Financiero (Portada, Economía, Política, Nacional)",
  "Perfil (Portada, Política, Opinión)",
  "La Gaceta Tucumán & Olé (Regionales y Deportes)",
  "NewsData.io Intelligence API (Cables de prensa nacional)",
  "Comunidad Talos Diario (Votación ciudadana directa verificada)"
];

/**
 * Genera un informe ejecutivo vectorial de alta calidad en PDF
 * con estética de consultoría periodística / data journalism.
 */
export function generateMethodologyPdf(data: ReportPdfData): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
  const margin = 18;
  const contentWidth = pageWidth - margin * 2; // 174 mm

  // Paleta de colores editorial
  const cNavy = [15, 23, 42]; // #0f172a
  const cSlate = [51, 65, 85]; // #334155
  const cLightSlate = [100, 116, 139]; // #64748b
  const cBorder = [226, 232, 240]; // #e2e8f0
  const cBgCard = [248, 250, 252]; // #f8fafc
  const cCyan = [2, 132, 199]; // #0284c7
  const cGreen = [5, 150, 105]; // #059669
  const cRed = [220, 38, 38]; // #dc2626
  const cAmber = [217, 119, 6]; // #d97706

  let y = 18;

  // ─── 1. BARRAS DECORATIVAS SUPERIORES ───
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 3, "F");
  doc.setFillColor(2, 132, 199);
  doc.rect(margin, y, 45, 3, "F");
  y += 9;

  // ─── 2. ENCABEZADO PERIODÍSTICO / INSTITUCIONAL ───
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(cCyan[0], cCyan[1], cCyan[2]);
  doc.text("TALOS DIARIO · DATA & INTELLIGENCE LAB", margin, y);

  const reportCode = `INF-TALOS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(cLightSlate[0], cLightSlate[1], cLightSlate[2]);
  doc.text(reportCode, pageWidth - margin, y, { align: "right" });
  y += 6;

  // Título principal
  doc.setFont("times", "bold");
  doc.setFontSize(19);
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text("Informe de Percepción Pública y Cobertura Mediática", margin, y);
  y += 6;

  // Subtítulo
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text("Auditoría de Divergencia Algorítmica, Pulso Comunitario y Citación de Fuentes", margin, y);
  y += 7;

  // Barra de metadatos (Ficha de emisión)
  doc.setFillColor(cBgCard[0], cBgCard[1], cBgCard[2]);
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.rect(margin, y, contentWidth, 9, "FD");

  const issueDate = new Date().toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text(`TEMA EVALUADO:`, margin + 4, y + 5.8);
  doc.setFont("helvetica", "normal");
  doc.text(`${data.topicLabel.toUpperCase()}`, margin + 33, y + 5.8);

  doc.setFont("helvetica", "bold");
  doc.text(`FECHA DE CORTE:`, margin + 70, y + 5.8);
  doc.setFont("helvetica", "normal");
  doc.text(issueDate, margin + 98, y + 5.8);

  doc.setFont("helvetica", "bold");
  doc.text(`ALCANCE:`, margin + 133, y + 5.8);
  doc.setFont("helvetica", "normal");
  doc.text(`Territorio Argentino`, margin + 149, y + 5.8);

  y += 14;

  // ─── 3. RESUMEN EJECUTIVO: LA BRECHA DE PERCEPCIÓN ───
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text("1. Resumen Ejecutivo y Choque de Datos", margin, y);
  y += 5;

  // 3 Cajas comparativas (Medios vs Lectores vs Brecha)
  const cardWidth = (contentWidth - 8) / 3;
  const cardHeight = 24;

  const mediaPct = Math.round(((data.mediaSentiment + 1) / 2) * 100);
  const citizenPct = Math.round(((data.citizenSentiment + 1) / 2) * 100);

  // Tarjeta 1: Medios
  doc.setFillColor(cBgCard[0], cBgCard[1], cBgCard[2]);
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.rect(margin, y, cardWidth, cardHeight, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(cLightSlate[0], cLightSlate[1], cLightSlate[2]);
  doc.text("AGENDA MEDIÁTICA", margin + 4, y + 5.5);
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text(`${mediaPct}%`, margin + 4, y + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text("Tono ponderado en portales", margin + 4, y + 19.5);

  // Tarjeta 2: Lectores
  const card2X = margin + cardWidth + 4;
  doc.setFillColor(cBgCard[0], cBgCard[1], cBgCard[2]);
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.rect(card2X, y, cardWidth, cardHeight, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(cCyan[0], cCyan[1], cCyan[2]);
  doc.text("VOZ DE LA COMUNIDAD", card2X + 4, y + 5.5);
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.setTextColor(cCyan[0], cCyan[1], cCyan[2]);
  doc.text(`${citizenPct}%`, card2X + 4, y + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text(`${data.totalCitizenVotes} votos auditados`, card2X + 4, y + 19.5);

  // Tarjeta 3: Brecha / Divergencia
  const card3X = card2X + cardWidth + 4;
  const isCritical = Math.abs(data.divergence) > 12;
  const divColor = isCritical ? cAmber : cGreen;

  doc.setFillColor(cBgCard[0], cBgCard[1], cBgCard[2]);
  doc.setDrawColor(divColor[0], divColor[1], divColor[2]);
  doc.rect(card3X, y, cardWidth, cardHeight, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(divColor[0], divColor[1], divColor[2]);
  doc.text("BRECHA DE PERCEPCIÓN", card3X + 4, y + 5.5);
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.text(`${data.divergence > 0 ? "+" : ""}${data.divergence}%`, card3X + 4, y + 14);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.text(isCritical ? "Divergencia marcada" : "En sintonía", card3X + 4, y + 19.5);

  y += cardHeight + 5;

  // Frase diagnóstica
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, "F");
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
  doc.text(`Diagnóstico: ${data.divergenceLabel}.`, margin + 4, y + 4.8);
  y += 12;

  // ─── 4. DESGLOSE DEL TERMÓMETRO CIUDADANO (Si hay datos de votos) ───
  if (data.positivePct !== undefined && data.neutralPct !== undefined && data.negativePct !== undefined) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
    doc.text("Distribución de Posturas de los Lectores", margin, y);
    y += 4;

    const totalBarWidth = contentWidth;
    const barHeight = 4.5;
    const wPos = Math.max(2, (totalBarWidth * (data.positivePct || 0)) / 100);
    const wNeu = Math.max(2, (totalBarWidth * (data.neutralPct || 0)) / 100);
    const wNeg = Math.max(2, (totalBarWidth * (data.negativePct || 0)) / 100);

    // Barra positiva
    doc.setFillColor(cGreen[0], cGreen[1], cGreen[2]);
    doc.rect(margin, y, wPos, barHeight, "F");
    // Barra neutra
    doc.setFillColor(cAmber[0], cAmber[1], cAmber[2]);
    doc.rect(margin + wPos, y, wNeu, barHeight, "F");
    // Barra crítica
    doc.setFillColor(cRed[0], cRed[1], cRed[2]);
    doc.rect(margin + wPos + wNeu, y, wNeg, barHeight, "F");
    y += barHeight + 3.5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(cGreen[0], cGreen[1], cGreen[2]);
    doc.text(`• Favorable: ${data.positivePct}%`, margin, y);
    doc.setTextColor(cAmber[0], cAmber[1], cAmber[2]);
    doc.text(`• Neutro: ${data.neutralPct}%`, margin + 55, y);
    doc.setTextColor(cRed[0], cRed[1], cRed[2]);
    doc.text(`• Crítico: ${data.negativePct}%`, margin + 110, y);
    y += 8;
  }

  // ─── 5. RESEÑA METODOLÓGICA: CÓMO SE ADQUIEREN Y CRUZAN LOS DATOS ───
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text("2. Metodología de Adquisición y Procesamiento", margin, y);
  y += 5;

  const methodologyPoints = [
    {
      title: "Fase 1: Ingesta y Análisis de la Agenda Mediática (NLP)",
      desc: "El sistema monitorea en tiempo real los principales portales de noticias del país mediante canales RSS estructurados y APIs periodísticas. Los artículos son clasificados por área temática y evaluados a través de modelos de procesamiento de lenguaje natural (NLP) con diccionarios de polaridad tonal específicos para el discurso económico y sociopolítico argentino."
    },
    {
      title: "Fase 2: Votación Ciudadana Directa y Verificada",
      desc: "Los lectores participan emitiendo su postura semanal georreferenciada sobre el mismo eje temático. Para garantizar la solidez estadística y prevenir maniobras de astroturfing o votación múltiple coordinada, el sistema aplica un estricto límite de 1 voto por semana por usuario/IP mediante token criptográfico no invasivo, permitiendo además el registro voluntario de micro-argumentos."
    },
    {
      title: "Fase 3: El Choque de Datos y Calibración Federal",
      desc: "El índice mide la divergencia vectorial entre la narrativa editorial periodística y el pulso real de la opinión pública. La calibración territorial del Mapa Federal pondera un 65% de cobertura mediática y un 35% de votación ciudadana directa, reflejando tanto la agenda publicada como el descontento o consenso social emergente."
    }
  ];

  methodologyPoints.forEach((point) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
    doc.text(point.title, margin, y);
    y += 3.8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.2);
    doc.setTextColor(cLightSlate[0], cLightSlate[1], cLightSlate[2]);
    const splitDesc = doc.splitTextToSize(point.desc, contentWidth);
    doc.text(splitDesc, margin, y);
    y += splitDesc.length * 3.4 + 3;
  });

  y += 2;

  // ─── 6. CITACIÓN EXHAUSTIVA DE FUENTES ───
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
  doc.text("3. Citación Exhaustiva de Fuentes Consultadas", margin, y);
  y += 5;

  doc.setFillColor(cBgCard[0], cBgCard[1], cBgCard[2]);
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);

  const sourcesList = data.sources && data.sources.length > 0 ? data.sources : DEFAULT_SOURCES;
  const sourceBoxHeight = sourcesList.length * 4.2 + 8;
  doc.rect(margin, y, contentWidth, sourceBoxHeight, "FD");

  let srcY = y + 5;
  sourcesList.forEach((src) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(cCyan[0], cCyan[1], cCyan[2]);
    doc.text("[FUENTE]", margin + 4, srcY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
    doc.text(src, margin + 22, srcY);
    srcY += 4.2;
  });

  y += sourceBoxHeight + 6;

  // ─── 7. MUESTRA CUALITATIVA DE LECTORES (Si hay motivos) ───
  if (data.recentReasons && data.recentReasons.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(cNavy[0], cNavy[1], cNavy[2]);
    doc.text("4. Muestra Cualitativa de Voces Ciudadanas (Testimonios Anónimos)", margin, y);
    y += 4.5;

    const topReasons = data.recentReasons.slice(0, 3);
    topReasons.forEach((r) => {
      const isPos = r.sentiment === 1;
      const isNeg = r.sentiment === -1;
      const badgeColor = isPos ? cGreen : isNeg ? cRed : cAmber;

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
      doc.rect(margin, y, contentWidth, 7, "FD");

      doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
      doc.rect(margin, y, 2.5, 7, "F");

      doc.setFont("helvetica", "italic");
      doc.setFontSize(7);
      doc.setTextColor(cSlate[0], cSlate[1], cSlate[2]);
      const reasonSnippet = r.reason.length > 95 ? `${r.reason.slice(0, 95)}...` : r.reason;
      doc.text(`"${reasonSnippet}"`, margin + 6, y + 4.6);

      y += 8.5;
    });

    y += 2;
  }

  // ─── 8. PIE DE PÁGINA INSTITUCIONAL / SELLO DE AUDITORÍA ───
  const footerY = pageHeight - 16;
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(cLightSlate[0], cLightSlate[1], cLightSlate[2]);
  doc.text("TALOS DATA LAB · PERIODISMO AUMENTADO Y ANALÍTICA DE OPINIÓN PÚBLICA", margin, footerY + 4);

  doc.setFont("helvetica", "normal");
  doc.text("talosdiario.ar · Documento de transparencia algorítmica y citación de fuentes.", margin, footerY + 7.5);

  doc.setFont("helvetica", "bold");
  doc.text("Página 1 de 1", pageWidth - margin, footerY + 4, { align: "right" });

  return doc;
}

/**
 * Dispara la descarga del PDF en el navegador del usuario
 */
export function downloadMethodologyPdf(data: ReportPdfData, fileNamePrefix = "Informe_Metodologia_Talos"): void {
  const doc = generateMethodologyPdf(data);
  const cleanTopic = data.topicLabel.toLowerCase().replace(/[^a-z0-9]/g, "_");
  const fileName = `${fileNamePrefix}_${cleanTopic}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}
