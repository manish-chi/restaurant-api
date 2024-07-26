let mongoose = require("mongoose");
let validator = require("validator");

let restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
    validate: function (val) {
      return validator.isMobilePhone(val);
    },
  },
  open: {
    type: Number,
    min: 0,
    max: 23,
    required: true,
  },
  close: {
    type: Number,
    min: 0,
    max: 23,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["veg", "non-veg", "tiffins"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  ratingsAverage: {
    type: Number,
    set: (val) => Math.round(val * 10) / 10,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  location: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: [Number],
    address: String,
    description: String,
  },
  photo: {
    type: String,
    validate: function (val) {
      return validator.isURL(val);
    },
  },
});

let Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
