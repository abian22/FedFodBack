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

  const sendMessage = async (req, res) => {
    try {
      const { transmitter, receptor, message } = req.body;
  
      const newChat = new Chat({
        transmitter: transmitter,
        receptor: receptor,
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
