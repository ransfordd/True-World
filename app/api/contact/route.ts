import { NextResponse } from "next/server";
import { z } from "zod";
import { sendMail } from "@/lib/email";

const schema = z.object({
  name: z.string().optional().default(""),
  email: z
    .string()
    .optional()
    .default("")
    .refine((v) => !v || z.string().email().safeParse(v).success, {
      message: "Invalid email",
    }),
  phone: z.string().optional().default(""),
  message: z.string().min(1),
  package: z.string().optional().default(""),
  type: z.enum(["question", "enrollment"]).optional().default("question"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const subject =
      data.type === "enrollment"
        ? `Enrollment: ${data.package || "Coaching"}`
        : "Ask a Question";

    await sendMail({
      subject,
      replyTo: data.email || undefined,
      text: [
        `Type: ${data.type}`,
        `Name: ${data.name || "(not provided)"}`,
        `Email: ${data.email || "(not provided)"}`,
        `Phone: ${data.phone || "(not provided)"}`,
        data.package ? `Package: ${data.package}` : "",
        "",
        data.message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Invalid input", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("contact:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}
