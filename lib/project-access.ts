import { auth, currentUser } from "@clerk/nextjs/server";
import { cache } from "react";

import { prisma } from "@/lib/prisma";

export interface ClerkIdentity {
  userId: string;
  email: string;
}

function getEmailFromSessionClaims(
  sessionClaims: Record<string, unknown> | null | undefined
): string {
  if (!sessionClaims) return "";

  for (const key of ["email", "primary_email_address"]) {
    const value = sessionClaims[key];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return "";
}

async function resolveUserEmail(
  sessionClaims: Record<string, unknown> | null | undefined
): Promise<string> {
  const emailFromClaims = getEmailFromSessionClaims(sessionClaims);
  if (emailFromClaims) {
    return emailFromClaims;
  }

  try {
    const user = await currentUser();
    return user?.primaryEmailAddress?.emailAddress ?? "";
  } catch {
    return "";
  }
}

export const getCurrentIdentity = cache(
  async (): Promise<ClerkIdentity | null> => {
    const { isAuthenticated, userId, sessionClaims } = await auth();
    if (!isAuthenticated || !userId) return null;

    const email = await resolveUserEmail(sessionClaims);

    return { userId, email };
  }
);

export function isProjectOwner(
  project: { ownerId: string },
  userId: string
): boolean {
  return project.ownerId === userId;
}

export async function isProjectCollaborator(
  projectId: string,
  email: string
): Promise<boolean> {
  if (!email) return false;

  const collaborator = await prisma.projectCollaborator.findUnique({
    where: {
      projectId_email: {
        projectId,
        email,
      },
    },
  });

  return collaborator !== null;
}

export async function hasProjectAccess(
  project: { id: string; ownerId: string },
  identity: ClerkIdentity
): Promise<boolean> {
  if (isProjectOwner(project, identity.userId)) return true;
  return isProjectCollaborator(project.id, identity.email);
}
