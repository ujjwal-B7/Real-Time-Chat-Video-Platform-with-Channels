import { useSocket } from "@/components/providers/SocketProvider";
import { Member, Message, Profile } from "@prisma/client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    // socket instance to update the message in real time
    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      /* 
      react query by default caches the data
       ** so before updating the particular message , we are confirming that the message is in right format, if not then update will be failed
       ** the [queryKey] below represents the particular  chat messages
       ** oldData is the object which is in format oldData.pages.items
            {"pages": [
              {
                "items": [
                  {
                    "id": "1",
                    "content": "Hello!",
                    "createdAt": "2024-01-01T00:00:00Z",
                    "updatedAt": "2024-01-01T00:00:00Z",
                    "member": {
                      "id": "1",
                      "profile": {
                        "id": "1",
                        "name": "User1"
                      }
                    }
                  },
                ]
            }
      */
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              if (item.id === message.id) {
                return message;
              }
              return item;
            }),
          };
        });
        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    //socket instance to create the message in real time
    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };
        }

        const newData = [...oldData.pages];

        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };
        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [queryClient, addKey, updateKey, socket, updateKey]);
};
