import { NextResponse } from "next/server";
import { z } from "zod";
import { sendMail } from "@/lib/email";

const schema = z.object({
  name: z.string().optional().default(""),
  request: z.string().min(10),
  private: z.boolean().optional().default(false),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    await sendMail({
      subject: data.private ? "Private Prayer Request" : "Prayer Request",
      text: [
        `Name: ${data.name || "(anonymous)"}`,
        `Private: ${data.private ? "yes" : "no"}`,
        "",
        data.request,
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
    console.error("prayer:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send prayer request" },
      { status: 500 }
    );
  }
}
