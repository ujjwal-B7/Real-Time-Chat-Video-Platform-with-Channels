"use client";

import { ServerWithMembersAndProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import ActionToolTip from "../ActionToolTip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/useModalStore";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersAndProfiles;
}

export default function ServerSection({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p
        className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400
        "
      >
        {label}
      </p>

      {/* Ceate channel by admin or guest  */}
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionToolTip label="Create Channel" side="right">
          <button
            onClick={() => onOpen("createChannel", { channelType })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </ActionToolTip>
      )}

      {/* managing members by admin */}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionToolTip label="Manage Members" side="right">
          <button
            onClick={() => onOpen("members", { server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Settings className="w-4 h-4" />
          </button>
        </ActionToolTip>
      )}
    </div>
  );
}
