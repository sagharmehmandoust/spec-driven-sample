import { EditorShell } from "@/components/editor/editor-shell";
import { getCurrentIdentity } from "@/lib/project-access";
import { listOwnedProjects, listSharedProjects } from "@/lib/projects";

export default async function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const identity = await getCurrentIdentity();
  const userId = identity?.userId;
  const email = identity?.email ?? "";

  const [ownedProjects, sharedProjects] = userId
    ? await Promise.all([
        listOwnedProjects(userId),
        email ? listSharedProjects(userId, email) : Promise.resolve([]),
      ])
    : [[], []];

  return (
    <div className="flex h-dvh min-h-0 flex-col">
      <EditorShell
        ownedProjects={ownedProjects.map(({ id, name }) => ({ id, name }))}
        sharedProjects={sharedProjects.map(({ id, name }) => ({ id, name }))}
      >
        {children}
      </EditorShell>
    </div>
  );
}
