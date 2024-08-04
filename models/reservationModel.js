let mongoose = require('mongoose');


let reservationSchema = mongoose.Schema({
    datetime : {
        type : Date,
        required : true,
    },
    user : {
        type :  mongoose.Schema.ObjectId,
        ref : 'DD-User',
        required : [true,"a reservation has to be made by the user"]
    },
    restaurant:{
        type : mongoose.Schema.ObjectId,
        ref : 'Restaurant',
        required : [true,"a reservation must have associated restaurant"]
    }
});

reservationSchema.pre(/^find/,function(next){
    this.populate({
        path : 'user',
        select : '-v',
    }).populate({
        path : 'restaurant',
        select : "-v",
    });
    next();
});

let Reservation = new mongoose.model("Reservation",reservationSchema);

module.exports =  Reservation;