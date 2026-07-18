"use client";

import { Cursors, type CursorsCursorProps } from "@liveblocks/react-flow";
import { useOther } from "@liveblocks/react/suspense";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";

function PresenceCursor({ connectionId }: CursorsCursorProps) {
  const info = useOther(connectionId, (other) => other.info);

  if (!info) {
    return null;
  }

  const color = info.color || "var(--accent-primary)";
  const name = info.name || "Anonymous";

  return (
    <div className="pointer-events-none flex items-center gap-1">
      <svg
        width="16"
        height="20"
        viewBox="0 0 16 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1 1L1 16L5.5 12.5L9.5 19L12 17.5L8 11H14L1 1Z"
          fill={color}
          stroke="var(--bg-base)"
          strokeWidth="1"
        />
      </svg>
      <span
        className="max-w-32 truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-copy-primary"
        style={{ backgroundColor: color }}
      >
        {name}
      </span>
    </div>
  );
}

export function LiveCursors() {
  return <Cursors components={{ Cursor: PresenceCursor }} />;
}
