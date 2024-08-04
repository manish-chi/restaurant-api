let mongoose = require("mongoose");
let validator = require("validator");
let bcrypt = require("bcrypt");

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

userSchema.methods.comparePasswords = async function (
  userPassword,
  requestPassword
) {
  return await bcrypt.compare(requestPassword, userPassword);
};

let User = mongoose.model("DD-User", userSchema);

module.exports = User;
