import { NextResponse } from "next/server";
import { z } from "zod";
import { sendMail } from "@/lib/email";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  message: z.string().optional().default(""),
  package: z.string().min(1),
  action: z.string().optional().default("enroll"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    await sendMail({
      subject: `Coaching Inquiry: ${data.package}`,
      replyTo: data.email,
      text: [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone}`,
        `Package: ${data.package}`,
        `Action: ${data.action}`,
        "",
        data.message || "(no message)",
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Invalid input", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("coaching-contact:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}
