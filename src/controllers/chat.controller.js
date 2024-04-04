const Chat = require("../models/chat.model");

const getMessages = async (req, res) => {
  try {
    const currentUser = res.locals.user.id;
    const otherUserId = req.params.id;

    // Obtener mensajes recibidos y enviados
    const receivedChat = await Chat.find({
      receiver: otherUserId,
      sender: currentUser,
    });
    const sentChat = await Chat.find({
      sender: otherUserId,
      receiver: currentUser,
    });

    // Crear un conjunto (Set) para almacenar mensajes únicos
    const allChatsSet = new Set([...receivedChat, ...sentChat]);

    // Convertir el conjunto de nuevo en un array
    const allChats = Array.from(allChatsSet);

    console.log(allChats);

    // Enviar la respuesta JSON con los mensajes
    res.status(200).json(allChats);
  } catch (error) {
    console.error(error);
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
  getMessages,
};
