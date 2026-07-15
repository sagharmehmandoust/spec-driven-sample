import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import type { ClerkIdentity } from "@/lib/project-access";

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export function notFound() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function requireUserId(): Promise<string | Response> {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return unauthorized();
  }

  return userId;
}

export async function requireIdentity(): Promise<ClerkIdentity | Response> {
  const userId = await requireUserId();
  if (userId instanceof Response) {
    return userId;
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  return { userId, email };
}
