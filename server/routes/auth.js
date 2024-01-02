const express = require('express');
const router = express.Router();
// const upload = require("../utils/uploadImage"); // Import the upload middleware
const {
  register,
  login,
  adminLogin,
  logout,
  forgotPassword,
  resetPassword,
  getallUser,
  getaUser,
  getUserById,
  deleteaUser,
  updatedUser,
  updatePassword,
} = require("../controllers/auth");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/login").post(login);

router.route("/adminLogin").post(adminLogin);

router.route("/logout").get(logout);

// Create User
router.route("/register").post(register);

// Update User Password
router.post("/updatePassword", isAuthenticatedUser, updatePassword);

// Update User
router.put("/edit-user", isAuthenticatedUser, updatedUser);

// Get all Users
router.get("/all-users",  getallUser);

// Get a User
router.route("/getaUser").get(isAuthenticatedUser, getaUser);

// Get user by ID 
router.route("/getUserById").post(isAuthenticatedUser, getUserById);

// Delete a user
router.delete("/deleteaUser/:id", deleteaUser);

router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resetToken").put(resetPassword);

// Uploading images
// router.post("/upload", upload.array("images", 5), (req, res) => {

//   // Check if files were uploaded successfully
//   if (!req.files || req.files.length === 0) {
//     return res.status(400).json({ error: "No files uploaded." });
//   }

//   // Get the uploaded image URLs from Cloudinary
//   const imageUrls = req.files.map((file) => file.path);

//   // You can save these image URLs to your product model or perform other actions as needed

//   res.status(200).json({ imageUrls });
// });

module.exports = router;