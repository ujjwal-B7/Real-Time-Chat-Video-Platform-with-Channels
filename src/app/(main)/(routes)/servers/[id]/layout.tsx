import ServerSideBar from "@/components/server/ServerSideBar";

import { currentProfile } from "@/lib/currentProfile";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.id,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
      <ServerSideBar id={params.id} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
