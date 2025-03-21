import User from "../models/user.model.js"
// import user from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }
    const user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({ message: "Email already exist" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword
    })

    if (newUser) {
      // generating jwt token here
      generateToken(newUser._id, res)
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    }
    else {
      return res.status(400).json({ message: "Invalid user data" })
    }

  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" }); // status 500 says something is broken in our part, this is a server error (Internal Error)
  }
}
// verifying user credentials
export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }
    // if user exists, now check whether the password entered is correct or not
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" })
    }
    // if the password is correct then generate token
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
// if user is logging out, then only one thing we need to do is to clear out the cookie
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// To update profile we need a service so that we can upload our image 
// CloudiNary
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    // now we need to check which user want to change profile pic
    const userId = req.user._id;
    // check profile pic provide or not
    if (!profilePic) {
      return res.status(400).jsn({ message: "Profile picture is required" });
    }
    // if profile pic provided then we need to upload it in cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic) // this will uplaod pic to cloudinary which will send a responsethen we can update the user in the database
    // cloudinary is not our database, it is just a bucket for our image we have uploaded
    // we need to update the profile pic in the datatbase for the user 
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updated profile :", error);
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);//send user back to client, this will give you authenticated user
  } catch (error) {
    console.log("Error in checkAuth contoller", error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
}