import jwt from "jsonwebtoken";
import config from "../config/auth.config.mjs";

const verifyToken = (req, res, next) => {
	let token = req.session.token;
	if (!token) {
		return res.status(403).send({ message: "No token provided!" });
	}

	jwt.verify(token, config, (err, decoded) => {
		if (err) {
			return res.status(401).send({ message: "Unauthorized!" });
		}
		req.userId = decoded.id;
		next();
	});
};

const authJwt = {
	verifyToken,
};
export { authJwt };
