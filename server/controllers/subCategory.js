const SubCategory = require("../models/subCategory");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

exports.createSubCategory = async (req, res) => {
  try {
    const { category, subCategory } = req.body;

    const existingSubCategory = await SubCategory.findOne({
      category,
      subCategory: { $regex: new RegExp(`^${subCategory}$`, "i") },
    });

    if (existingSubCategory) {
      return res.status(409).json({ error: "SubCategory must be unique within the category" });
    }

    const newSubCategory = await SubCategory.create(req.body);
    res.json(newSubCategory);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.subCategory) {
      return res.status(409).json({ error: "SubCategory must be unique within the category" });
    }
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateSubCategory = async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);
  try {
    const updatedCategory = await SubCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCategory);
  } catch (error) {
    throw new Error(error);
  }
};

exports.deleteSubCategory = async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);
  try {
    const deletedCategory = await SubCategory.findByIdAndDelete(id);
    res.json(deletedCategory);
  } catch (error) {
    throw new Error(error);
  }
};

exports.deleteBulkSubCategory = async (req, res) => {
  try {
    const { CategoryIds } = req.body;
    const deleteCategorys = await SubCategory.deleteMany({ _id: { $in: CategoryIds } });
    res.json(deleteCategorys);
  } catch (error) {
    throw new Error(error);
  }
};

exports.getSubCategory = async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);
  try {
    const getaCategory = await SubCategory.findById(id).populate("category");
    res.json(getaCategory);
  } catch (error) {
    throw new Error(error);
  }
};

exports.getallSubCategory = async (req, res) => {
  try {
    const { page, limit, searchQuery } = req.query;

    const currentPage = parseInt(page, 10) || 1;
    const itemsPerPage = parseInt(limit, 10) || undefined;

    let query = {};

    if (searchQuery) {
      query.subCategory = { $regex: new RegExp(searchQuery, "i") };
    }

    const totalSubCategories = await SubCategory.countDocuments(query);
    const totalPages = itemsPerPage ? Math.ceil(totalSubCategories / itemsPerPage) : 1;

    const skip = itemsPerPage ? (currentPage - 1) * itemsPerPage : 0;

    const getallSubCategory = await SubCategory.find(query)
      .skip(skip)
      .limit(itemsPerPage)
      .populate("category");

    res.status(200).json({
      current_page: currentPage,
      total_pages: totalPages,
      total_items: totalSubCategories,
      subCategories: getallSubCategory,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};