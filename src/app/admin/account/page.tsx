import { requireAdmin } from "@/lib/admin";
import { PageHeader } from "@/components/admin/ui";
import AccountForms from "./AccountForms";

export default async function Account() {
  const sb = await requireAdmin();
  const { data: { user } } = await sb.auth.getUser();
  return (
    <>
      <PageHeader title="My account" subtitle={`Signed in as ${user?.email}`} />
      <AccountForms email={user?.email ?? ""} />
    </>
  );
}
