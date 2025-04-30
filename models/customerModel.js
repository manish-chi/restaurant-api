import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    phoneNumber :{
        type : Number,
        required : true,
    },
    sessionId : {
        type : String,
        required : true,
    },
    deliveryAddress : {
        type : String,
        required : true,
    }
});

const customerModel = mongoose.model('dd-customers',customerSchema);

export default customerModel;