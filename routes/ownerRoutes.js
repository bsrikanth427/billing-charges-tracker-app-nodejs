const express = require("express");
const router = express.Router();


router.post("/owners", async (req, res) => {

    try {

        let requestBody = req.body;
        console.log("requestBody ", requestBody);
        let updatedExpenseDoc = {};

        res.status(200).json({
            message: `Owner have been saved/updated`,
            data: updatedExpenseDoc,
        });

    } catch (error) {
        console.error("error saving owners ", error);
        res.status(500).json({
            message: "Error saving or updating owner",
            error: error.message,
        });
    }
});

module.exports = router;

