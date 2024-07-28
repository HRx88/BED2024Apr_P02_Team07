const User = require("../models/Account");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving users");
  }
};

const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving user");
  }
};

const createUser = async (req, res) => {
  const newUser = req.body;
  try {
    const createdUser = await User.createUser(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user");
  }
};

const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const newUserData = req.body;

  try {
    // Check if the password is being updated
    if (newUserData.password) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newUserData.password, salt);
      
      // Replace the password in newUserData with the hashed password
      newUserData.password = hashedPassword;
    }

    const updatedUser = await User.updateUser(userId, newUserData);
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
};

const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const success = await User.deleteUser(userId);
    if (!success) {
      return res.status(404).send("User not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting user");
  }
};


async function registerAccount(req, res) {
  const { username, password, contactNumber ,
    email ,role } = req.body;

  try {
    // Validate user data
    const validationErrors = ValidateUserData(username, password,contactNumber,email);
    if (validationErrors.length > 0) {
      return res
        .status(400)
        .json({ message: "Invalid Account data", errors: validationErrors });
    }

    // Check for existing username
    const existingUser = await User.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in database
    const user = await User.createUser(username, hashedPassword,contactNumber,email, role);
    return res.status(201).json(user);

    //return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
function ValidateUserData(username, password,contactNumber,email) {
  const errors = [];
  if (!username || username.trim() === "") {
    errors.push("Username is required");
  }

  if (!password || password.trim() === "") {
    errors.push("Password is required");
  } else if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!contactNumber || contactNumber.trim() === "") {
    errors.push("contactNumber is required");
  } else if (contactNumber.length < 8) {
    errors.push("contactNumber must be  8 digit long");
  }

  if (!email || email.trim() === "") {
    errors.push("email is required");
  } else {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      errors.push("Invalid email format");
    }
  }

  return errors;
}
async function login(req, res) {
  const { username, password } = req.body;

  try {
    // Validate user credentials
    const user = await User.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      id: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "3600s",
    }); // Expires in 1 hour

    return res.status(200).json({ token,user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}


const getCourse = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await User.getCourse(userId);
    if (!user) {
      return res.status(404).send("Data not found");
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data");
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  registerAccount,
  login,
  getCourse,
};
