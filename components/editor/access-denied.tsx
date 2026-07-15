import { Lock } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const accessDeniedCardClass =
  "flex w-full max-w-md flex-col items-center rounded-3xl border border-surface-border bg-elevated px-8 py-10 text-center shadow-2xl";

const accessDeniedButtonClass =
  "mt-8 h-10 rounded-full bg-brand px-6 text-sm font-medium text-primary-foreground hover:bg-brand/90";

export function AccessDenied() {
  return (
    <div className="flex h-full items-center justify-center px-4">
      <div className={accessDeniedCardClass}>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-surface-border bg-surface text-copy-primary">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </div>

        <h1 className="mt-5 text-lg font-semibold text-copy-primary">
          You don&apos;t have access to this workspace.
        </h1>
        <p className="mt-2 max-w-[34ch] text-sm text-copy-muted">
          Head back to your editor home to open a project you can access.
        </p>

        <Button
          className={accessDeniedButtonClass}
          render={<Link href="/editor" />}
        >
          Back to Editor
        </Button>
      </div>
    </div>
  );
}
