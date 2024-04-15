const router = require("express").Router();
const { payment }  = require ("../controllers/payment.controller")
const { checkAuth, checkAdmin } = require("../middleware/auth");

router.post('/', checkAuth, payment);

module.exports = router;
