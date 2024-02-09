const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const Video = require("../models/video.model");

// const { google } = require('googleapis');
// const { createReadStream } = require("streamifier");
// const storage = multer.memoryStorage();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/")
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname)
    const uniqueName = `${Date.now()}${extension}`
    cb(null, uniqueName)
  },
})

const upload = multer({ storage: storage })

// async function uploadToDrive(fileBuffer, fileName, folderId) {
//   const auth = new google.auth.GoogleAuth({
//     keyFile: 'feedFoodDrive.json',
//     scopes: 'https://www.googleapis.com/auth/drive.file',
//   });

//   const drive = google.drive({ version: 'v3', auth });

//   const fileMetadata = {
//     parents: "https://drive.google.com/drive/folders/1lHANt1BrR4fXgCVcKy-IuJksccYZ906_",
//   };

//   const media = {
//     mimeType: 'application/octet-stream',
//     body: createReadStream(fileBuffer)
//   };

//   try {
//     const response = await drive.files.create({
//       resource: fileMetadata,
//       media: media,
//       fields: 'id',
//     });
//     console.log(response)
//     console.log('File uploaded to Google Drive. File ID:', response.data.id);
//     return response.data.id;
//   } catch (error) {
//     console.error('Error uploading file to Google Drive:', error.message);
//     throw error;
//   }
// }

async function uploadMyVideo(req, res) {
  upload.single("video")(req, res, async function (err) {
    if (err) {
      console.error("Error during video upload:", err);
      return res
        .status(500)
        .json({ error: "Error during video upload", details: err.message });
    }

    const user = res.locals.user;

    if (!user) {
      console.error("User not authenticated");
      return res.status(401).json({ error: "User not authenticated" });
    }

    const newVideo = new Video({
      uploadedBy: user._id,
      description: req.body.description,
    });

    try {
      const savedVideo = await newVideo.save();
      console.log("Video saved", savedVideo);
      res.send("Video uploaded");
    } catch (error) {
      console.error("Error saving the video:", error);
      return res.status(500).json({
        error: "Error saving the video",
        details: error.message,
      });
    }
  });
}


async function uploadVideo(req, res) {
  upload.single("video")(req, res, async function (err) {
    if (err) {
      console.error("Error during video upload:", err);
      return res
        .status(500)
        .json({ error: "Error during video upload", details: err.message });
    }

    const user = res.locals.user;

    if (!user) {
      console.error("User not authenticated");
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.params.userId;

    const newVideo = new Video({
      uploadedBy: userId,
      description: req.body.description,
    });

    try {
      const savedVideo = await newVideo.save();
      console.log("Video saved", savedVideo);
      res.send("Video uploaded");
    } catch (error) {
      console.error("Error saving the video:", error);
      return res.status(500).json({
        error: "Error saving the video",
        details: error.message,
      });
    }
  });
}

async function getVideos(req, res) {
  try {
    const videos = await Video.find();

    if (!videos) {
      return res.status(404).send("No videos found");
    } else {
      return res.status(200).json(videos);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function getMyVideos(req, res) {
  const user = res.locals.user;

  try {
    const myVideos = await Video.find({ uploadedBy: user._id });
    if (!myVideos) {
      return res.status(404).json({ error: "You have no videos yet" });
    }
    return res.status(200).json(myVideos);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error retrieving your videos", details: error.message });
  }
}

async function getSomeoneVideos(req, res) {
  try {
    const userId = req.params.userId;
    const videos = await Video.find({ uploadedBy: userId });

    if (!videos) {
      return res.status(404).json({ error: "No videos found for this user" });
    }
    return res.status(200).json(videos);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error retrieving videos", details: error.message });
  }
}

async function deleteMyVideo(req, res) {
  const user = res.locals.user;

  try {
    const videos = await Video.findById(req.params.videoId);
    if (!videos) {
      return res.status(404).json({ error: "Video not found" });
    }

    if (!user || String(videos.uploadedBy) !== String(user._id)) {
      return res.stats(403).json({ error: "You cant delete that video" });
    }

    if (videos.filePath) {
      try {
        await fs.unlink(videos.filePath);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
    }
    await videos.deleteOne({ _id: videos._id });
    console.log("video deleted");
    res.json({ message: "video deleted" });
  } catch (error) {
    console.error("error deleting the video", error);
    return res.status(500).json({
      error: "Error deleting the video",
      details: error.message,
    });
  }
}

async function deleteVideo(req, res) {
  try {
    const videos = await Video.findById(req.params.videoId);

    if (!videos) {
      return res.status(404).json({ error: "Video not found" });
    }
    if (videos.filePath) {
      try {
        await fs.unlink(videos.filePath);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
    }
    await videos.deleteOne({ _id: videos._id });
    console.log("Video deleted");
    res.json({ message: "Video deleted" });
  } catch (error) {
    console.error("error deleting the video", error);
    return res.status(500).json({
      error: "Error deleting the video",
      details: error.message,
    });
  }
}

async function deleteAll(req, res) {
  try {
    const videos = await Video.find();
    if (!videos) {
      return res.status(404).json({ error: "There are no videos" });
    }
    for (const video of videos) {
      if (video.filePath) {
        try {
          await fs.unlink(video.filePath);
        } catch (unlinkError) {
          console.error("Error deleting file:", unlinkError);
        }
      }
      await video.deleteOne();
    }
    res.json("All videos deleted");
  } catch (error) {
    console.error("Error deleting videos", error);
    return res
      .status(500)
      .json({ error: "Error deleting videos", details: error.message });
  }
}

async function updateMyVideo(req, res) {
  try {
    const userId = res.locals.user.id;
    const videoId = req.params.videoId;
    const video = await Video.findById(videoId);
    const newDescription = req.body.description;

    console.log("console log:", video.uploadedBy);

    if (video.uploadedBy != userId) {
      return res
        .status(403)
        .json({ error: "You are not allowed to update this video" });
    }
    const result = await Video.updateOne(
      { _id: videoId },
      { $set: { description: newDescription } }
    );

    console.log(`Description updated for video with ID ${videoId}`);
    return res.json({ message: "Description updated successfully" });
  } catch (error) {
    console.error("Error updating video description", error);
    return res.status(500).json({
      error: "Error updating video description",
      details: error.message,
    });
  }
}

async function updateVideo(req, res) {
  try {
    const videoId = req.params.videoId;
    const newDescription = req.body.description;

    const result = await Video.updateOne(
      { _id: videoId },
      { $set: { description: newDescription } }
    );

    console.log(`Description updated for video with ID ${videoId}`);
    return res.json({ message: "Description updated successfully" });
  } catch (error) {
    console.error("Error updating video description", error);
    return res.status(500).json({
      error: "Error updating video description",
      details: error.message,
    });
  }
}

let randomVideoList = []; 

async function initializeVideoList() {
  try {
    const allVideos = await Video.find();
    if(!allVideos) {
      console.log("There are no videos")
    }
    randomVideoList = randomVideoListArray(allVideos);

    console.log("Video list initialized and randomized.");
  } catch (error) {
    console.error("Error initializing the video list:", error.message);
  }
}

function randomVideoListArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

async function randomVideo(req, res) {
  try {
    if (randomVideoList.length === 0) {
      initializeVideoList();
      return res.status(404).send("You have already seen all the videos. We are generating a new set.");
    }
    const nextVideo = randomVideoList.pop();
    return res.status(200).json(nextVideo);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

initializeVideoList();




module.exports = {
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
  
};
