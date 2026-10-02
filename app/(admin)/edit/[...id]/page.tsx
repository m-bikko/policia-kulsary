import { notFound } from "next/navigation";
import { isAdminConfigured, isAuthenticated } from "@/lib/admin/session";
import { loadDoc, loadKeepAliveStatus } from "@/lib/admin/editor-data";
import { docKind, isSiteKind, TEMPLATE_ID } from "@/lib/admin/documents";
import { isSupabaseConfigured, mediaBaseUrl } from "@/lib/supabase/env";
import LoginScreen from "@/components/admin/LoginScreen";
import ContentEditor from "@/components/admin/ContentEditor";

export const dynamic = "force-dynamic";

/** /edit/template, /edit/portal, /edit/atyrau, /edit/atyrau/zhylyoi - редактор одного документа */
export default async function EditDocumentPage({ params }: { params: Promise<{ id: string[] }> }) {
  const { id: segments } = await params;
  const id = segments.map(decodeURIComponent).join("/");

  if (!(await isAuthenticated())) {
    return <LoginScreen adminConfigured={isAdminConfigured()} next={`/edit/${id}`} />;
  }
  const kind = docKind(id);
  if (!kind) notFound();

  const [doc, template, keepAlive] = await Promise.all([
    loadDoc(id),
    isSiteKind(kind) ? loadDoc(TEMPLATE_ID) : null,
    loadKeepAliveStatus(),
  ]);
  if (!doc) notFound();

  return (
    <ContentEditor
      key={id}
      docId={id}
      kind={kind}
      initialData={doc.data}
      initialVersion={doc.version}
      initialStatus={doc.status}
      template={template?.data ?? null}
      keepAlive={keepAlive}
      supabaseConfigured={isSupabaseConfigured()}
      mediaBase={mediaBaseUrl()}
    />
  );
}
