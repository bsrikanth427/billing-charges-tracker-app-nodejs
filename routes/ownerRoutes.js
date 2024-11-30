const express = require("express");
const router = express.Router();
const { saveOwner, updateOwner, fetchAllOwners, deleteOwnerById } = require("../services/ownerService");  // Import the function


router.post("/owners", async (req, res) => {
    try {
        console.log("add-owners-request ", req.body);
        let savedOwner = await saveOwner(req.body);
        if (savedOwner) {
            res.status(201).json({
                message: `Owner added`,
                data: savedOwner,
            });
        }
    } catch (error) {
        console.error("error saving owners ", error);
        res.status(500).json({
            message: "Owner adding failed",
            data: error.message,
        });
    }
});

router.put("/owners/:id", async (req, res) => {

    try {
        console.log("update-owners-request ", req.body);
        let updatedOwner = await updateOwner(req.body);
        if (updatedOwner) {
            res.status(200).json({
                message: `Owner have been updated`,
                data: updatedOwner,
            });
        }
    } catch (error) {
        console.error("error updating owners ", error);
        res.status(500).json({
            message: "Error updating owner",
            data: error.message,
        });
    }
});

router.get("/owners", async (req, res) => {

    try {
        console.log("get-owners-request: ", req);
        const owners = await fetchAllOwners();
        if (owners) {
            res.status(200).json({
                message: `List of Owners`,
                data: owners,
            });
        }
    } catch (error) {
        console.error("error fetching owners ", error);
        res.status(500).json({
            message: "Error fetching owners",
            data: error.message,
        });
    }


})

// Delete owner by ID
router.delete("/owners/:id", async (req, res) => {
    try {
        console.log("delete-owner-by-id request");
        const { id } = req.params;
        const result = await deleteOwnerById(id); // Assume this function exists
        res.status(result.statusCode).json({ message: result.message, id });
    } catch (error) {
        console.error("Error deleting owner:", error);
        res.status(500).json({ message: "Internal server error", data: error.message });
    }
});

module.exports = router;

