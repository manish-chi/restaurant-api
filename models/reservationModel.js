import mongoose from "mongoose";
import sendMail from "../utils/mailer.js";
import AppError from "../utils/appError.js";

let reservationSchema = mongoose.Schema({
  datetime: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "DD-User",
    required: [true, "a reservation has to be made by the user"],
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: "Restaurant",
    required: [true, "a reservation must have associated restaurant"],
  },
});

reservationSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "user",
      select: "-v",
    },
    {
      path: "restaurant",
      select: "-v",
    },
  ]);

  next();
});

reservationSchema.pre("save", function (next) {
  this.populate([
    {
      path: "user",
      select: "-__v -password",
    },
    {
      path: "restaurant",
      select: "-__v",
    },
  ]);
  next();
});

reservationSchema.post("save", async function (doc) {
  try {
    let options = {
      subject: `Hi ${doc.user.name}👋, Your reservation has been confirmed.  \nTime : ${doc.datetime}`,
      message: `Your Table Reservation has been confirmed @ ${doc.restaurant.name}`,
    };
    await sendMail(options);
  } catch (err) {
    console.log(err);
  }
});

let Reservation = new mongoose.model("Reservation", reservationSchema);

export default Reservation;
