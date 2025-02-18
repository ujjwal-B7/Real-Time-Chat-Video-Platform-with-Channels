import { NextResponse, NextRequest } from "next/server";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";

//at a time i need to fetch a 10 messages...and another 10 and goes on
const MESSAGES_BATCH = 10;

export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfile();

    //from the url we sent throuh the useChatQuery, we are creating a url object by pasing the req.url in the new URL interface, so after creating the object of url so we can get the properties as in object we can do obj.function()
    // so here below we are doing searchParams.get("cursor")
    const { searchParams } = new URL(req.url);

    // cursor method is used to tell the infinite load from what message to load the next batch of messages
    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!conversationId)
      return new NextResponse("Conversation ID missing", { status: 401 });

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        // skipping the current messages where the cursor is pointing recently so we can get the next page older messages
        skip: 1,
        // built in prisma property cursor, it indicates that we are going to start fetching the messages from the message point that we pass from the useInfiniteQuery,
        // for eg: if we are currently loading latest 10 messages then when we scroll then the we are passing the old message starting point as a cursor so we can get the older messages
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
    // initially the message loads here as the first time it loads the latest message which dont have cursor
    else {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // initially while we start creating the message, then message number starts from 1 message , 2 message and go on
    // so at first nextCursor is null, nextCursor just points the end of a message batch (10 messages in my case),
    // so when the messages.length === MESSAGES_BATCH then we have to load another new message leaving the previous 10 as old message
    // so we put the 10th message id as a nextCursor
    let nextCursor = null;
    if (messages.length === MESSAGES_BATCH) {
      // after 10 messages retrieving the 10th message id by messages[9].id as message is array messages[]
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("DIRECT_MESSAGES_GET", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
