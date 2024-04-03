const Chat = require("../models/chat.model");

const getMessages = async (req, res) => {
    try {
      const { receptorId } = req.params;
      const userId = req.user.id; 
      const messages = await Chat.find({ transmitter: userId, receptor: receptorId }).sort({ createdAt: -1 });
      res.json(messages);
    } catch (error) {
      console.error("Error al obtener los mensajes:", error);
      res.status(500).json({ error: "Error al obtener los mensajes" });
    }
  };

const sendMessage = async (transmitter, receptor, messageContent) => {
  try {
    const newChat = new Chat({
      transmitter: transmitter,
      receptor: receptor,
      message: messageContent,
    });

    await newChat.save();
    console.log("Mensaje guardado en la base de datos");

    return newChat;
  } catch (error) {
    console.error("Error al guardar el mensaje:", error);
    throw error;
  }
};

module.exports = {
  sendMessage,
  getMessages
};
