import { Server as NetServer } from "http";

import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIo } from "@/types";
import { NextRequest } from "next/server";
import { NextApiRequest } from "next";

// export const bodyParser = false;

// export const GET = async (req: NextApiRequest, res: NextResponseServerIo) => {
//   if (!res.socket.server.io) {
//     const path = "/api/socket";
//     const httpServer: NetServer = res.socket.server as any;
//     const io = new ServerIO(httpServer, {
//       path: path,
//       addTrailingSlash: false,
//     });
//     res.socket.server.io = io;
//   }
//   res.end();
// };

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextRequest, res: NextResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
