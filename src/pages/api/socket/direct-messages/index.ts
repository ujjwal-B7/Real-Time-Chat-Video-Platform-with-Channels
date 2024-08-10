import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/types";

import { currentProfilePages } from "@/lib/currentProfileForPages";
import { db } from "@/lib/db";

// creating the new messages
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

    if (!profile) return res.status(401).json({ error: "Unauthorized" });

    if (!conversationId)
      return res.status(400).json({ error: "Conversation ID missing" });

    if (!content) return res.status(400).json({ error: "Content missing" });

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation)
      return res.status(404).json({ error: "Conversation not found" });

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) return res.status(404).json({ message: "Member not found" });

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: member.id as string,
      },
      // nested populate , including the member who created the message and also including the profile which is stored in the member model referencing the profile model
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    // immediately emitting the socket io for all the connections
    const channelKey = `chat:${conversationId}:messages`;

    // channel key represents unique key using channelId denoting in which channel the message is created
    res?.socket?.server?.io.emit(channelKey, message);

    return res.status(201).json(message);
  } catch (error) {
    console.log("DIRECT_MESSAGES_POST", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}
