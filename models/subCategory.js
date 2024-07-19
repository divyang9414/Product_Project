const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
    // title: String,
    category: String,
    subcategory: String,
    // extracategory: String,
    // price: Number,
    // image: String,
    extraCategorySchema:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "extraCategorySchema",
    }
})

const subCategoryModel = mongoose.model("subCategorySchema", subCategorySchema);

module.exports = {subCategoryModel};