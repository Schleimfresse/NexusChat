import * as controller from "../controller/auth.controller.mjs";
import express from "express";
import multer from "multer";
import middleware from "../middleware/index.mjs";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
let router = express.Router();

router.use(function (req, res, next) {
	res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
	next();
});

router.post("/signup", [middleware.checkDuplicateUsernameOrEmail, upload.single("img")], controller.signup);

router.post("/signin", controller.signin);

router.post("/signout", controller.signout);

export default router;
