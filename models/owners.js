const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema(
    {
        ownerId: { type: String, unique: true }, // Automatically generated for POST
        name: { type: String, required: true },
        flatNo: { type: Number, unique: true, required: true },
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
            enum: ['Owner', 'Tenant'], // Restricts the role to predefined values
        },
        tenantId: { type: String, required: false },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Pre-save middleware to generate ownerId if it doesn't exist
ownerSchema.pre('save', function (next) {
    if (!this.ownerId) {
        this.ownerId = this._id.toString(); // Use MongoDB's _id as ownerId
    }
    next();
});

module.exports = mongoose.model('Owner', ownerSchema);
