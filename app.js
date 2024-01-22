import express from "express";
import { config as configDotenv } from "dotenv";
import cors from "cors";
import { connectDb } from "./config/connectDb.js";
import AuthRouter from "./routes/Auth.js";

//dotenv Config
configDotenv();

//App configuration
const app = express();

//Cors Policy
app.use(cors());

//json midleware
app.use(express.json());

//.env Variables
const port = process.env.PORT;
const db_url = process.env.DATABASE_URL;

//DB Connection
connectDb(db_url);

//Server Creating
app.listen(port, () => console.log(`Server running on ${port}`));

//Routes
app.use("/auth", AuthRouter);
