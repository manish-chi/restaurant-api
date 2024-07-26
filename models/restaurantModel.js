let mongoose = require("mongoose");

let restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    type : Number,
    required : true,
  },
  Open :{
    type : Date,
    required : true,
  },
  Close : {
    type : Date,
    required : true,
  }
});

let Restaurant = mongoose.Model(restaurantSchema);

module.exports = Restaurant;
