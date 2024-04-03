const router = require("express").Router()
const {
  sendMessage,
  getMessages,
} = require("../controllers/chat.controller.js");
const { checkAuth } = require("../middleware/auth");

router.get("/:transmitter",  getMessages);
router.post("/sendMessage", checkAuth, sendMessage);

module.exports = router;
