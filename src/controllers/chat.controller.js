const Chat = require("../models/chat.model");

const getMessages = async (req, res) => {
    try {
      const { receiverId } = req.params;
      const userId = res.locals.userId; 
      const messages = await Chat.find({ sender: userId, receiver: receiverId }).sort({ createdAt: -1 });
      res.json(messages);
    } catch (error) {
      console.error("Error al obtener los mensajes:", error);
      res.status(500).json({ error: "Error al obtener los mensajes" });
    }
  };

  const sendMessage = async (req, res) => {
    try {
      const { receiver, message } = req.body;
      
      const newChat = new Chat({
        sender: res.locals.user.id,
        receiver: receiver,
        message: message,
      });
  
      await newChat.save();
      console.log("Mensaje guardado en la base de datos");
  
      res.json(newChat);
    } catch (error) {
      console.error("Error al guardar el mensaje:", error);
      res.status(500).json({ error: "Error al guardar el mensaje" });
    }
  };
  
  

module.exports = {
  sendMessage,
  getMessages
};
