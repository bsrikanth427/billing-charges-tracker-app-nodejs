const userModel = require("../models/users");

async function authenticateUser(userName, password) {
    console.log("Inside userService's authenticateUser");
    try {
        const user = await userModel.findOne({ username: userName });
        if (user === null) {
            console.log("User not found with the provided userName:", userName);
            return { statusCode: 404, message: "User not found for userName " };
        }
        if (user.password !== password) {
            console.log("Password mismatch for the provided userName:", userName);
            return { statusCode: 401, message: "Password mismatch for the provided userName " };
        }
        console.log("User login success:", user);
        return user;
    }
    catch (error) {
        console.error("Error while fetching user:", error);
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}

module.exports = { authenticateUser };