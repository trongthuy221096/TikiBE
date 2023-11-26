const mongoose = require("mongoose");
const moment = require("moment-timezone");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number },
    rating: { type: Number, required: true },
    description: { type: String },
    discount: { type: Number },
    selled: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

productSchema.pre("save", function (next) {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 7);
    if (this.isNew) {
        this.createdAt = currentTime;
        this.updatedAt = currentTime;
    }
    next();
});

productSchema.pre("findOneAndUpdate", function (next) {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 7);
    this.set({ updatedAt: currentTime });
    next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
