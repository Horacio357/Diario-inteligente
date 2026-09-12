import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.article.count();
  if (existing > 0) {
    console.log("Articles already seeded");
    return;
  }

  const articles = [
    {
      title: "Tensión en el Congreso: El debate presupuestario polariza al país",
      slug: "tension-congreso-presupuesto",
      summary: "El nuevo paquete fiscal genera fuertes divisiones. Mientras algunos sectores lo ven como una salvación económica, otros temen recortes dramáticos.",
      content: `El clima político en Argentina ha alcanzado un nuevo punto de ebullición tras la presentación del último proyecto presupuestario. Las sesiones en el Congreso reflejan una marcada división que trasciende los pasillos del palacio legislativo y se instala en la calle.

La figura central de este debate es el presidente [PERSON:Javier Milei], quien ha defendido a ultranza el plan de déficit cero. Su discurso, aunque movilizador para sus bases, sigue generando resistencia en los sectores opositores, liderados por referentes históricos como [PERSON:Cristina Kirchner], quien reapareció públicamente para criticar duramente las medidas.

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
  console.log("Seeded successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
