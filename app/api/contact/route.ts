import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email/contact";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "No pudimos leer el formulario. Probá de nuevo." },
      { status: 400 },
    );
  }

  const result = await sendContactEmail(payload);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({ ok: true, demo: result.demo });
}
