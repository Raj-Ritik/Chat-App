import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    // if there is no token
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }
    // if there is token, then we need to decode it beacuse it contain userid, email, password etc
    // we need to verify this token from the cookie with the private key we had process.env.JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // if decoded is a falsy value 
    if (!decoded) {
      res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // we will find user in the database
    const user = await User.findById(decoded.userId).select("-password");//no need to send back password to the client
    // if user not found in the database 
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    // now if we passed all the above cases then it mean that the user is authenticated
    // add user to the req
    req.user = user;

    next(); // next is used to call the function if protectRoute (user is authenticated) is done successfully
  } catch (error) {
    console.log("Error in protectRoute Middleware :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}