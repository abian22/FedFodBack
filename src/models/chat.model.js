const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const chatSchema = new mongoose.Schema(
  {
    transmitter: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    receptor: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
