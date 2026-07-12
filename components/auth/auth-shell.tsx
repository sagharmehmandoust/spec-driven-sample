import { FileText, Share2, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

interface AuthShellProps {
  children: ReactNode;
}

const features = [
  {
    icon: Sparkles,
    title: "AI architecture generation",
    description: "Generate system designs from natural language prompts.",
  },
  {
    icon: Share2,
    title: "Real-time collaboration",
    description: "Work together on a shared canvas with live cursors.",
  },
  {
    icon: FileText,
    title: "Instant spec generation",
    description: "Turn your architecture into Markdown technical specs.",
  },
];

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen font-sans">
      <aside className="hidden w-1/2 flex-col bg-auth-panel px-12 py-10 lg:flex">
        <div className="flex items-center gap-2.5">
          <span
            className="size-7 shrink-0 rounded-lg bg-brand"
            aria-hidden="true"
          />
          <span className="text-sm font-semibold text-copy-primary">
            Spec-Driven Sample
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <h1 className="max-w-md text-3xl font-semibold leading-tight tracking-tight text-copy-primary">
            System design at the speed of thought.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-copy-secondary">
            A collaborative workspace for describing systems, refining
            architecture on a shared canvas, and shipping technical specs.
          </p>

          <ul className="mt-10 space-y-6">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-dim">
                  <Icon className="size-4 text-brand" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-sm font-medium text-copy-primary">
                    {title}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-copy-muted">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="flex w-full flex-col bg-base lg:w-1/2">
        <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
