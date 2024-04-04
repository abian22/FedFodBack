const Chat = require("../models/chat.model");

const getMessages = async (req, res) => {
  try {
    const currentUser = res.locals.user.id;
    const otherUserId = req.params.id;

    const receivedChat = await Chat.find({
      receiver: otherUserId,
      sender: currentUser ,
    });
    const sentChat = await Chat.find({
      sender: currentUser,
      receiver: otherUserId,
    });
    console.log(otherUserId)

    const allChats = receivedChat
      .concat(sentChat)
      .sort((a, b) => a.createdAt - b.createdAt);
    console.log(allChats)
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
