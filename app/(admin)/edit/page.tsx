import { isAdminConfigured, isAuthenticated } from "@/lib/admin/session";
import { loadDocRows, loadKeepAliveStatus } from "@/lib/admin/editor-data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import LoginScreen from "@/components/admin/LoginScreen";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

/** /edit - вход по PIN (ADMIN_PIN), затем карта Казахстана со всеми лендингами */
export default async function EditPage() {
  if (!(await isAuthenticated())) {
    return <LoginScreen adminConfigured={isAdminConfigured()} />;
  }

  const [rows, keepAlive] = await Promise.all([loadDocRows(), loadKeepAliveStatus()]);
  return <AdminDashboard rows={rows} keepAlive={keepAlive} supabaseConfigured={isSupabaseConfigured()} />;
}
