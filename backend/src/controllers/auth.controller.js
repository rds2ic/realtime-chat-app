import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, username, email, password } = req.body;
  try {
    // Peformding data validation on the password length
    if (!fullName || !email | !password | !username) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      // Returning a 400 error response
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ message: "Email is already associated with an account." });

    const userN = await User.findOne({ username });
    if (userN)
      return res
        .status(400)
        .json({ message: "Username is already associated with an account." });

    const salt = await bcrypt.genSalt(10); // Making our salt for the hash
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      friends: [],
      friend_requests: [],
    });

    if (newUser) {
      // Once we have succesfully made a new user we can generate a jwt (json web token) to acknowledge the account
      generateToken(newUser._id, res); // generating our new token
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic,
        friends: [],
        friend_requests: [],
      });
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    console.log("Error in signup controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" }); // 500 means server error
  }
};

export const login = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (username) {
      user = await User.findOne({ username });
    }
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect)
      return res.status(400).json({ message: "Invalid Credentials" });

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      friends: user.friends,
      friend_requests: user.friend_requests,
    });
  } catch (error) {
    console.log("Error in signup controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out succesfully" });
  } catch (error) {
    console.log("Error in signup controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic)
      return res.status(400).json({ message: "Profile picture is required" });

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ); // applying new as true means it returns the updated user instead of the old one which is done by default

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
