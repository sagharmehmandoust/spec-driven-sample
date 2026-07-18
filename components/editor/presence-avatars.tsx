"use client";

import { useMemo } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { shallow, useOthersMapped } from "@liveblocks/react/suspense";

const MAX_VISIBLE_AVATARS = 5;
const AVATAR_SIZE_CLASS = "h-7 w-7";

interface CollaboratorPresence {
  userId: string;
  name: string;
  avatar: string;
  color: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
}

function CollaboratorAvatar({
  name,
  avatar,
  color,
}: {
  name: string;
  avatar: string;
  color: string;
}) {
  return (
    <div
      className={`${AVATAR_SIZE_CLASS} relative shrink-0 overflow-hidden rounded-full ring-2 ring-base`}
      style={{ backgroundColor: color }}
      title={name}
      aria-hidden="true"
    >
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element -- Liveblocks avatar URLs are external
        <img
          src={avatar}
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-[10px] font-medium text-copy-primary">
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}

export function PresenceAvatars() {
  const { user } = useUser();
  const currentUserId = user?.id;

  const othersMapped = useOthersMapped(
    (other) => ({
      id: other.id,
      name: other.info.name,
      avatar: other.info.avatar,
      color: other.info.color,
    }),
    shallow,
  );

  const collaborators = useMemo(() => {
    const seen = new Set<string>();
    const result: CollaboratorPresence[] = [];

    for (const [, info] of othersMapped) {
      const userId = info.id;
      if (!userId || userId === currentUserId || seen.has(userId)) {
        continue;
      }
      seen.add(userId);
      result.push({
        userId,
        name: info.name || "Anonymous",
        avatar: info.avatar || "",
        color: info.color,
      });
    }

    return result;
  }, [othersMapped, currentUserId]);

  const visible = collaborators.slice(0, MAX_VISIBLE_AVATARS);
  const overflowCount = Math.max(0, collaborators.length - MAX_VISIBLE_AVATARS);
  const hasCollaborators = collaborators.length > 0;

  return (
    <div
      className="pointer-events-none absolute top-3 right-3 z-40"
      aria-label="Active collaborators"
    >
      <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-surface-border bg-surface/95 px-2 py-1.5 shadow-lg backdrop-blur-sm">
        {hasCollaborators ? (
          <>
            <div className="flex items-center -space-x-2">
              {visible.map((collaborator) => (
                <CollaboratorAvatar
                  key={collaborator.userId}
                  name={collaborator.name}
                  avatar={collaborator.avatar}
                  color={collaborator.color}
                />
              ))}
              {overflowCount > 0 ? (
                <div
                  className={`${AVATAR_SIZE_CLASS} relative z-10 flex shrink-0 items-center justify-center rounded-full bg-elevated text-[10px] font-medium text-copy-secondary ring-2 ring-base`}
                  aria-label={`${overflowCount} more collaborators`}
                >
                  +{overflowCount}
                </div>
              ) : null}
            </div>
            <div
              className="h-5 w-px shrink-0 bg-surface-border"
              aria-hidden="true"
            />
          </>
        ) : null}
        <UserButton
          appearance={{
            elements: {
              rootBox: "flex",
              avatarBox: AVATAR_SIZE_CLASS,
            },
          }}
        />
      </div>
    </div>
  );
}
