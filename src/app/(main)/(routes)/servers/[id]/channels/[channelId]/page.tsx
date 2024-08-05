import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { ChatHeader } from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";

interface ChannelIdProps {
  params: {
    id: string;
    channelId: string;
  };
}

export default async function ChannelPage({ params }: ChannelIdProps) {
  console.log("params.serverId is valid?", params.id);

  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  const channel = await db.channel.findUnique({
    where: {
      id: params?.channelId,
    },
  });

  //checking if the user is member of this channel or not....if a user directly navigates throught the url then they might enter the channel conversation
  const member = await db.member.findFirst({
    where: {
      serverId: params.id,
      profileId: profile.id,
    },
  });

  if (!channel || !member) return redirect("/");

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
      <ChatHeader
        serverId={channel.serverId}
        name={channel.name}
        type="channel"
      />

      <ChatMessages
        member={member} // passing my details( logged in user details to render in the chat )
        name={channel.name} // channel name to display #welcome to channel
        type="channel"
        apiUrl="/api/messages" //endpoint for loading the messages
        socketUrl="/api/socket/messages" //endpoint for creating new messages
        socketQuery={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
        chatId={channel.id}
        paramValue={channel.id} //passing channel id to fetch this channels chat
        paramKey="channelId" //passing the channels type as we are using same chat message for channel and conversation with particular
      />

      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
      />
    </div>
  );
}
