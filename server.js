import dotenv from "dotenv";

if(process.env.NODE_ENV !== "production") {
    dotenv.config();
}

import express from "express";
const app = express();
import expressLayouts from "express-ejs-layouts";
import bodyParser from "body-parser";

import { dirname } from 'path';
import {fileURLToPath} from 'url';

import indexRouter from "./routes/index.js";
import itemRouter from "./routes/items.js";

import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", error => console.log(error));
db.once("open", () => console.log("Connection successful"));

app.use("/", indexRouter);
app.use("/items", itemRouter);



app.listen(process.env.PORT || 3000);