const router = require("express").Router()
const {
  createUser,
  getAllUsers,
  getMe,
  getOneUser,
  updateUser,
  updateMe,
  deleteUser,
  deleteMe
} = require("../controllers/user.controller")

const { checkAuth, checkAdmin } = require("../middleware/auth")

const { login, signUp } = require("../controllers/auth.controller")

router.get("/", checkAuth, checkAdmin, getAllUsers) //checked
router.get("/me", checkAuth, getMe) //checked
router.get("/:username", checkAuth, getOneUser) //checked
router.post("/", checkAuth, checkAdmin, createUser) //checked
router.post("/signUp", signUp) //checked
router.post("/login", login) //checked
router.put("/me", checkAuth, updateMe) //checked
router.put("/:id", checkAuth, checkAdmin, updateUser) //checked
router.delete("/me", checkAuth, deleteMe) //checked
router.delete("/:id", checkAuth, checkAdmin, deleteUser) //checked


module.exports = router
