"use client";

import { useActionState, useState } from "react";
import { Alert, Button, Card, Input, Segmented, Typography } from "antd";
import { LockKeyhole } from "lucide-react";
import { loginAction } from "@/app/(admin)/edit/actions";
import type { LoginState } from "@/lib/admin/types";
import { localeLabels, locales, type Locale } from "@/lib/i18n/config";
import { useAdminLang } from "./AdminProviders";

const initialState: LoginState = { status: "idle" };

/** Экран ввода PIN-кода для входа в редактор */
export default function LoginScreen({
  adminConfigured,
  next = "/edit",
}: {
  adminConfigured: boolean;
  /** Куда вернуть после входа */
  next?: string;
}) {
  const { strings: a, lang, setLang } = useAdminLang();
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [pin, setPin] = useState("");

  const error =
    state.status === "error"
      ? state.reason === "locked"
        ? a.locked(state.minutes ?? 15)
        : state.reason === "not_configured"
          ? a.adminNotConfigured
          : a.wrongPin
      : null;

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <Card className="w-full max-w-sm" styles={{ body: { padding: 28 } }}>
        <div className="flex justify-end">
          <Segmented<Locale>
            size="small"
            value={lang}
            onChange={setLang}
            options={locales.map((l) => ({ value: l, label: localeLabels[l].code }))}
            aria-label={a.interfaceLanguage}
          />
        </div>
        <div className="mt-4 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/10 text-gold-500">
            <LockKeyhole className="h-6 w-6" aria-hidden />
          </span>
          <Typography.Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
            {a.loginTitle}
          </Typography.Title>
          <Typography.Text type="secondary">{a.loginSubtitle}</Typography.Text>
        </div>

        {!adminConfigured && (
          <Alert className="mt-5" type="error" showIcon title={a.adminNotConfigured} />
        )}

        <form action={formAction} className="mt-6 flex flex-col gap-3">
          <input type="hidden" name="next" value={next} />
          <label htmlFor="pin" className="text-sm font-semibold text-ink">
            {a.pinLabel}
          </label>
          <Input.Password
            id="pin"
            name="pin"
            size="large"
            inputMode="numeric"
            autoComplete="current-password"
            autoFocus
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            status={error ? "error" : undefined}
            disabled={!adminConfigured}
          />
          {error && (
            <Typography.Text type="danger" role="alert">
              {error}
            </Typography.Text>
          )}
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={pending}
            disabled={!adminConfigured || pin.trim().length === 0}
          >
            {a.loginButton}
          </Button>
        </form>
      </Card>
    </main>
  );
}
