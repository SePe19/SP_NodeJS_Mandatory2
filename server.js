import dotenv from "dotenv";

if(process.env.NODE_ENV !== "production") {
    dotenv.config();
}

import express from "express";
const app = express();
import expressLayouts from "express-ejs-layouts";
import { dirname } from 'path';
import {fileURLToPath} from 'url';
import indexRouter from "./routes/index.js";
import mongoose from "mongoose";

app.set("view-engine", "ejs");
app.set("views", dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", error => console.log(error));
db.once("open", () => console.log("Connection successful"));

app.use("/", indexRouter);

const __filename = fileURLToPath(import.meta.url);
console.log(__filename);
const __dirname = dirname(__filename);
console.log(__dirname);

app.listen(process.env.PORT || 3000);