import { auth, currentUser } from "@clerk/nextjs/server";

import { EditorShell } from "@/components/editor/editor-shell";
import { listOwnedProjects, listSharedProjects } from "@/lib/projects";

export default async function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  const [ownedProjects, sharedProjects] = userId
    ? await Promise.all([
        listOwnedProjects(userId),
        email ? listSharedProjects(userId, email) : Promise.resolve([]),
      ])
    : [[], []];

  return (
    <EditorShell
      ownedProjects={ownedProjects.map(({ id, name }) => ({ id, name }))}
      sharedProjects={sharedProjects.map(({ id, name }) => ({ id, name }))}
    >
      {children}
    </EditorShell>
  );
}
