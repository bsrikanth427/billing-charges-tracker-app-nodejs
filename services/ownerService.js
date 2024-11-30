const OwnerModel = require("../models/owners");


let saveOwner = async (ownerObj) => {
    console.log("Inside ownerService's addOwner");
    try {
        // Save the new owner document to the database
        const newOwner = new OwnerModel(ownerObj);
        console.log("Owner is about to be saved:", newOwner);
        const savedOwner = await newOwner.save();
        console.log("Owner saved successfully:", savedOwner);
        return savedOwner;
    } catch (error) {
        console.error("Error while saving owner:", error);
        throw new Error(`Failed to save owner: ${error.message}`);
    }
}

let updateOwner = async (ownerObj) => {
    console.log("Inside ownerService's UpdateOwner");
    try {
        // Use findByIdAndUpdate to update or create the document
        const updatedOwner = await OwnerModel.findByIdAndUpdate(
            ownerObj.ownerId, // _id is ownerId
            ownerObj,
            { new: true } // `new: true` returns the updated doc
        );
        console.log(`Owner is going to be updated to db:`, updatedOwner);
        return updatedOwner; // Return the updated document if needed
    } catch (error) {
        console.error("Error updating Owner:", error.message);
        throw error;
    }
}

let fetchAllOwners = async () => {
    console.log("Inside ownerService's FetchAllOwners");
    try {
        // Fetch all owners from the database
        const owners = await OwnerModel.find().sort({ flatNo: 1 }); // Sort by `flatNo` in ascending order
        console.log("Owners fetched successfully:", owners);
        return owners;
    } catch (error) {
        console.error("Error while fetching owners:", error);
        throw new Error(`Failed to fetch owners: ${error.message}`);
    }
};

let deleteOwnerById = async (ownerId) => {
    console.log("Inside ownerService's deleteOwnerById", ownerId);
    try {
        const result = await OwnerModel.deleteOne({ _id: ownerId });
        if (result.deletedCount === 0) {
            console.warn("No owner found with the provided ID:", ownerId);
            return { statusCode: 404, message: "Owner not found for ID " };
        }
        console.log("Owner deleted successfully:", ownerId);
        return { statusCode: 200, message: "Owner deleted successfully" };
    } catch (error) {
        console.error("Error deleting owner:", error);
        return { statusCode: 500, message: `Failed to delete owner: ${error.message}` };
    }
};

module.exports = { saveOwner, updateOwner, fetchAllOwners, deleteOwnerById };