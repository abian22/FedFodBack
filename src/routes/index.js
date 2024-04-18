const express = require("express")
const router = express.Router()


router.use("/user", require("./user.route"))
router.use("/media", require("./media.route"))
router.use("/comment", require("./comment.route"))
router.use("/notification", require("./notification.route"))
router.use("/chat", require("./chat.route"))
router.use("/payment", require("./payment.route"))

module.exports = router