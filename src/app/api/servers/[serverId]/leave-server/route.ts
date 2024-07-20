import { NextRequest, NextResponse } from "next/server";

import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!params.serverId)
      return new NextResponse("Server Id missing", { status: 400 });

    const server = await db.server.update({
      where: {
        id: params.serverId,
        //checking if the profileId is not the admin, admin cannot leave the server
        profileId: {
          not: profile.id,
        },
        //only members can leave the server so checking if the logged in user is part of server member of not
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("LEAVE_SERVER_ERROR");
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
