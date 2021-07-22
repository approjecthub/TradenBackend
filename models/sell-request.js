const mongoose = require('mongoose');

const sellReqSchema = new mongoose.Schema({
    allItems:{
        itemID: {type:mongoose.Schema.Types.ObjectId, ref:"item", required:true},
        qty:Number
    },
    userName:{type:String, required:true},
    userMail:{type:String, required:true},
    userAddress:{
        address:{type:String, required:true},
        state:{type:String, required:true},
        city:{type:String, required:true},
        zip:{type:Number, required:true},
    },
    paymentType:{type:String, required:true},
    accountDetails:{
        accountNo:Number,
        ifsc:Number
    },
    date:{type:Number, default:new Date().getTime()},
    totalPrice:{type:Number, default:-1}

});

module.exports = mongoose.model('Sell-Request',sellReqSchema);
