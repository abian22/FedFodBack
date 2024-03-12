const multer = require("multer");
const path = require("path");
const Media = require("../models/media.model");
const User = require ("../models/user.model")
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const storage = multer.memoryStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

async function uploadCloudinary(fileBuffer, folder, originalname) {
  try {
    //Convert the file buffer to a base64 string.
    const base64String = Buffer.from(fileBuffer).toString("base64");

    //Get the extension of the original file.
    const fileExtension = path.extname(originalname).toLowerCase();
    let resourceType = "image";

    //If the extension is among those of video files, change the resource type to "video"
    if ([".mp4", ".webm", ".mov"].includes(fileExtension)) {
      resourceType = "video";
    }

    const mimeType =
      resourceType === "video"
        ? "video/mp4"
        : `image/${fileExtension.slice(1)}`;
    const dataURI = `data:${mimeType};base64,${base64String}`;

    //Set up upload options for Cloudinary.
    const uploadOptions = {
      folder: folder || "feedfood",
      resource_type: resourceType,
    };

    const result = await cloudinary.uploader.upload(dataURI, uploadOptions);

    return result;
  } catch (error) {
    console.error("Error during Cloudinary upload:", error);
    console.log("Problematic file:", originalname);
    throw error;
  }
}

function uploadProfileImg(req, res) {
  upload.single("media")(req, res, async function (err) {
    if (err) {
      console.error("Error during media upload:", err);
      return res
        .status(500)
        .json({ error: "Error during media upload", details: err.message });
    }

    const user = res.locals.user;

    if (!user) {
      console.error("User not authenticated");
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Check if the file is an image
    if (req.file && req.file.buffer) {
      const allowedImageExtensions = [".jpg", ".jpeg", ".png", "jfif"];
      const fileExtension = path.extname(req.file.originalname).toLowerCase();

      if (!allowedImageExtensions.includes(fileExtension)) {
        return res.status(400).json({ error: "Invalid image file format" });
      }

      const result = await uploadCloudinary(
        req.file.buffer,
        "profileImg",
        req.file.originalname
      );

      user.profileImg = result.secure_url;

      const newMedia = new Media({
        cloudinaryAssetId: result.asset_id,
        uploadedBy: user._id,
        mediaUrl: result.secure_url,
      });

      try {
        const savedMedia = await newMedia.save();
        console.log("Media saved", savedMedia);
        
        // Guardar la información actualizada del usuario con la nueva imagen
        await user.save();

        return res.json({ message: "Image uploaded", image: savedMedia });
      } catch (error) {
        console.error("Error saving the image:", error);
        return res
          .status(500)
          .json({ error: "Error saving the image", details: error.message });
      }
    } else {
      return res.status(400).json({ error: "No image file provided" });
    }
  });
}

function uploadMyMedia(req, res) {
  upload.single("media")(req, res, async function (err) {
    if (err) {
      console.error("Error during media upload:", err);
      return res
        .status(500)
        .json({ error: "Error during media upload", details: err.message });
    }

    const user = res.locals.user;

    if (!user) {
      console.error("User not authenticated");
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (req.file && req.file.buffer) {
      const result = await uploadCloudinary(
        req.file.buffer,
        "feedfood",
        req.file.originalname
      );
      console.log(result);

      const newMedia = new Media({
        cloudinaryAssetId: result.asset_id,
        uploadedBy: user._id,
        description: req.body.description,
        mediaUrl: result.secure_url,
      });

      try {
        const savedMedia = await newMedia.save();
        console.log("Media saved", savedMedia);
        res.json({ message: "Media uploaded", video: savedMedia });
      } catch (error) {
        console.error("Error saving the media:", error);
        return res
          .status(500)
          .json({ error: "Error saving the media", details: error.message });
      }
    } else {
      return res.status(400).json({ error: "No media file provided" });
    }
  });
}

async function uploadMedia(req, res) {
  upload.single("media")(req, res, async function (err) {
    if (err) {
      console.error("Error during media upload:", err);
      return res
        .status(500)
        .json({ error: "Error during media upload", details: err.message });
    }

    const user = res.locals.user;

    if (!user) {
      console.error("User not authenticated");
      return res.status(401).json({ error: "User not authenticated" });
    }

    //Check if a file is provided, if it contains a data buffer,
    //and call the function to upload to Cloudinary.
    if (req.file && req.file.buffer) {
      const result = await uploadCloudinary(
        req.file.buffer,
        "feedfood",
        req.file.originalname
      );
      console.log(result);

      const userId = req.params.userId;

      const newMedia = new Media({
        uploadedBy: userId,
        cloudinaryAssetId: result.asset_id,
        description: req.body.description,
        mediaUrl: result.secure_url,
      });

      try {
        const savedMedia = await newMedia.save();
        console.log("Media saved", savedMedia);
        res.send("Media uploaded");
      } catch (error) {
        console.error("Error saving the media:", error);
        return res.status(500).json({
          error: "Error saving the media",
          details: error.message,
        });
      }
    }
  });
}

async function getMedias(req, res) {
  try {
    const medias = await Media.find();

    if (!medias) {
      return res.status(404).send("No medias found");
    } else {
      return res.status(200).json(medias);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function getMyMedias(req, res) {
  const user = res.locals.user;

  try {
    const myMedias = await Media.find({ uploadedBy: user._id });
    if (!myMedias) {
      return res.status(404).json({ error: "You have no medias yet" });
    }
    return res.status(200).json(myMedias);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error retrieving your videos", details: error.message });
  }
}

async function getSomeoneMedias(req, res) {
  try {
    const userId = req.params.userId;
    const medias = await Media.find({ uploadedBy: userId });

    if (!medias) {
      return res.status(404).json({ error: "No medias found for this user" });
    }
    return res.status(200).json(medias);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error retrieving medias", details: error.message });
  }
}

async function deleteMyMedia(req, res) {
  const user = res.locals.user;

  try {
    const medias = await Media.findById(req.params.mediaId);
    if (!medias) {
      return res.status(404).json({ error: "Media not found" });
    }

    // Check if there is no authenticated user or if the authenticated user is not the owner of the media
    if (!user || String(medias.uploadedBy) !== String(user._id)) {
      return res.stats(403).json({ error: "You cant delete that media" });
    }

    //Split the media URL into parts using "/" and extract the last part
    //Which contains the media url to be deleted
    const url = medias.mediaUrl.split("/");
    const urlMedia = url[url.length - 1];
    const [publicId] = urlMedia.split(".");
    await cloudinary.uploader.destroy(`feedfood/${publicId}`);

    await medias.deleteOne({ _id: medias._id });
    console.log("media deleted");
    res.json({ message: "media deleted" });
  } catch (error) {
    console.error("error deleting the media", error);
    return res.status(500).json({
      error: "Error deleting the media",
      details: error.message,
    });
  }
}

async function deleteMedia(req, res) {
  try {
    const medias = await Media.findById(req.params.mediaId);

    if (!medias) {
      return res.status(404).json({ error: "Media not found" });
    }
    const url = medias.mediaUrl.split("/");
    const urlMedia = url[url.length - 1];
    const [publicId] = urlMedia.split(".");
    await cloudinary.uploader.destroy(`feedfood/${publicId}`);

    await medias.deleteOne({ _id: medias._id });
    console.log("Media deleted");
    res.json({ message: "Media deleted" });
  } catch (error) {
    console.error("error deleting the media", error);
    return res.status(500).json({
      error: "Error deleting the media",
      details: error.message,
    });
  }
}

async function deleteAll(req, res) {
  try {
    const medias = await Media.find();
    if (!medias) {
      return res.status(404).json({ error: "There are no medias" });
    }

    const mediaUrls = medias.map((media) => media.mediaUrl);
    for (const media of mediaUrls) {
      console.log(media);
      const url = media.split("/");
      const urlMedia = url[url.length - 1];
      const [publicId] = urlMedia.split(".");
      console.log([publicId]);
      await cloudinary.uploader.destroy(`feedfood/${publicId}`);
    }

    for (const media of medias) {
      await media.deleteOne();
    }

    res.json("All medias deleted");
  } catch (error) {
    console.error("Error deleting medias", error);
    return res
      .status(500)
      .json({ error: "Error deleting medias", details: error.message });
  }
}

async function updateMyMedia(req, res) {
  try {
    const userId = res.locals.user.id;
    const mediaId = req.params.mediaId;
    const media = await Media.findById(mediaId);
    const newDescription = req.body.description;

    console.log("console log:", media.uploadedBy);

    if (media.uploadedBy != userId) {
      return res
        .status(403)
        .json({ error: "You are not allowed to update this media" });
    }
    const result = await Media.updateOne(
      { _id: mediaId },
      { $set: { description: newDescription } }
    );

    console.log(`Description updated for media with ID ${mediaId}`);
    return res.json({ message: "Description updated successfully" });
  } catch (error) {
    console.error("Error updating media description", error);
    return res.status(500).json({
      error: "Error updating media description",
      details: error.message,
    });
  }
}

async function updateMedia(req, res) {
  try {
    const mediaId = req.params.mediaId;
    const newDescription = req.body.description;

    const result = await Media.updateOne(
      { _id: mediaId },
      { $set: { description: newDescription } }
    );

    console.log(`Description updated for media with ID ${mediaId}`);
    return res.json({ message: "Description updated successfully" });
  } catch (error) {
    console.error("Error updating media description", error);
    return res.status(500).json({
      error: "Error updating media description",
      details: error.message,
    });
  }
}

let randomMediaArray = [];

async function randomMedia() {
  try {
    const allMedias = await Media.find();
    
    if (allMedias.length === 0) {
      console.log("There are no media files.");
      return [];
    }

    const mediaWithUserData = await Promise.all(
      allMedias.map(async (media) => {
        const user = await User.findById(media.uploadedBy);
        return { media, user };
      })
    );

    randomMediaArray = mediaWithUserData.sort(() => Math.random() - 0.5);

    console.log("Random media generated", randomMediaArray);
    return randomMediaArray;
  } catch (error) {
    console.error("Error fetching the random media list:", error.message);
    return [];
  }
}

module.exports = {
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
  randomMedia,
  uploadProfileImg
};
