import { NextResponse } from "next/server";
import { registerUser } from "@/lib/register";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await registerUser(body);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, fieldErrors: result.fieldErrors },
      { status: 400 }
    );
  }

  return NextResponse.json({ userId: result.userId }, { status: 201 });
}
