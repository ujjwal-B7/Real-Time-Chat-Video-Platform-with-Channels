"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import ActionToolTip from "../ActionToolTip";
import { ModalType, useModal } from "@/hooks/useModalStore";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

// here i am storing icon name as a reference so when the icon is selected then the variable Icon is treated as a icon so i rendered Icon component as the icon
const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export const ServerChannel = ({
  channel,
  server,
  role,
}: ServerChannelProps) => {
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  //here icon stores the lucide react icons reference so Icon is treated as a component
  const Icon = iconMap[channel.type];

  // navigating to the respective channel of the server
  const navigateToChannel = () => {
    router.push(`/servers/${server?.id}/channels/${channel.id}`);
  };

  //stop propagation of event to the root button element wrapping the edit and delete channel button
  const stopPropagation = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { channel, server });
  };

  return (
    <button
      onClick={navigateToChannel}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zince-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel.id &&
            "text-primary dark:text-ainc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionToolTip label="Edit">
            <Edit
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => stopPropagation(e, "editChannel")}

              //while doing this it opens up the edit modal but immediately navigates to the page of that channel because we have onClick in button element which is wrapping this edit button so the onClick of button overrides this onclick of this edit button and navigates to the other channel page as in the button we have function to move to the respective channels page based on the channels id

              // onClick={() => onOpen("editChannel", { server, channel })}
            />
          </ActionToolTip>
          <ActionToolTip label="Delete">
            <Trash
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => stopPropagation(e, "deleteChannel")}

              //while doing this it opens up the edit modal but immediately navigates to the page of that channel because we have onClick in button element which is wrapping this edit button so the onClick of button overrides this onclick of this edit button and navigates to the other channel page as in the button we have function to move to the respective channels page based on the channels id

              // onClick={() => onOpen("deleteChannel", { server, channel })}
            />
          </ActionToolTip>
        </div>
      )}
      {channel.name === "general" && (
        <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
};
