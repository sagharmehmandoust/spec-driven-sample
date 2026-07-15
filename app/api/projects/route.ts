import { badRequest, requireUserId } from "@/lib/api-auth";
import { createProject, listOwnedProjects } from "@/lib/projects";
import { NextResponse } from "next/server";

interface CreateProjectBody {
  name?: string;
  id?: string;
}

export async function GET() {
  const userId = await requireUserId();
  if (userId instanceof Response) {
    return userId;
  }

  const projects = await listOwnedProjects(userId);
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const userId = await requireUserId();
  if (userId instanceof Response) {
    return userId;
  }

  let body: CreateProjectBody = {};

  try {
    body = (await request.json()) as CreateProjectBody;
  } catch {
    // Empty body is valid; name defaults to "Untitled Project".
  }

  const project = await createProject(userId, body.name, body.id?.trim());
  return NextResponse.json(project, { status: 201 });
}
