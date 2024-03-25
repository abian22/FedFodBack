const Notification = require("../models/notification.model");

async function createNotification(req, res) {
  try {
    const { notifiedUserId, actionUserId, type, message, associatedItemId } =
      req.body;

    if (notifiedUserId === actionUserId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Notified user and action user are the same",
        });
    }

    const newNotification = new Notification({
      notifiedUserId: notifiedUserId,
      actionUserId: res.locals.user.id,
      // type: type,
      message: message,
      associatedItemId: associatedItemId,
    });

    const savedNotification = await newNotification.save();

    res.status(201).json({ success: true, notification: savedNotification });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function readNotifications(userId) {
  try {
    await Notification.updateMany(
      { notifiedUserId: userId },
      { $set: { unread: false } }
    );
    console.log("Documents updated successfully.");
  } catch (error) {
    console.error("Error updating documents:", error);
  }
}

async function updateNotifications(req, res) {
  await readNotifications(res.locals.user.id);
  res.send("Notifications marked as read");
}

async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({
      notifiedUserId: res.locals.user.id,
    });
    res.json({ success: true, notifications });
  } catch (error) {
    console.error("Error retrieving notifications:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  createNotification,
  updateNotifications,
  getNotifications,
};
