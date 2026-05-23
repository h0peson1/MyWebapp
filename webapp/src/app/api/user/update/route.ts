import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const userId = headersList.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
      select: { id: true, name: true, email: true }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err: unknown) {
    console.error("User Update Error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
