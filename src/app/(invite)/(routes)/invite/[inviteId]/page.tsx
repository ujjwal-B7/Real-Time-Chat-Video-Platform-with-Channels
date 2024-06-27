import { currentProfile } from "@/lib/currentProfile";

import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params: {
    inviteId: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await currentProfile();

  if (!profile) return redirect("/sign-in");

  const { inviteId } = params;

  console.log("*inviteId*", inviteId);

  if (!inviteId) return redirect("/");

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: inviteId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) return redirect(`/servers/${existingServer.id}`);

  //if existing server then it gets redirects, if no server then only moves to this part to update the server with the invited user id

  const server = await db.server.update({
    where: {
      inviteCode: inviteId,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) return redirect(`/servers/${server.id}`);

  return <div>InviteCodePage</div>;
};

export default InviteCodePage;
