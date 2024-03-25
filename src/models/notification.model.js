const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const notificationSchema = new mongoose.Schema(
  {
    notifiedUserId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    actionUserId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    //   type: {
    //     type: String,
    //     required: true,
    //   },
    message: {
      type: String,
      required: true,
    },
    associatedItemId: {
      type: ObjectId,
      ref: "Media",
    },

    unread: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
