"use server";

import { z } from "zod";

export interface ContactState {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Partial<Record<"name" | "email" | "message", string>>;
  /** Echoed back so React 19's post-action form reset doesn't wipe what the visitor typed. */
  values?: { name: string; email: string; message: string };
}

const schema = z.object({
  name: z.string().trim().min(2, "Please tell me your name.").max(80),
  email: z.string().trim().email("That email address doesn’t look right.").max(160),
  message: z.string().trim().min(10, "A little more detail helps, at least 10 characters.").max(4000),
  website: z.string().max(0), // honeypot: real people leave this empty
});

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const text = (k: string) => (typeof formData.get(k) === "string" ? (formData.get(k) as string) : "");
  const values = { name: text("name"), email: text("email"), message: text("message") };
  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    // A filled honeypot gets a quiet fake success so bots learn nothing.
    if (parsed.error.issues.some((i) => i.path[0] === "website")) {
      return { status: "success", message: "Thanks, your message is on its way." };
    }
    const errors: NonNullable<ContactState["errors"]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as "name" | "email" | "message";
      errors[key] ??= issue.message;
    }
    return { status: "error", message: "Please check the highlighted fields.", errors, values };
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL = "onboarding@resend.dev" } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    return { status: "error", message: "The form isn’t available right now. Please email me directly.", values };
  }

  const { name, email, message } = parsed.data;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `Portfolio <${CONTACT_FROM_EMAIL}>`,
        to: [CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `New message from ${name}`,
        text: `${message}\n\n${name} <${email}>`,
        html: `<p>${esc(message).replace(/\n/g, "<br>")}</p><p><strong>${esc(name)}</strong> &lt;${esc(email)}&gt;</p>`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    return { status: "success", message: "Thanks, your message is on its way. I’ll reply soon." };
  } catch {
    return { status: "error", message: "Something went wrong sending that. Please email me directly.", values };
  }
}
