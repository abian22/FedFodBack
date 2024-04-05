const router = require("express").Router()

const {obtenerVideo} = require("../controllers/streaming.controller")

const { checkAuth } = require("../middleware/auth")


router.get('/streaming', checkAuth, obtenerVideo);
  
  module.exports = router;