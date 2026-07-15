import { getClerkProfilesByEmails } from "@/lib/clerk-users";
import { prisma } from "@/lib/prisma";

export interface CollaboratorRecord {
  email: string;
  createdAt: Date;
}

export interface EnrichedCollaborator {
  email: string;
  displayName: string | null;
  imageUrl: string | null;
  createdAt: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

export async function listProjectCollaborators(
  projectId: string
): Promise<EnrichedCollaborator[]> {
  const collaborators = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });

  const emails = collaborators.map((collaborator) => collaborator.email);
  const profiles = await getClerkProfilesByEmails(emails);

  return collaborators.map((collaborator) => {
    const profile = profiles.get(collaborator.email);

    return {
      email: collaborator.email,
      displayName: profile?.displayName ?? null,
      imageUrl: profile?.imageUrl ?? null,
      createdAt: collaborator.createdAt.toISOString(),
    };
  });
}

export async function inviteProjectCollaborator(
  projectId: string,
  email: string
): Promise<CollaboratorRecord> {
  const normalizedEmail = normalizeEmail(email);

  if (!isValidEmail(normalizedEmail)) {
    throw new Error("Invalid email address");
  }

  const existing = await prisma.projectCollaborator.findUnique({
    where: {
      projectId_email: {
        projectId,
        email: normalizedEmail,
      },
    },
  });

  if (existing) {
    throw new Error("Collaborator already invited");
  }

  return prisma.projectCollaborator.create({
    data: {
      projectId,
      email: normalizedEmail,
    },
  });
}

export async function removeProjectCollaborator(
  projectId: string,
  email: string
): Promise<void> {
  const normalizedEmail = normalizeEmail(email);

  await prisma.projectCollaborator.delete({
    where: {
      projectId_email: {
        projectId,
        email: normalizedEmail,
      },
    },
  });
}
