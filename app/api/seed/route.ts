import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Seed usuarios por defecto si no existen
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      await prisma.user.createMany({
        data: [
          {
            name: "Director Talos",
            email: "admin@talos.com",
            passToken: "talos2025",
            role: "ADMIN",
            bio: "Director General y Administrador del sistema.",
          },
          {
            name: "Editor Jefe",
            email: "editor@talos.com",
            passToken: "editor2025",
            role: "EDITOR",
            bio: "Jefe de Redacción y Cierre Diario.",
          },
          {
            name: "Colaborador Invitado",
            email: "colaborador@talos.com",
            passToken: "redactor2025",
            role: "REDACTOR",
            bio: "Periodista colaborador y columnista de opinión.",
          },
        ],
      });
    }

    // 2. Seed espacios del diario por defecto si no existen
    const spacesCount = await prisma.newspaperSpace.count();
    if (spacesCount === 0) {
      await prisma.newspaperSpace.createMany({
        data: [
          {
            spaceKey: "radio_player",
            name: "Radio Talos & Podcast en Vivo",
            description: "Módulo reproductor de streaming en vivo en la versión escritorio/móvil.",
            active: true,
            contentJson: JSON.stringify({
              title: "Radio Talos 104.5 FM",
              streamUrl: "https://stream.zeno.fm/f3wvbbqmdg8uv",
              nowPlaying: "Entrevista exclusiva: Debate económico nacional",
            }),
          },
          {
            spaceKey: "guest_column",
            name: "Columna de Opinión e Invitado Especial",
            description: "Espacio reservado para notas de periodistas de otros medios o colaboradores externos.",
            active: true,
            contentJson: JSON.stringify({
              author: "Dr. Carlos Pellegrini",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
              title: "La inteligencia artificial y el nuevo periodismo de datos",
              summary: "Reflexiones sobre cómo la tecnología transforma el análisis del humor social en Argentina.",
            }),
          },
          {
            spaceKey: "sponsored_mid",
            name: "Espacio Promocional Auspiciado",
            description: "Bloque central para marcas y notas patrocinadas en la portada.",
            active: true,
            contentJson: JSON.stringify({
              sponsor: "Banco Nación Tech",
              logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80",
              text: "Potenciando la innovación tecnológica y el desarrollo regional en todo el país.",
              link: "https://example.com",
            }),
          },
          {
            spaceKey: "weather_ticker",
            name: "Marquesina de Clima y Cotizaciones",
            description: "Barra superior con temperatura, dólar blue e indicadores económicos.",
            active: true,
            contentJson: JSON.stringify({
              dollarBlue: "$1.240",
              dollarOfficial: "$1.015",
              riesgoPais: "1.120 pts",
              weather: "Buenos Aires 22°C ☀️",
            }),
          },
        ],
      });
    }

    // 3. Verificar si ya hay artículos
    const existing = await prisma.article.count();
    if (existing > 0) {
      return NextResponse.json({ message: "Database ready (users, spaces, articles verified)" });
    }

    const articles = [
      {
        title: "Tensión en el Congreso: El debate presupuestario polariza al país",
        slug: "tension-congreso-presupuesto",
        summary: "El nuevo paquete fiscal genera fuertes divisiones. Mientras algunos sectores lo ven como una salvación económica, otros temen recortes dramáticos.",
        content: `El clima político en Argentina ha alcanzado un nuevo punto de ebullición tras la presentación del último proyecto presupuestario. Las sesiones en el Congreso reflejan una marcada división que trasciende los pasillos del palacio legislativo y se instala en la calle.

La figura central de este debate es el presidente [PERSON:Javier Milei], quien ha defendedido a ultranza el plan de déficit cero. Su discurso, aunque movilizador para sus bases, sigue generando resistencia en los sectores opositores, liderados por referentes históricos como [PERSON:Cristina Kirchner], quien reapareció públicamente para criticar duramente las medidas.

El impacto social es innegable. Si observamos el mapa de calor territorial sobre este tema [TOPIC:economía], vemos que el centro del país mantiene niveles moderados de esperanza, mientras que en regiones del conurbano bonaerense y el sur la fatiga social comienza a ser el sentimiento predominante.

"Estamos en una transición dolorosa pero necesaria", argumentan desde el oficialismo, mientras que las calles reflejan una creciente movilización ciudadana ante el encarecimiento de la vida diaria.

La gran incógnita es cuánto tiempo más resistirá el humor social sin ver resultados palpables en la economía diaria.`,
        imageUrl: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=800&q=80",
        category: "Política",
        author: "Analista Senior Talos",
      },
      {
        title: "Lionel Messi y el efecto unificador: Más allá del fútbol",
        slug: "messi-efecto-unificador",
        summary: "En un país fracturado políticamente, la figura del capitán de la selección sigue siendo el único bastión de consenso absoluto.",
        content: `No es novedad que Argentina vive tiempos de extrema polarización. Sin embargo, hay un fenómeno sociológico que desafía todas las grietas y tensiones: el efecto de [PERSON:Lionel Messi].

A diferencia de cualquier figura política, artística o empresarial, el capitán de la selección argentina trasciende el mero ámbito deportivo para convertirse en un verdadero arquetipo de héroe nacional. En un análisis reciente, los mapas de calor territorial muestran que el sentimiento hacia su figura es unánimemente verde en todas las provincias del país.

¿Por qué ocurre esto? Los expertos sugieren que, en medio de la crisis de [TOPIC:inflación] y los debates interminables sobre la [TOPIC:seguridad], la sociedad necesita aferrarse a un símbolo de éxito, humildad y esfuerzo que no esté contaminado por intereses partidarios.

Mientras el país discute su rumbo económico, el "fenómeno Messi" sirve como un respiro psicológico, un ancla emocional que recuerda, aunque sea por noventa minutos, que el consenso absoluto aún es posible en Argentina.`,
        imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
        category: "Deportes & Sociedad",
        author: "Redacción Especial",
      }
    ];

    for (const article of articles) {
      await prisma.article.create({
        data: article
      });
    }

    return NextResponse.json({ message: "Seeded successfully", count: articles.length });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
