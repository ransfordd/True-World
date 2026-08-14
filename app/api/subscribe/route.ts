import { NextResponse } from "next/server";
import { z } from "zod";
import { sendMail } from "@/lib/email";
import { appendInboxMessage } from "@/lib/cms/inbox";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    await appendInboxMessage({
      type: "subscribe",
      email: data.email,
      body: "Newsletter subscription",
    });

    try {
      await sendMail({
        subject: "Newsletter Subscription",
        replyTo: data.email,
        text: `Please subscribe this email to The True Word newsletter:\n\n${data.email}`,
      });
    } catch (mailError) {
      console.error("subscribe mail:", mailError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Invalid email", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("subscribe:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
