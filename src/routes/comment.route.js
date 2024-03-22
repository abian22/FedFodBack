const router = require("express").Router()
const {
  postMyComment,
  getComments,
  getCommentsOfMedia,
  deleteMyComment,
  deleteComment,
  updateMyComment,
  updateComment,
  updateCommentLikes
} = require("../controllers/comment.controller")

const { checkAuth, checkAdmin } = require("../middleware/auth")

router.get("/", checkAuth, getComments) //checked
router.get("/:mediaId", checkAuth, getCommentsOfMedia) //checked
router.post("/:mediaId", checkAuth, postMyComment) //checked
router.delete("/:commentId", checkAuth, checkAdmin, deleteComment) //checked
router.delete("/:mediaId/:commentId", checkAuth, deleteMyComment) //checked
router.post('/:commentId/like', checkAuth, updateCommentLikes);
router.put("/myComment/:commentId", checkAuth, updateMyComment) //checked
router.put("/:commentId", checkAuth, checkAdmin, updateComment) //checked

module.exports = router
