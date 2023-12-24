import config from "../config/auth.config.mjs";
import { db } from "../../../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "path"
import fs from "fs"
import { generateUniqueNumber } from "../../helper/randomID.js";

const signup = (req, res) => {
	const user = new (function () {
		(this.username = req.body.username),
			(this.email = req.body.email),
			(this.alias = req.body.alias),
			(this.user_id = generateUniqueNumber()),
			(this.img_name = `${this.user_id}.jpg`);
		(this.password = bcrypt.hashSync(req.body.password, 8)),
			(this.img_cdn_path = `https://localhost:3300/public/img/user/${this.img_name}`);
		this.img_path = path.join(global.__dirname, "../public/img/user/") + this.img_name;
		this.uploadImage = function () {
			fs.writeFileSync(this.img_path, req.file.buffer);
		};
	})();

	console.log(user);
	if (req.file) {
		user.uploadImage();
	} else {
		user.img_cdn_path = ""
	}

	const insertQuery =
		"INSERT INTO users (username, alias, email, password, img, user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
	db.run(
		insertQuery,
		[user.username, user.alias, user.email, user.password, user.img_cdn_path, user.user_id],
		function (err) {
			if (err) {
				res.status(500).json({ message: err.message });
				return;
			}
			console.log("Successfully inserted");

			const token = jwt.sign({ id: user.user_id }, config, {
				expiresIn: 86400,
			});

			res.status(200).send({
				message: {
					token: token,
					username: user.username,
					alias: user.alias
				},
			});
		}
	);
};

const signin = (req, res) => {
	const insertQuery = "SELECT * FROM users WHERE username = ?";
	db.get(insertQuery, [req.body.username], (err, user) => {
		console.log("db.get", user, err);
		if (err) {
			console.log(err);
			res.status(500).json({ message: err.message });
			return;
		}

		if (!user) {
			return res.status(404).send({ message: "User Not found." });
		}

		const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

		if (!passwordIsValid) {
			return res.status(401).send({
				accessToken: null,
				message: "Invalid Password!",
			});
		}

		const token = jwt.sign({ id: user._id }, config, {
			expiresIn: 86400, // 24 hours
		});

		res.status(200).send({
			message: {
				token: token,
				username: user.username,
				alias: user.alias
			},
		});
	});
};

const signout = async (req, res) => {
	try {
		req.session = null;
		return res.status(200).send({ message: "You've been signed out!" });
	} catch (err) {
		this.next(err);
	}
};

export { signup, signin, signout };
