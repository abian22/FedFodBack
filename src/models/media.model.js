const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema
const commentSchema = require("./comment.model")


const mediaSchema = mongoose.Schema(
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
    mediaUrl: {
      type:String,
      required:true
    },
    likedBy: [{
      type: ObjectId,
      ref: "User",
      default: [],
    }],
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

module.exports = mongoose.model("Media", mediaSchema)
