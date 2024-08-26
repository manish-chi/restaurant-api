const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { passwordChangedAt } = require("../controllers/authController");

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
  },
  passwordConfirm: {
    type: String,
    select: false,
  },
  passwordChangedAt: {
    type: Date,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetTokenExpires: {
    type: Date,
    select: false,
  },
  role: {
    type: String,
    required: true,
    enum: {
      values: ["user", "admin", "agent"],
      message: "role could be `user`,`admin`,`agent`",
    },
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.compareSamePasswords = async function (updatedPassword) {
  return this.password === (await bcrypt.hash(updatedPassword, 12));
};

userSchema.methods.createResetToken = async function () {
  let resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.comparePasswords = async function (
  userPassword,
  requestPassword
) {
  return await bcrypt.compare(requestPassword, userPassword);
};

let User = mongoose.model("DD-User", userSchema);

module.exports = User;
