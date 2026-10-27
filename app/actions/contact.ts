"use server";

import { contactSchema, sendContactEmail } from "@/lib/email/contact";

type ContactField = "name" | "email" | "message";

export type ContactActionResult =
  | { ok: true; demo?: boolean }
  | {
      ok: false;
      error: string;
      fieldErrors?: Partial<Record<ContactField, string>>;
    };

export async function submitContactAction(input: {
  name: string;
  email: string;
  message: string;
  company?: string;
}): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    const flattened = parsed.error.flatten().fieldErrors;
    return {
      ok: false,
      error: "Revisá los datos y volvé a intentar.",
      fieldErrors: {
        name: flattened.name?.[0],
        email: flattened.email?.[0],
        message: flattened.message?.[0],
      },
    };
  }

  const result = await sendContactEmail(parsed.data);

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  return { ok: true, demo: result.demo };
}
