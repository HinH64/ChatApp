import express from "express";
import dotenv from "dotenv";

import authRouters from "./routes/auth.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body) 

app.use("/api/auth", authRouters);

app.listen(PORT, () => {
    connectToMongoDB();
    console.log('Server Running on port ' + PORT);
}
);