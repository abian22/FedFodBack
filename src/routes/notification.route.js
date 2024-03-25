const router = require("express").Router()

const { createNotification, updateNotifications, getNotifications } = require ("../controllers/notification.controller")

const { checkAuth } = require("../middleware/auth")


router.get("/", checkAuth, getNotifications)
router.post("/", checkAuth, createNotification)
router.post("/read", checkAuth, updateNotifications)



module.exports = router