const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

exports.createCategory = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCategory);
  } catch (error) {
    throw new Error(error);
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    res.json(deletedCategory);
  } catch (error) {
    throw new Error(error);
  }
};

exports.deleteBulkCategory = async (req, res) => {
  try {
    const { CategoryIds } = req.body;
    const deleteCategorys = await Category.deleteMany({ _id: { $in: CategoryIds } });
    res.json(deleteCategorys);
  } catch (error) {
    throw new Error(error);
  }
};

exports.getCategory = async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);
  try {
    const getaCategory = await Category.findById(id);
    res.json(getaCategory);
  } catch (error) {
    throw new Error(error);
  }
};

exports.getallCategory = async (req, res) => {
  try {
    const { page = 1, limit = 10, searchQuery } = req.query;

    const currentPage = parseInt(page, 10);
    const itemsPerPage = parseInt(limit, 10);

    let query = {};

    if (searchQuery) {
      query.title = { $regex: new RegExp(searchQuery, "i") };
    }

    const totalCategories = await Category.countDocuments(query);
    const totalPages = Math.ceil(totalCategories / itemsPerPage);

    const skip = (currentPage - 1) * itemsPerPage;

    const getallCategory = await Category.find(query)
      .skip(skip)
      .limit(itemsPerPage);

    res.status(200).json({
      current_page: currentPage,
      total_pages: totalPages,
      total_items: totalCategories,
      categories: getallCategory,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};