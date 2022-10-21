import SocketService from "../../common/service/socket/socket.service.js";

class Chatbot {
  socket;

  constructor() {
    this.socket = SocketService;
  }

  start() {
    this.socket.on('connection', (socket) => {
      this.event(socket);
    });
  }

  event(socket) {
    socket.on('response', (data) => {
      //traitement bot ici
      console.log(data);
    });
  }
}

export default Chatbot;

