let mongoose = require("mongoose");

let menuSchema = require({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

let menu = mongoose.model(menuSchema);

module.exports = menu;
