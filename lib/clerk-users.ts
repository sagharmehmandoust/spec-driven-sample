import { clerkClient } from "@clerk/nextjs/server";

export interface ClerkUserProfile {
  displayName: string | null;
  imageUrl: string | null;
}

function getDisplayName(user: {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
}): string | null {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  if (fullName) return fullName;
  if (user.username) return user.username;
  return null;
}

export async function getClerkProfilesByEmails(
  emails: string[]
): Promise<Map<string, ClerkUserProfile>> {
  const profiles = new Map<string, ClerkUserProfile>();
  if (emails.length === 0) return profiles;

  const client = await clerkClient();
  const { data } = await client.users.getUserList({
    emailAddress: emails,
    limit: emails.length,
  });

  for (const user of data) {
    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) continue;

    profiles.set(email.toLowerCase(), {
      displayName: getDisplayName(user),
      imageUrl: user.imageUrl,
    });
  }

  return profiles;
}
