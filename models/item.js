const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    creditPrice:{type:Number, required:true},
    cashPrice:{type:Number, required:true},
    description:{
        type:String,
        required:true
    },
    imagePath:{type:String,default:''},
    category:{type:String, required:true}

});

module.exports = mongoose.model('Item',itemSchema);