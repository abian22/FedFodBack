const router = require("express").Router()
const {
  uploadMyVideo,
  deleteMyVideo,
  getVideos,
  getMyVideos,
  getSomeoneVideos,
  deleteVideo,
  uploadVideo,
  deleteAll,
  updateMyVideo,
  updateVideo,
  randomVideo
} = require("../controllers/video.controller")

const { checkAuth, checkAdmin } = require("../middleware/auth")

router.get("/", checkAuth, getVideos) //checked
router.get("/randomVideo", checkAuth, randomVideo)
router.get("/me", checkAuth, getMyVideos) //checked
router.post("/", checkAuth, uploadMyVideo) //checked
router.get("/:userId", checkAuth, getSomeoneVideos) //checked
router.post("/:userId", checkAuth, checkAdmin, uploadVideo) //checked
router.put("/:videoId", checkAuth, checkAdmin, updateVideo)
router.put("/me/:videoId", checkAuth, updateMyVideo) //checked
router.delete("/all", checkAuth, checkAdmin, deleteAll) //checked
router.delete("/me/:videoId", checkAuth, deleteMyVideo) //checked
router.delete("/:videoId", checkAuth, checkAdmin, deleteVideo) //checked


module.exports = router
