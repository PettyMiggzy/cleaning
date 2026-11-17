"use client";

import { useActionState } from "react";
import { Icon } from "@/components/Icon";
import { login } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-7 space-y-4">
      <div>
        <label htmlFor="password" className="field-label">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" autoFocus />
      </div>
      {state?.error && (
        <p className="rounded-xl bg-[#fdf3f5] px-4 py-3 text-sm font-semibold text-[#8d2a40]" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        <Icon name="lock" className="size-5" /> {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
