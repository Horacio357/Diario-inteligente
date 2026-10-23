import AdminClient from "../admin/AdminClient";

export const metadata = { title: "Portal de Gestión · Talos Diario", robots: "noindex,nofollow" };

export const dynamic = "force-dynamic";

export default function AdminTalosPage() {
  return <AdminClient />;
}
