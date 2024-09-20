const mongoose = require("mongoose");
const sendMail = require("../utils/mailer");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

let orderSchema = mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: "DD-User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  items: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Menu",
      required: true,
    },
  ],
});

orderSchema.virtual("name", {
  ref: "Menu",
  foreignField: "_id",
  localField: "items",
});

orderSchema.pre("save", function (next) {
  this.populate({
    path: "restaurant",
    select: "-v",
  });

  next();
});

orderSchema.post("save", async function (doc) {
  var user = await User.findById({ _id: this.customer });
  console.log(user);
  console.log("==============");
  console.log(doc);

  let options = {
    email: user.email,
    subject: `Your Order(${doc._id}) has been confirmed @ ${this.restaurant.name}`,
    message: `Hi ${user.name}👋, Your Order has been confirmed.  \nTime : ${this.createdAt}`,
  };

  try {
    sendMail(options);
  } catch (err) {
    throw new AppError(err.statusCode, err.message);
  }
});

let Order = mongoose.model("Order", orderSchema);

module.exports = Order;
