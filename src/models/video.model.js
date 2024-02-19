const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema
const commentSchema = require("./comment.model")


const videoSchema = mongoose.Schema(
  {
    uploadedBy: {
      type: ObjectId,
      ref: "User",
    },
    cloudinaryAssetId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    videoUrl: {
      type:String,
      required:true
    },
    likes: {
      type: Number,
      default: 0,
    },
    filePath: {
      type: String, 
    },
    // comments: [
    //   {
    //     text: {
    //       type: String,
    //     },
    //   },
    // ],
  },
  { timestamps: true,}
)

module.exports = mongoose.model("Video", videoSchema)
