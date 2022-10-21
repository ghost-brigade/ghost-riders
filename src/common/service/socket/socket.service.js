import {createServer} from "http";
import {Server} from "socket.io";

class SocketService {
  httpServer;
  io;

  constructor() {
    this.httpServer = createServer();
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*",
      }
    });

    this.listen();
  }

  listen() {
    this.httpServer.listen(3000);
  }
}

export default new SocketService().io;
