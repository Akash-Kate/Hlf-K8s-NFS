const { generateToken } = require("../controllers/auth.controller.js");
const Router = require("express");

const router = Router();

router.route("/token-request").post(generateToken);

module.exports = router;
