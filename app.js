import express from "express";
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
    res.send("API is running...");
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});