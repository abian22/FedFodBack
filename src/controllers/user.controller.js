const bcrypt = require("bcrypt");
const User = require("../models/user.model");

async function getAllUsers(req, res) {
  try {
    const users = await User.find();
    console.log(users);
    if (!users) {
      return res.status(404).send("No users found");
    } else {
      return res.status(200).json(users);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error finding users: " + error.message });
  }
}

async function getMe(req, res) {
  try {
    const user = await User.findById(res.locals.user.id);
    console.log(user);
    if (!user) {
      return res.statsu(404).send("No user found");
    }
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error finding user: " + error.message });
  }
}

async function getOneUser(req, res) {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user: user });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error finding user: " + error.message });
  }
}

async function createUser(req, res) {
  try {
    const user = await User.create(req.body);
    if (!user) {
      console.error("Error creating user: User is falsy");
      return res.status(500).send("Failed to create user");
    }
    res.status(201).json({ message: "User created", user: user.username });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).send("Failed to create user");
  }
}

async function updateUser(req, res) {
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ message: "User updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error updating user: " + error.message });
  }
}

async function updateMe(req, res) {
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updated = await User.updateOne(
      { _id: res.locals.user.id },
      { $set: req.body }
    );

    if (updated) {
      return res.status(200).json({ message: "User updated" });
    } else {
      return res.status(404).send("User not found");
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error updating user: " + error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.deleteOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ error: "User delete failed" });
  }
}

async function deleteMe(req, res) {
  try {
    const user = await User.findByIdAndDelete(res.locals.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "User delete failed" + error.message });
  }
}

async function deleteAllUsers(req, res) {
  try {
    const result = await User.deleteMany({});
    console.log("All users deleted:", result);
  } catch (error) {
    console.error("Error deleting users:", error);
  }
}

module.exports = {
  getAllUsers,
  getMe,
  getOneUser,
  createUser,
  updateUser,
  updateMe,
  deleteUser,
  deleteMe,
  deleteAllUsers,
};
