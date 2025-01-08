const express = require("express");
const router = express.Router();
const { saveUser, fetchUserByUserName, fetchAllUsers, updateUser, deleteUserByUserName } = require("../services/userService");

router.post("/users", async (req, res) => {
    try {
        console.log("add-users-request ", req.body);
        let savedUser = await saveUser(req.body);
        if (savedUser) {
            res.status(201).json({
                message: `User added`,
                data: savedUser,
            });
        }
    } catch (error) {
        console.error("error saving users ", error);
        res.status(500).json({
            message: "User adding failed",
            data: error.message,
        });
    }
});

router.get("/users/:userName", async (req, res) => {
    try {
        const { userName } = req.params;
        console.log("fetch-user-by-userName request: " + userName);
        const user = await fetchUserByUserName(userName);
        if (user) {
            res.status(200).json({
                message: `User for the userName: ${userName}`,
                data: user,
            });
        } else {
            res.status(404).json({
                message: `User for the userName: ${userName} not found`,
                data: user,
            });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error", data: error.message });
    }
});

router.put("/users/:userName", async (req, res) => {
    try {
        console.log("update-users-request ", req.body);
        const updatedUser = await updateUser(req.body);
        if (updatedUser) {
            res.status(200).json({
                message: `User updated`,
                data: updatedUser,
            });
        }
    } catch (error) {
        console.error("error updating users ", error);
        res.status(500).json({
            message: "User updating failed",
            data: error.message,
        });
    }
});

router.get("/users", async (req, res) => {
    try {
        console.log("fetch-all-users-request ");
        const users = await fetchAllUsers();
        if (users) {
            res.status(200).json({
                message: `List of users`,
                data: users,
            });
        }

    } catch (error) {
        console.error("error fetching users ", error);
        res.status(500).json({
            message: "Error fetching users",
            data: error.message,
        });
    }

});

router.delete("/users/:userName", async (req, res) => {
    try {
        console.log("delete-users-by-userName request");
        const { userName } = req.params;
        const result = await deleteUserByUserName(userName);
        res.status(result.statusCode).json({ message: result.message, userName });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error", data: error.message });
    }

});

module.exports = router;
