const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../services/loginService");


router.post("/login", async (req, res) => {
    try {
        console.log("login-request ", req.body);
        const user = await authenticateUser(req.body.username, req.body.password);
        if (user) {
            res.status(200).json({
                message: `User authenticated`,
                data: user,
            });
        }
    } catch (error) {
        console.error("error authenticating user ", error);
        res.status(500).json({
            message: "User authentication failed",
            data: error.message,
        });
    }
});

module.exports = router;

