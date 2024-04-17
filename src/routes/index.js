const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    res.send("¡Hola desde la ruta principal!");
  });
  

router.use("/user", require("./user.route"))
router.use("/media", require("./media.route"))
router.use("/google", require("./google.route"))
router.use("/comment", require("./comment.route"))
router.use("/notification", require("./notification.route"))
router.use("/chat", require("./chat.route"))
router.use("/payment", require("./payment.route"))

module.exports = router