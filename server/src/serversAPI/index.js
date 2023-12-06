import express from "express";
let router = express.Router();
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import fs from "fs";
import * as path from "path";
import { generateUniqueNumber } from "../helper/randomID.js";
import { db } from "../../config/db.js";

router.get("/list/", (req, res) => {
	const query = "SELECT * FROM servers";
	db.all(query, [], (err, rows) => {
		if (err) {
			console.error(err.message);
		} else {
			res.json(rows);
		}
	});
});

router.get("/:serverid/channels/", (req, res) => {
	const serverId = req.params.serverid;
	db.all("SELECT * FROM channels WHERE server_id = ?", [serverId], (err, rows) => {
		if (err) {
			console.error(err.message);
		} else {
			res.json(rows);
		}
	});
});

router.post("/create", upload.single("img"), (req, res) => {
	const serverId = generateUniqueNumber();
	const name = req.body.name;
	const img = req.file;
	const img_name = `${serverId}.jpg`;
	const general_channel_id = generateUniqueNumber();
	const general_voice_id = generateUniqueNumber();
	const img_path = path.join(global.__dirname, "../public/img/") + img_name;
	const img_cdn_path = `http://localhost:3300/public/img/${img_name}`;
	fs.writeFileSync(img_path, img.buffer);

	db.run(
		`INSERT INTO servers (server_name, server_id, img) VALUES (?, ?, ?)`,
		[name, serverId, img_cdn_path],
		function (err) {
			if (err) {
				return console.error(err.message);
			}

			db.run(
				`INSERT INTO channels (server_id, channel_name, type, channel_id) VALUES (?, 'General 3444', 1, ?), (?, 'General 535', 2, ?)`,
				[serverId, general_channel_id, serverId, general_voice_id],
				function (err) {
					if (err) {
						return console.error(err.message);
					}

					console.log(`A new server has been added with ID ${serverId}, and the owner has been added.`);
					console.log(`Standard channels 'general' and 'general' (voice) have been created.`);
				}
			);
		}
	);

	res.json({ server_id: serverId, general_channel_id });
});

export default router;
