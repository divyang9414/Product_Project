const mongoose = require("mongoose");

const extraCategorySchema = new mongoose.Schema({
    title: String,
    category: String,
    subcategory: String,
    extracategory: String,
    price: Number,
    discount: Number,
    image: String
})

const extraCategoryModel = mongoose.model("extraCategorySchema", extraCategorySchema);

module.exports = {extraCategoryModel};