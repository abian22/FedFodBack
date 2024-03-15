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

async function searchUsers(req, res) {
  try {
    const regex = new RegExp(req.body.username, "i");
    const users = await User.find(
      { username: regex },
      { username: 1, profileImg: 1 }
    );

    if (!users || users.length === 0) {
      return res.status(404).send("No users found");
    } else {
      return res.status(200).json(users);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error searching users: " + error.message });
  }
}

async function getMe(req, res) {
  try {
    const user = await User.findById(res.locals.user.id);
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

const getOneUser = async (req, res) => {
  try {
    const identifier = req.params.identifier;

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);

    let user;

    if (isObjectId) {
      user = await User.findById(identifier);
    } else {
      user = await User.findOne({ username: identifier });
    }

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

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
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser && existingUser._id.toString() !== res.locals.user.id) {
      return res.status(400).json({ error: "Email already in use" });
    }
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
  searchUsers,
  getMe,
  getOneUser,
  createUser,
  updateUser,
  updateMe,
  deleteUser,
  deleteMe,
  deleteAllUsers,
};
