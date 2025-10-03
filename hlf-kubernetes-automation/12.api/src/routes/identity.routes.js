const Router = require("express");
const {
  registerIdentity,
  reenrollIdentity,
} = require("../controllers/identity.controller.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// route to add new identity
router.route("/addIdentity").post(registerIdentity);
// route to add bulk certificates
router.route("/reenrollIdentity").post(reenrollIdentity);

module.exports = router;
