const Synonyms = require("../models/Synonyms");
const SubCategory = require("../models/subCategory");
const validateMongoDbId = require("../utils/validateMongodbId");

exports.createSynonyms = async (req, res) => {
  try {
    const { parentId, childId } = req.body;

    if (!parentId || !childId) {
      return res
        .status(400)
        .json({ error: "Both subcategory IDs are required." });
    }

    if (
      !mongoose.isValidObjectId(parentId) ||
      !mongoose.isValidObjectId(childId)
    ) {
      return res
        .status(400)
        .json({
          error: "Invalid MongoDB ID provided for one or both subcategories.",
        });
    }

    const [parentSubcategory, childSubcategory] = await Promise.all([
      SubCategory.findById(parentId),
      SubCategory.findById(childId),
    ]);

    if (!parentSubcategory || !childSubcategory) {
      return res
        .status(404)
        .json({ error: "Either parent or child subcategory not found." });
    }

    const newSynonym = await Synonyms.create({
      subCategory: parentSubcategory._id,
      title: childSubcategory.title,
      childSubCategory: childSubcategory._id,
    });

    // Update events associated with the child subcategory
    const updatedEvents = await Event.updateMany(
      { subCategory: childSubcategory._id },
      {
        $set: {
          subCategory: parentSubcategory._id,
          category: parentSubcategory.category, // Assuming subCategory has a category field
        },
      }
    );

    // Disable the child subcategory
    await SubCategory.findByIdAndUpdate(childSubcategory._id, {
      disable: true,
      category: parentSubcategory.category,
    });
    return res.status(200).json({
      success: true,
      message:
        "Synonym created, events updated, and child subcategory disable successfully.",
      newSynonym,
      updatedEvents: updatedEvents.nModified, // Number of events updated
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.editSynonym = async (req, res) => {
  try {
    const { synonymId } = req.params;
    const { newChildId } = req.body;

    if (!synonymId || !newChildId) {
      return res
        .status(400)
        .json({
          error: "Synonym ID and new child subcategory ID are required.",
        });
    }

    if (
      !mongoose.isValidObjectId(synonymId) ||
      !mongoose.isValidObjectId(newChildId)
    ) {
      return res
        .status(400)
        .json({
          error:
            "Invalid MongoDB ID provided for synonym or new child subcategory.",
        });
    }

    const synonym = await Synonyms.findById(synonymId)
      .populate("childSubCategory")
      .populate("subCategory");
    if (!synonym) {
      return res.status(404).json({ error: "Synonym not found." });
    }

    // Check if childId has actually changed
    if (
      synonym.childSubCategory &&
      synonym.childSubCategory?._id?.toString() === newChildId
    ) {
      return res
        .status(400)
        .json({ message: "New child ID is the same as the current one." });
    }

    // Fetch both the current and new child subcategories in parallel
    const [currentChildSubcategory, newChildSubcategory] = await Promise.all([
      SubCategory.findById(
        synonym.childSubCategory ? synonym.childSubCategory._id : null
      ),
      SubCategory.findById(newChildId),
    ]);

    if (!newChildSubcategory) {
      return res
        .status(404)
        .json({ error: "New child subcategory not found." });
    }

    // Update the old child subcategory to re-enable it
    if (currentChildSubcategory) {
      await SubCategory.findByIdAndUpdate(currentChildSubcategory._id, {
        disable: false,
      });

      // Update events linked to the old child subcategory to revert changes
      await Event.updateMany(
        { subCategory: synonym.subCategory._id },
        {
          $set: {
            subCategory: synonym.childSubCategory._id,
            category: synonym.childSubCategory.category,
          },
        }
      );
    }

    // Update the synonym to link to the new child subcategory
    // you won't encounter a typical error as long as you assign a valid MongoDB ObjectId string.
    //  Mongoose handles the dereferencing automatically when you save the document.
    synonym.childSubCategory = newChildId;
    await synonym.save();

    // Disable the new child subcategory
    await SubCategory.findByIdAndUpdate(newChildId, { disable: true });

    // Update events associated with the new child subcategory
    await Event.updateMany(
      { subCategory: newChildId },
      {
        $set: {
          subCategory: synonym.subCategory._id,
          category: synonym.subCategory.category,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Synonym updated successfully and subcategories adjusted.",
      synonym,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getAllSynonyms = async (req, res) => {
  try {
    // Default pagination parameters and search term
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const search = req.query.search || "";

    // Building a search query for a regex search on the title field, case-insensitive
    const searchQuery = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    // Find synonyms with pagination and search, and also count the total documents for pagination
    const [synonyms, total] = await Promise.all([
      Synonyms.find(searchQuery)
        .sort({ title: 1 }) // Sorting by title in ascending order
        .skip((page - 1) * limit)
        .limit(limit),
      Synonyms.countDocuments(searchQuery),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: synonyms,
      total,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getSynonymById = async (req, res) => {
  try {
    const { id } = req.params; // Extracting the ID from request parameters

    // Validate MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const synonym = await Synonyms.findById(id)
      .populate("subCategory")
      .populate("childSubCategory");

    if (!synonym) {
      return res.status(404).json({ error: "Synonym not found" });
    }

    res.status(200).json({
      success: true,
      data: synonym,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getSynonymsByParentId = async (req, res) => {
  try {
    const { parentId } = req.params; // Extracting the parent ID from request parameters

    // Find synonyms associated with the provided parent category ID
    const synonyms = await Synonyms.find({ subCategory: parentId })
      .populate("subCategory")
      .populate("childSubCategory");

    res.status(200).json({
      success: true,
      data: synonyms,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
