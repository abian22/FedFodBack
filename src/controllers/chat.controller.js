const Chat = require("../models/chat.model");

const getMessages = async (req, res) => {
  try {
    // Verificar si res.locals.user está definido
    if (!res.locals.user) {
      throw new Error("Usuario no autenticado");
    }

    // Acceder al ID del usuario
    const currentUserID = res.locals.user.id;

    // Obtener el ID del otro usuario de los parámetros de la solicitud
    const otherUserId = req.params.id;

    // Buscar mensajes recibidos y enviados entre los dos usuarios
    const receivedChat = await Chat.find({
      receiver: otherUserId,
      sender: currentUserID,
    });
    const sentChat = await Chat.find({
      sender: currentUserID,
      receiver: otherUserId,
    });

    // Concatenar y ordenar los mensajes
    const allChats = receivedChat.concat(sentChat).sort((a, b) => a.createdAt - b.createdAt);

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
