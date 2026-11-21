"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "@/lib/contact-action";

const initial: ContactState = { status: "idle", message: "" };

const field =
  "mt-2 w-full rounded-sm border-[1.5px] border-line bg-transparent px-4 py-3 text-base transition-colors placeholder:text-ink-2/70 focus:border-accent focus:outline-none aria-[invalid=true]:border-vermilion";

export function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, initial);

  if (state.status === "success") {
    return (
      <div role="status" className="border-[1.5px] border-leaf p-8">
        <p className="h-sub text-2xl">Message sent</p>
        <p className="mt-2 text-ink-2">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className="font-semibold">
          Name
        </label>
        <input id="name" name="name" defaultValue={state.values?.name} autoComplete="name" required className={field} aria-invalid={!!state.errors?.name} aria-describedby="name-err" />
        <p id="name-err" className="mt-1 text-sm text-vermilion">{state.errors?.name}</p>
      </div>
      <div>
        <label htmlFor="email" className="font-semibold">
          Email
        </label>
        <input id="email" name="email" type="email" defaultValue={state.values?.email} autoComplete="email" required className={field} aria-invalid={!!state.errors?.email} aria-describedby="email-err" />
        <p id="email-err" className="mt-1 text-sm text-vermilion">{state.errors?.email}</p>
      </div>
      <div>
        <label htmlFor="message" className="font-semibold">
          What are you working on?
        </label>
        <textarea id="message" name="message" defaultValue={state.values?.message} rows={6} required className={`${field} resize-y`} aria-invalid={!!state.errors?.message} aria-describedby="message-err" />
        <p id="message-err" className="mt-1 text-sm text-vermilion">{state.errors?.message}</p>
      </div>
      {/* Honeypot: hidden from people, visible to naive bots */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
          {pending ? "Sending…" : "Send message"}
        </button>
        <p role="alert" className="text-sm text-vermilion">
          {state.status === "error" ? state.message : ""}
        </p>
      </div>
    </form>
  );
}
