const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({

    name: { type: String, required: true },
    flatNo: { type: Number, required: true },
    phoneNumber: { type: Number, required: true },
    role: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);
module.exports = User;