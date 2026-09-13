import AdminClient from "./AdminClient";

export const metadata = { title: "Admin · Talos Diario", robots: "noindex,nofollow" };

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <AdminClient />;
}
