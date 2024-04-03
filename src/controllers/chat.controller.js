const Chat = require("../models/chat.model");

const getMessages = async (req, res) => {
  try {
    const userId = req.params.userId; // Suponiendo que el ID del usuario se pasa como parámetro en la URL
    
    // Busca todos los chats donde el receptor sea igual al ID de usuario proporcionado
    const receivedChats = await Chat.find({ receiver: userId });

    // Busca todos los chats donde el remitente sea igual al ID de usuario proporcionado
    const sentChats = await Chat.find({ sender: userId });

    // Combina los chats recibidos y enviados en una única lista de chats
    const allChats = receivedChats.concat(sentChats);

    // Devuelve la lista combinada de chats como respuesta
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
