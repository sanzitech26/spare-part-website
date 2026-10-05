"use client";
import { useActionState } from "react";
import SubmitButton from "@/components/admin/SubmitButton";
import PasswordField from "@/components/admin/PasswordField";
import { Card, Icon, field, labelCls } from "@/components/admin/ui";
import { changeEmail, changePassword, type State } from "./actions";

function Err({ s }: { s: State }) {
  return s?.error ? <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{s.error}</p> : null;
}

export default function AccountForms({ email }: { email: string }) {
  const [e, emailAction] = useActionState(changeEmail, null);
  const [p, passAction] = useActionState(changePassword, null);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <h2 className="mb-1 flex items-center gap-2 font-semibold text-slate-900"><Icon name="mail" className="h-4 w-4 text-indigo-600" /> Email address</h2>
        <p className="mb-4 text-sm text-slate-500">You&apos;ll be signed out and log in again with the new email.</p>
        <form action={emailAction} className="space-y-4">
          <Err s={e} />
          <label className="block space-y-1"><span className={labelCls}>New email</span><input name="email" type="email" required defaultValue={email} autoComplete="off" className={field} /></label>
          <label className="block space-y-1"><span className={labelCls}>Current password</span><PasswordField name="current" autoComplete="current-password" className={field} /></label>
          <SubmitButton pendingText="Updating…">Update email</SubmitButton>
        </form>
      </Card>
      <Card>
        <h2 className="mb-1 flex items-center gap-2 font-semibold text-slate-900"><Icon name="lock" className="h-4 w-4 text-indigo-600" /> Password</h2>
        <p className="mb-4 text-sm text-slate-500">Use at least 8 characters. You&apos;ll be signed out afterwards.</p>
        <form action={passAction} className="space-y-4">
          <Err s={p} />
          <label className="block space-y-1"><span className={labelCls}>Current password</span><PasswordField name="current" autoComplete="current-password" className={field} /></label>
          <label className="block space-y-1"><span className={labelCls}>New password</span><PasswordField name="password" autoComplete="new-password" minLength={8} className={field} /></label>
          <label className="block space-y-1"><span className={labelCls}>Confirm new password</span><PasswordField name="confirm" autoComplete="new-password" minLength={8} className={field} /></label>
          <SubmitButton pendingText="Updating…">Update password</SubmitButton>
        </form>
      </Card>
    </div>
  );
}
