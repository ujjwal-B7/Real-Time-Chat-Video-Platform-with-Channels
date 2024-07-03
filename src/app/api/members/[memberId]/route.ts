import { db } from "@/lib/db";

import { currentProfile } from "@/lib/currentProfile";

import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();

    //extracting the url from req
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    //extracting the serverId and memberId from the query in the url
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log("MEMBER_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
