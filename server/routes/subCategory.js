const express = require("express");
const router = express.Router();

const { createSubCategory, updateSubCategory, deleteSubCategory, deleteBulkSubCategory,getSubCategory, getallSubCategory, getSubCategoryByCatId } = require("../controllers/subCategory");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/createSubCategory",isAuthenticatedUser, authorizeRoles("admin"),  createSubCategory);

router.put("/updateSubCategory",isAuthenticatedUser, authorizeRoles("admin"),  updateSubCategory);

router.delete("/deleteSubCategory",isAuthenticatedUser, authorizeRoles("admin"),  deleteSubCategory);

router.post("/deleteBulkSubCategory", isAuthenticatedUser, authorizeRoles("admin"), deleteBulkSubCategory);

router.post("/getSubCategory", getSubCategory);

router.get("/getallSubCategory", getallSubCategory);
router.get("/getbycategoryId/:category", getSubCategoryByCatId)

module.exports = router;
