import middleware from "../middleware/index.mjs";
import * as controller from "../controller/auth.controller.mjs";
import express from "express";
let router = express.Router();

router.use(function (req, res, next) {
	res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
	next();
});

router.post(
	"/signup",
	[middleware.checkDuplicateUsernameOrEmail],
	controller.signup
);

router.post("/signin", controller.signin);

router.post("/signout", controller.signout);

export default { router };
