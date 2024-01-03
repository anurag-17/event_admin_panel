const express = require("express");
const router = express.Router();

const {
  createCategory,
  updateCategory,
  deleteCategory,
  deleteBulkCategory,
  getCategory,
  getallCategory,
} = require("../controllers/category");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/createCategory", isAuthenticatedUser, authorizeRoles("admin"), createCategory);

router.put("/updateCategory", isAuthenticatedUser, authorizeRoles("admin"), updateCategory);

router.delete("/deleteCategory", isAuthenticatedUser, authorizeRoles("admin"), deleteCategory);

router.post("/deleteBulkCategory", isAuthenticatedUser, authorizeRoles("admin"), deleteBulkCategory);

router.post("/getCategory", getCategory);

router.get("/getallCategory", getallCategory);

module.exports = router;
