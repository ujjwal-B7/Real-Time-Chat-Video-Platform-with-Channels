import { Server as NetServer, Socket } from "net";

import { NextApiResponse } from "next";

import { Server as SocketIoServer } from "socket.io";

import { Server, Member, Profile } from "@prisma/client";

export type ServerWithMembersAndProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

//custom types for socket server
export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIoServer;
    };
  };
};
