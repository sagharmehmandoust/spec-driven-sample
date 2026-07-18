import {
  badRequest,
  forbidden,
  notFound,
  requireIdentity,
} from "@/lib/api-auth";
import {
  isCanvasSnapshot,
  loadCanvasSnapshot,
  saveCanvasSnapshot,
} from "@/lib/canvas-storage";
import { hasProjectAccess } from "@/lib/project-access";
import { getProjectById, updateProjectCanvasPath } from "@/lib/projects";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const identity = await requireIdentity();
  if (identity instanceof Response) {
    return identity;
  }

  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) {
    return notFound();
  }

  if (!(await hasProjectAccess(project, identity))) {
    return forbidden();
  }

  if (!project.canvasJsonPath) {
    return notFound();
  }

  try {
    const snapshot = await loadCanvasSnapshot(project.canvasJsonPath);
    if (!snapshot) {
      return notFound();
    }

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error("[canvas] Failed to load snapshot:", error);
    return NextResponse.json(
      { error: "Failed to load canvas snapshot" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const identity = await requireIdentity();
  if (identity instanceof Response) {
    return identity;
  }

  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) {
    return notFound();
  }

  if (!(await hasProjectAccess(project, identity))) {
    return forbidden();
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  if (!isCanvasSnapshot(body)) {
    return badRequest("Canvas snapshot must include nodes and edges arrays");
  }

  try {
    const canvasJsonPath = await saveCanvasSnapshot(projectId, {
      nodes: body.nodes,
      edges: body.edges,
    });

    await updateProjectCanvasPath(projectId, canvasJsonPath);

    return NextResponse.json({
      canvasJsonPath,
      savedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[canvas] Failed to save snapshot:", error);
    return NextResponse.json(
      { error: "Failed to save canvas snapshot" },
      { status: 500 }
    );
  }
}
