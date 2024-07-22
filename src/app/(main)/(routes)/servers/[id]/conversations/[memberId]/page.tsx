import { ChatHeader } from "@/components/chat/ChatHeader";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

interface ConversationPageProps {
  params: {
    id: string;
    memberId: string;
  };
}

export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const profile = await currentProfile();

  if (!profile) {
    return auth().redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.id,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) return redirect("/");

  //creating conversation with other member using my id through currentMember.id and memberId through the params which we get from the url when clicking the other member profile
  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  //in case conversation cannot be created,redirecting to server
  if (!conversation) return redirect(`/servers/${params.id}`);

  const { memberOne, memberTwo } = conversation;

  //extracting the opposite member to show their details in the chat
  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.id}
        type="conversation"
      />
    </div>
  );
}
