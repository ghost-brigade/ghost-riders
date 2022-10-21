import Express from "./src/http.js";
import config from "./config.js";
import Chatbot from "./src/components/chatbot/chatbot.js";

config.env();

const ExpressServer = new Express();
ExpressServer.start();
const httpServer = ExpressServer.listen();

const chatbot = new Chatbot();
chatbot.start();

process.on(process.env.SIGNAL, () => {
    if (httpServer) {
        httpServer.close(() => {
            console.log('HTTP server closed');
            return httpServer.stop();
        });
    }
});
