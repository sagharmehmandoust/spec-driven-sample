import { currentUser } from "@clerk/nextjs/server";

import {
  badRequest,
  forbidden,
  notFound,
  requireIdentity,
} from "@/lib/api-auth";
import { getCursorColor, getLiveblocks } from "@/lib/liveblocks";
import { hasProjectAccess } from "@/lib/project-access";
import { getProjectById } from "@/lib/projects";

interface LiveblocksAuthBody {
  room?: string;
}

function getDisplayName(user: {
  fullName: string | null;
  firstName: string | null;
  username: string | null;
  primaryEmailAddress?: { emailAddress: string } | null;
}): string {
  if (user.fullName) return user.fullName;
  if (user.firstName) return user.firstName;
  if (user.username) return user.username;
  if (user.primaryEmailAddress?.emailAddress) {
    return user.primaryEmailAddress.emailAddress;
  }
  return "Anonymous";
}

export async function POST(request: Request) {
  const identity = await requireIdentity();
  if (identity instanceof Response) {
    return identity;
  }

  let body: LiveblocksAuthBody;

  try {
    body = (await request.json()) as LiveblocksAuthBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const roomId = body.room?.trim();
  if (!roomId) {
    return badRequest("Room ID is required");
  }

  // Project ID is the Liveblocks room ID
  const project = await getProjectById(roomId);

  if (!project) {
    return notFound();
  }

  if (!(await hasProjectAccess(project, identity))) {
    return forbidden();
  }

  const user = await currentUser();
  const name = user ? getDisplayName(user) : "Anonymous";
  const avatar = user?.imageUrl ?? "";
  const color = getCursorColor(identity.userId);

  const liveblocks = getLiveblocks();

  await liveblocks.getOrCreateRoom(roomId, {
    defaultAccesses: [],
  });

  const session = liveblocks.prepareSession(identity.userId, {
    userInfo: {
      name,
      avatar,
      color,
    },
  });

  session.allow(roomId, session.FULL_ACCESS);

  const { status, body: authBody } = await session.authorize();

  return new Response(authBody, { status });
}
