import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  type: {
    type: String,
    default: "imBack",
  },
  value: {
    type: String,
    required: true,
    unique: true,
  },
});

const menuModel = mongoose.model("mainchatmenu", menuSchema);

export default menuModel;
