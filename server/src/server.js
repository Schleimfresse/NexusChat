import express from "express";
import cors from "cors";
import * as path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
import { db } from "../config/db.js";
dotenv.config();

import { randomUUID } from "crypto";
//import UserAuth from "./UserAuth/index.mjs";
const __dirname = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
global.__dirname = __dirname;
const app = express();
const port = process.env.PORT || 3300;
import http from "http";
const server = http.createServer(app);
import serversApi from "./serversAPI/index.js";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public/", express.static(path.join(__dirname, "../public/")));
app.use("/api/servers/", serversApi);
//app.use("/auth", UserAuth);

app.post("/receiveMessage", (req, res) => {
	const { message, user, channel } = req.body;

	const insertQuery =
		"INSERT INTO serverMessages (message, uuid, user, channel, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)";
	db.run(insertQuery, [message, randomUUID(), user, channel], function (err) {
		if (err) {
			res.status(500).json({ err: err.message });
			return;
		}
		console.log("Successfully inserted");
	});
});

app.get("/getMessage", (req, res) => {});

server.listen(port, () => {
	console.log(`server listening at Port: ${port}`);
});
