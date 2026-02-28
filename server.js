import express, { Router } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import apiRoutes from "./routes/routes.js"
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "upload")));

app.use(cors("*"));
app.use(express.json());
app.use("/api", apiRoutes);

app.get("/api/health", (req, res) => {
	res.status(200).json({
		"status": "OK",
		"timestamp": new Date(),
	});
})

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () =>{
            console.log("server starting on http://localhost:", (PORT));
        });
    } catch (error) {
        console.error("failed to start server:", error);
        process.exit(1);
    }
}

startServer();