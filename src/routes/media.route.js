const router = require("express").Router()
const {
  uploadMyMedia,
  deleteMyMedia,
  getMedias,
  getMyMedias,
  getSomeoneMedias,
  deleteMedia,
  uploadMedia,
  deleteAll,
  updateMyMedia,
  updateMedia,
  // randomMedia,
  uploadProfileImg,
  handleLikes
} = require("../controllers/media.controller")

const { checkAuth, checkAdmin } = require("../middleware/auth")

router.get("/", checkAuth, getMedias) //checked
router.get("/me", checkAuth, getMyMedias) //checked
// router.get("/randomMedia", checkAuth, randomMedia) //checked
router.get("/:userId", checkAuth, getSomeoneMedias) //checked
router.post("/", checkAuth, uploadMyMedia) //checked
router.post("/profileImg", checkAuth, uploadProfileImg) //checked
router.post("/:userId", checkAuth, checkAdmin, uploadMedia) //checked
router.post("/:mediaId/likes/:userId", checkAuth, handleLikes)
router.put("/me/:mediaId", checkAuth, updateMyMedia) //checked
router.put("/:mediaId", checkAuth, checkAdmin, updateMedia)
router.delete("/all", checkAuth, checkAdmin, deleteAll) //checked
router.delete("/me/:mediaId", checkAuth, deleteMyMedia) //checked
router.delete("/:mediaId", checkAuth, checkAdmin, deleteMedia) //checked


module.exports = router
