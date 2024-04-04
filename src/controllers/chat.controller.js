const Chat = require("../models/chat.model");

const getMessages = async (req, res) => {
  try {
    const userId = req.params.userId; 

    const receivedChats = await Chat.find({ receiver: userId });

    const sentChats = await Chat.find({ sender: userId });

    const allChats = receivedChats.concat(sentChats);
    const reversedChats = allChats.reverse();

    res.status(200).json(allChats);
  } catch (error) {
    // En caso de error, pasa el control al middleware de manejo de errores
  }
}
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
