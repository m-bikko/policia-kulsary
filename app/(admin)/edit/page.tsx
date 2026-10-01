import { isAdminConfigured, isAuthenticated } from "@/lib/admin/session";
import { loadEditorData, loadKeepAliveStatus } from "@/lib/admin/editor-data";
import { isSupabaseConfigured, mediaBaseUrl } from "@/lib/supabase/env";
import LoginScreen from "@/components/admin/LoginScreen";
import ContentEditor from "@/components/admin/ContentEditor";

export const dynamic = "force-dynamic";

/** /edit - вход по PIN (ADMIN_PIN), затем редактор всего контента сайта */
export default async function EditPage() {
  if (!(await isAuthenticated())) {
    return <LoginScreen adminConfigured={isAdminConfigured()} />;
  }

  const [{ content, version, seeded }, keepAlive] = await Promise.all([
    loadEditorData(),
    loadKeepAliveStatus(),
  ]);
  return (
    <ContentEditor
      initialContent={content}
      initialVersion={version}
      seeded={seeded}
      keepAlive={keepAlive}
      supabaseConfigured={isSupabaseConfigured()}
      mediaBase={mediaBaseUrl()}
    />
  );
}
