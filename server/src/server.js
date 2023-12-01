import express from "express";
import cors from "cors";
import * as path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
import { db } from "../config/db.js";
dotenv.config();
import { randomUUID } from "crypto";
import UserAuth from "./UserAuth/index.mjs";
const __dirname = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const app = express();
const port = process.env.PORT || 3300;
import http from "http";
const server = http.createServer(app);

const corsOptions = {
	origin: "http://localhost:3300",
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/auth", UserAuth)
app.get("/", (req, res) => {
	res.send("Server running");
});

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
