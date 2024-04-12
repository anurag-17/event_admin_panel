const SubCategory = require("../models/subCategory");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const Event = require("../models/Event");

exports.createSubCategory = async (req, res) => {
  try {
    const { category, subCategory } = req.body;

    const existingSubCategory = await SubCategory.findOne({
      category,
      subCategory: { $regex: new RegExp(`^${subCategory}$`, "i") },
    });

    if (existingSubCategory) {
      return res
        .status(409)
        .json({ error: "SubCategory must be unique within the category" });
    }

    const newSubCategory = await SubCategory.create(req.body);
    res.json(newSubCategory);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.subCategory) {
      return res
        .status(409)
        .json({ error: "SubCategory must be unique within the category" });
    }
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateSubCategory = async (req, res) => {
  const { id } = req.body;
  validateMongoDbId(id);

  try {
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedSubCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    // After updating the SubCategory, update the category in all Events that have this subCategory
    const eventsUpdated = await Event.updateMany(
      { subCategory: updatedSubCategory._id }, // filter to match events with this subCategory
      { $set: { category: updatedSubCategory.category } } // set the new category
    );

    res.json({
      updatedSubCategory,
      eventsUpdated: eventsUpdated.nModified // number of events updated
    });
  } catch (error) {
    console.error("Error updating subcategory and events: ", error);
    res.status(500).json({ message: "Internal server error" });
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
    const deleteCategorys = await SubCategory.deleteMany({
      _id: { $in: CategoryIds },
    });
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
    const totalPages = itemsPerPage
      ? Math.ceil(totalSubCategories / itemsPerPage)
      : 1;

    const skip = itemsPerPage ? (currentPage - 1) * itemsPerPage : 0;

    const getallSubCategory = await SubCategory.find(query)
      .collation({ locale: "en", strength: 2 })
      .sort({ subCategory: 1 })
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

exports.getSubCategoryByCatId = async (req, res) => {
  try {
    console.log(req.params);
    // Assume categories are passed as a comma-separated string in the URL, e.g., /api/subcategories?categories=5f8d0401c28e5a486434f234,5f8d0401c28e5a486434f235
    const categories = req.query.categories.split(','); // Split the string into an array of IDs

    // Validate each category ID
    categories.forEach(category => {
      validateMongoDbId(category);
    });

    // Find subcategories that match any of the category IDs in the array
    const getSubCategories = await SubCategory.find({ category: { $in: categories } }).populate('category');
    
    if (!getSubCategories.length) { // Check if the result array is empty
      return res.status(404).json({ success: false, message: "No data found" });
    }

    return res.status(200).json({ success: true, getSubCategories });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
