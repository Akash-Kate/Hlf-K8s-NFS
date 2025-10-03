const Router = require("express");
const {
  addCertificate,
  addBulkCertificate,
  checkCertificate,
} = require("../controllers/certificate.controller.js");
const { verifyJWT } = require("../middlewares/auth.middleware.js");

const router = Router();
//router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// route to add new certificate
router.route("/user/certificateHash").post(addCertificate);
// route to add bulk certificates
//router.route("/bulkCertificateHash").post(addBulkCertificate);
// route to check certificate
router.route("/user/checkcertificate").post(checkCertificate);

module.exports = router;
