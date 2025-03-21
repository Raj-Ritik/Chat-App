import jwt from "jsonwebtoken"
export const generateToken = (userId, res) => {
  // generating a token 
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d" // 7 days
  });
  // sending token to the user in a cookie and specially an HTTP only cookie so it is a lot more secure and this is going to live 7 days and after 7 days it is going to expire so user have to login once again
  res.cookie("jwt", token, { // cookie name as JWT
    maxAge: 7 * 24 * 60 * 60 * 1000, // millisecond
    httpOnly: true, // prevent xss attack cross-site scripting attacks
    sameSite: "strict", // CSRF attack cross-site request forgery attacks\
    secure: process.env.NODE_ENV !== "development",
  });
  return token;
};