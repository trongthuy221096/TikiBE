const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const TypeProduct = mongoose.model("TypeProduct", userSchema);
module.exports = TypeProduct;
