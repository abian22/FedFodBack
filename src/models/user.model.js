const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const userSchema = mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
  },
  googleAccessToken: String,
  googleRefreshToken: String,
  googleProfile: {
    type: Object,
    default: {},
  },

  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  profileImg: {
    type: String,
    default: "https://res.cloudinary.com/dimdftrtr/image/upload/d3b5b1811868617a1d266515e0f71b68"
  },
  role: {
    type: String,
    allowNull: true,
    default: "user",
  },
  live: {
    type: Boolean,
    allowNull: false,
    default: false,
  },
  filesUploaded: {
    type: Number,
    allowNull: false,
    default: 0,
  },
  followers: [{type: ObjectId, ref:"User"}],
  following: [{type: ObjectId, ref:"User"}],
},
{
  timestamps:true
}
)

module.exports = mongoose.model("User", userSchema)
