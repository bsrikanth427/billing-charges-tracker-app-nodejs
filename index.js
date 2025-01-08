require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const expenseRoutes = require("./routes/expenseRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const fundsRoutes = require("./routes/fundsRoutes");
const maintainanceRoutes = require("./routes/maintainanceRoutes");
const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes");



const app = express();

// Middleware to parse JSON
app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {

    //res.header("Access-Control-Allow-Origin", process.env.FRONTEND_APP_URL);
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
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
app.use("/api", userRoutes);
app.use("/api", loginRoutes);


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