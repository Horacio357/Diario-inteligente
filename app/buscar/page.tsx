import SearchClient from "./SearchClient";

export const metadata = {
  title: "Buscador Avanzado & Archivo Histórico · Talos Diario",
  description: "Busca noticias, políticos, temas y reportes de opinión pública en Proyecto Talos.",
};

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return <SearchClient initialQuery={q} />;
}
