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
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
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
      eventsUpdated: eventsUpdated.nModified, // number of events updated
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
    const getaCategory = await SubCategory.findOne({ _id: id, disable: false }).populate("category");

    if (!getaCategory) {
      return res.status(404).json({ message: 'SubCategory not found or is disable' });
    }
    res.json(getaCategory);
  } catch (error) {
    throw new Error(error);
  }
};

exports.getallSubCategory = async (req, res) => {
  try {
    const { page, limit, searchQuery } = req.query;

    const currentPage = parseInt(page, 10) || 1;
    const itemsPerPage = parseInt(limit, 10) || 100; // default to 10 if undefined

    let query = { disable: false }; // Only fetch subcategories that are not disable

    if (searchQuery) {
      query.name = { $regex: new RegExp(searchQuery, "i") }; // Assuming the field to search on is 'name'
    }

    const totalSubCategories = await SubCategory.countDocuments(query);
    const totalPages = itemsPerPage ? Math.ceil(totalSubCategories / itemsPerPage) : 1;

    const skip = itemsPerPage ? (currentPage - 1) * itemsPerPage : 0;

    const allSubCategories = await SubCategory.find(query)
      .collation({ locale: "en", strength: 2 }) // Handles case insensitivity for non-regex queries as well
      .sort({ name: 1 }) // Sort by 'name' field assuming that's what you mean by 'subCategory'
      .skip(skip)
      .limit(itemsPerPage)
      .populate("category");

    res.status(200).json({
      current_page: currentPage,
      total_pages: totalPages,
      total_items: totalSubCategories,
      subCategories: allSubCategories,
    });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSubCategoryByCatId = async (req, res) => {
  try {
    console.log('Received params:', req.params);
    let categories;
    if (req.params.category) {
      categories = req.params.category.includes(",")
        ? req.params.category.split(",")
        : [req.params.category];
      console.log('Categories array:', categories);
    } else {
      console.error('No categories provided');
      return res
        .status(400)
        .json({ success: false, message: "No categories provided" });
    }

    categories.forEach((category) => {
      try {
        validateMongoDbId(category);
      } catch (error) {
        console.error('Invalid category ID:', category, error);
        return res.status(400).json({ success: false, message: "Invalid category ID: " + category });
      }
    });

    const getSubCategories = await SubCategory.find({
      category: { $in: categories },
      disable: false 
    }).populate("category");

    console.log('SubCategories found:', getSubCategories);

    if (!getSubCategories.length) {
      console.log('No subcategories found for provided categories');
      return res.status(200).json({ success: false, message: "No data found" });
    }

    return res.status(200).json({ success: true, getSubCategories });
  } catch (error) {
    console.error('Error in processing request:', error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};



