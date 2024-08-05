import { Server as NetServer } from "http";

import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIo } from "@/types";
import { NextRequest } from "next/server";
import { NextApiRequest } from "next";

// preventing the default parsing of the incoming request body as next js automatically parses the request body , because socket io handles the req body that have messages or any files by itself
export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextRequest, res: NextApiResponseServerIo) => {
  //checking if the io instance is already created and attached to the server socket or not
  if (!res.socket.server.io) {
    //path for socket connection,  specifies the endpoint path where the Socket.IO server will listen for incoming connections.
    const path = "/api/socket/io";

    //get the http server from the res
    const httpServer: NetServer = res.socket.server as any;

    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });
    // Attach the Socket.IO server to the HTTP server
    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
