const express = require("express")
const router = express.Router()

router.use("/user", require("./user.route"))
router.use("/video", require("./video.route"))
router.use("/google", require("./google.route"))
router.use("/comment", require("./comment.route"))

module.exports = router