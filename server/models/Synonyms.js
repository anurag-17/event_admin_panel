const mongoose = require("mongoose");

const synonymsSchema = new mongoose.Schema(
  {
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory", // Reference to the subcategory model
      default: null,
    },
    title: {
      type: String,
      unique: true,
    },
    childSubCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory", // Reference to the subcategory model
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Synonyms = mongoose.model("Synonyms", synonymsSchema);

module.exports = Synonyms;
