import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
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

export default User;
