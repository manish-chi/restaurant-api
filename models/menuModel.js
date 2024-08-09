let mongoose = require("mongoose");

let menuSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  restaurants : [{
    type : mongoose.Schema.ObjectId,
    ref : 'Restaurant'
  }],
  description : {
    type : String,
    required : true,
  },
  price_in_INR : {
    type : number,
    required : true,
    min:10
  }
});

let menu = new mongoose.model('Menu',menuSchema);

module.exports = menu;