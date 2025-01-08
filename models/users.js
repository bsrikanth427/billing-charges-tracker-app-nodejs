const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        phoneNumber: {
            type: Number,
            required: true,
            unique: true,
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v); // Ensures a 10-digit phone number
                },
                message: (props) => `${props.value} is not a valid phone number!`,
            },
        },
        role: {
            type: String,
            required: true,
            enum: ['Admin', 'User'], // Restricts the role to predefined values
        },
        email: { type: String, required: false },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const User = mongoose.model("User", userSchema);
module.exports = User;
