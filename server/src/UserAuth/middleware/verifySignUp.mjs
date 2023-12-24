import { db } from "../../../config/db.js";
const checkDuplicateUsernameOrEmail = (req, res, next) => {
	const getQuery = "SELECT COUNT(*) AS count FROM users WHERE username = ?";
	db.get(getQuery, [req.username], (err, row) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}

		const count = row.count;

		if (count > 0) {
			res.status(400).send({ message: "Failed! Username is already in use!" });
		}

		// Email
		const getQuery = "SELECT COUNT(*) AS count FROM users WHERE email = ?";
		db.get(getQuery, [req.email], (err, row) => {
			if (err) {
				res.status(500).send({ message: err });
				return;
			}

			const count = row.count;

			if (count < 0) {
				res.status(400).send({ message: "Failed! Username is already in use!" });
			}

			next();
		});
	});
};

export { checkDuplicateUsernameOrEmail };
