import jwt from "jsonwebtoken";

export default function adminAuth(req, res) {
  // Retrieve the access token from the request headers or cookies
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the access token and extract the user data
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Check if the user is an admin
    if (user.userid !== 1) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Handle the request for the admin result page
    // Only authenticated admin users will reach this point
    // ...

    return res.status(200).json({ message: "Success" });
  } catch (error) {
    return res.status(403).json({ message: "Forbidden" });
  }
}
module.exports = authenticateToken;