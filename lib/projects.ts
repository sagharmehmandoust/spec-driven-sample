import { prisma } from "@/lib/prisma";

const DEFAULT_PROJECT_NAME = "Untitled Project";

export async function listOwnedProjects(ownerId: string) {
  return prisma.project.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
  });
}

export async function listSharedProjects(ownerId: string, email: string) {
  return prisma.project.findMany({
    where: {
      ownerId: { not: ownerId },
      collaborators: {
        some: { email },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProject(
  ownerId: string,
  name?: string,
  id?: string
) {
  const resolvedName = name?.trim() || DEFAULT_PROJECT_NAME;

  return prisma.project.create({
    data: {
      ...(id ? { id } : {}),
      ownerId,
      name: resolvedName,
    },
  });
}

export async function getProjectById(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
  });
}

export async function renameProject(projectId: string, name: string) {
  return prisma.project.update({
    where: { id: projectId },
    data: { name: name.trim() },
  });
}

export async function deleteProject(projectId: string) {
  return prisma.project.delete({
    where: { id: projectId },
  });
}

export async function updateProjectCanvasPath(
  projectId: string,
  canvasJsonPath: string
) {
  return prisma.project.update({
    where: { id: projectId },
    data: { canvasJsonPath },
  });
}
