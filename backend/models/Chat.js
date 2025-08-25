const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    sneder: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    receiver: {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    message:{type:String, required:true},
    createdAt:{type:Date, default: Date.now}
});

module.exports = mongoose.model("Message",messageSchema);
