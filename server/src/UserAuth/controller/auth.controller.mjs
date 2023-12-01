import config from "../config/auth.config.mjs";
import {db} from "../../../config/db.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const signup = (req, res) => {
	const user = {
		username: req.body.username,
		email: req.body.email,
		alias: req.body.alias,
		password: bcrypt.hashSync(req.body.password, 8),
	};
	console.log(user);
	const insertQuery =
		"INSERT INTO users (username, alias, email, password, friends, created_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
	db.run(insertQuery, [user.username, user.alias, user.email, user.password, ""], function (err) {
		if (err) {
			res.status(500).json({ err: err.message });
			return;
		}
		console.log("Successfully inserted");
	});
};
const signin = (req, res) => {
	lib.database.findOne(
		{
			username: req.body.username,
		},
		(err, user) => {
			if (err) {
				res.status(500).send({ message: err });
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
			let authorities = [];

			for (let i = 0; i < user.roles.length; i++) {
				authorities.push("ROLE_" + user.roles[i].toUpperCase());
			}
			req.session.token = token;
			res.status(200).send({
				message: {
					id: user._id,
					username: user.username,
					email: user.email,
					roles: authorities,
				},
			});
		}
	);
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
