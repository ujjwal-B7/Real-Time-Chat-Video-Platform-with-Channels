import { NextRequest, NextResponse } from "next/server";

import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!params.serverId)
      return new NextResponse("Server Id missing", { status: 400 });

    const server = await db.server.delete({
      where: {
        id: params.serverId,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("DELETE_SERVER_ERROR");
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
