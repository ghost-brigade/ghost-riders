//import AuthentificationMiddleware from "../security/middleware/authentification.middleware.js";
import ChatBotController from "./controller/chatbot.controller.js";

const slug = "/chatbot";

export default {
  'chatbot': {
    path: slug,
    method: 'post',
    controller: ChatBotController.chatbot,
    roles: [],
    middlewares: []
  },
};
