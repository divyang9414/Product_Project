const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    // title: String,
    category: String,
    subcategory: String,
    extracategory: String,
    // price: Number,
    // discount: Number,
    // image: String,
    subCategorySchema: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategorySchema",
    }],
    extraCategorySchema:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "extraCategorySchema",
    }]
})

const productModel = mongoose.model("Product", productSchema);

module.exports = {productModel};