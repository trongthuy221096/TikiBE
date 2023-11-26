const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false, required: true },
  phone: { type: String },
  address: { type: String },
  gender: { type: String },
  avatar: { type: String },
  quoctich: { type: String },
  birthday: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
userSchema.pre("save", function (next) {
  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 7);
  if (this.isNew) {
    this.createdAt = currentTime;
    this.updatedAt = currentTime;
  }
  next();
});

userSchema.pre("findOneAndUpdate", function (next) {
  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 7);
  this.set({ updatedAt: currentTime });
  next();
});
const User = mongoose.model("User", userSchema);
module.exports = User;
