import MessageRepository from "../repository/message.repository.js";

class MessageService {

  constructor(repository = null) {
    this.repository = repository ?? new MessageRepository();
  }

  /**
   * Add a message to a channel
   * @param {Object} message
   * @param {Int} channelId
   * @param {Object} user
   * @returns {Promise<void>}
   */
  async add({message, channelId, user}) {
    const newMessage = await this.repository.create({
      message: message,
      channelId: channelId,
      userId: user.id,
    });

    if (message === null) {
      throw new Error("Message not created");
    }

    return newMessage;
  }
}

export default MessageService;
