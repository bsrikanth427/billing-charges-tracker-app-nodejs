require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const expenseRoutes = require("./routes/expenseRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const fundsRoutes = require("./routes/fundsRoutes");
const maintainanceRoutes = require("./routes/maintainanceRoutes");



const app = express();

// Middleware to parse JSON
app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {

    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_APP_URL);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200); // Send OK status for OPTIONS requests
    }
    next();
});

app.get("/", (req, res) => res.send("Express on Vercel"));

// Routes
app.use("/api", expenseRoutes);
app.use("/api", ownerRoutes);
app.use("/api", fundsRoutes);
app.use("/api", maintainanceRoutes);


// MongoDB Connection
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB Atlas");
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB Atlas:", error);
    });

// Server
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;