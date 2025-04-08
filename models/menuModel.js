import mongoose from "mongoose";
import Formatter from '../utils/formatter.js';

let foodSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["veg", "non-veg", "drink"],
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Beverages",
      "Starters",
      "Main Course",
      "Breads",
      "Biryani",
      "Tandoor",
      "Tiffins",
    ],
  },
  restaurants: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Restaurant",
    },
  ],
  description: {
    type: String,
    required: true,
  },
  price_in_INR: {
    type: Number,
    required: true,
    min: 10,
  },
});

foodSchema.pre(/^find/, function (next) {
  this.populate({
    path: "restaurants",
    select: "-__v",
  });
  
  next();
});


let food = new mongoose.model("foods", foodSchema);

export default food;
