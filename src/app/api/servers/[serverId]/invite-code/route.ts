import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";

import { NextRequest, NextResponse } from "next/server";

import { currentProfile } from "@/lib/currentProfile";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log("SERVER_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
