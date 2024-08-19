let mongoose = require("mongoose");
const sendMail = require("../utils/mailer");
const userController = require("../controllers/userController");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

let orderSchema = mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  items: [
    {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
  ],
});

orderSchema.post(
  "save",
  catchAsync(async function (doc) {
    var user = await User.findById({ _id: this.customer });
    console.log(user);
    console.log("==============");
    console.log(doc);

    let options = {
      email: user.email,
      subject: `Your Order has been placed! (OrderID : ${doc._id})`,
      message: "Your Order has been placed for Items!",
    };

    try {
      sendMail(options);
    } catch (err) {
      throw new AppError(err.statusCode, err.message);
    }
  })
);

let Order = mongoose.model("Order", orderSchema);

module.exports = Order;
