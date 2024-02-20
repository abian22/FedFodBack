const router = require("express").Router()
const {
  postMyComment,
  getComments,
  getCommentsOfMedia,
  deleteMyComment,
  deleteComment,
  updateMyComment,
  updateComment
} = require("../controllers/comment.controller")

const { checkAuth, checkAdmin } = require("../middleware/auth")

router.get("/", checkAuth, checkAdmin, getComments) //checked
router.get("/:mediaId", checkAuth, getCommentsOfMedia) //checked
router.post("/:mediaId", checkAuth, postMyComment) //checked
router.delete("/:commentId", checkAuth, checkAdmin, deleteComment) //checked
router.delete("/:mediaId/:commentId", checkAuth, deleteMyComment) //checked
router.put("/myComment/:commentId", checkAuth, updateMyComment) //checked
router.put("/:commentId", checkAuth, checkAdmin, updateComment) //checked

module.exports = router
