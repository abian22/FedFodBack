const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const commentSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    commentedVideo: {
      type: ObjectId,
      ref:"Video"
    },
    commentedBy: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    replies: {
        type: Number,
        default:0
    }, //Not sure about replies field
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [{
      type: ObjectId,
      ref: "User",
   }]
  },
  { timestamps: true }
)
module.exports = mongoose.model("Comment", commentSchema)
