const userModel = require("../models/users");

async function saveUser(userObj) {
    console.log("Inside userService's saveUser");
    try {
        const newUser = new userModel(userObj);
        console.log("User is about to be saved:", newUser);
        const savedUser = await newUser.save();
        console.log("User saved successfully:", savedUser);
        return savedUser;
    } catch (error) {
        console.error("Error while saving user:", error);
        throw new Error(`Failed to save user: ${error.message}`);
    }
}

async function fetchUserByUserName(userName) {
    console.log("Inside userService's fetchUserByUserName", userName);
    try {
        const user = await userModel.findOne({ username: userName });
        if (user === null) {
            console.log("User not found with the provided userName:", userName);
            return { statusCode: 404, message: "User not found for userName " };
        }
        console.log("User fetched successfully:", user);
        return user;
    }
    catch (error) {
        console.error("Error while fetching user:", error);
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}

async function updateUser(userObj) {
    console.log("Inside userService's updateUser");
    try {
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: userObj._id },
            { $set: userObj },
            { new: true }
        );
        console.log("User is going to be updated to db:", updatedUser);
        return updatedUser;
    } catch (error) {
        console.error("Error updating user:", error.message);
        throw error;
    }
}

async function fetchAllUsers() {
    console.log("Inside userService's fetchAllUsers");
    try {
        const users = await userModel.find().sort({ userName: 1 });
        console.log("Users fetched successfully:", users);
        return users;
    } catch (error) {
        console.error("Error while fetching users:", error);
        throw new Error(`Failed to fetch users: ${error.message}`);
    }
}

async function deleteUserByUserName(userName) {
    console.log("Inside userService's deleteUserByUserName", userName);
    try {
        const result = await userModel.deleteOne({ username: userName });
        if (result.deletedCount === 0) {
            console.warn("No user found with the provided userName:", userName);
            return { statusCode: 404, message: "User not found for userName " };
        }
        console.log("User deleted successfully:", userName);
        return { statusCode: 200, message: "User deleted successfully" };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { statusCode: 500, message: `Failed to delete user: ${error.message}` };
    }
}

module.exports = { saveUser, fetchUserByUserName, fetchAllUsers, deleteUserByUserName, updateUser };