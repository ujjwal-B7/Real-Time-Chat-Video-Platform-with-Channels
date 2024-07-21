import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface ServerIdPageProps {
  params: { id: string };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: params?.id,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== "general") return null;

  return redirect(`/servers/${params?.id}/channels/${initialChannel?.id}`);
};

export default ServerIdPage;
