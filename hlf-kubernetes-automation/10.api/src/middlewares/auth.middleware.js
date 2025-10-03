const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/ApiError.js");
const jwt = require("jsonwebtoken");

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    let token;

    // Check for Authorization header
    const authHeader = req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7); // Remove "Bearer " prefix
    }

    if (!token) {
      throw new ApiError(
        401,
        "E007",
        "Unauthorized Access! - Please Request a Token."
      );
    }
    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (
      decodedToken.username !== process.env.TOKEN_USERNAME ||
      decodedToken.password !== process.env.TOKEN_PASSWORD
    ) {
      throw new ApiError(401, "E007", "Invalid Access Token!");
    }

    req.username = decodedToken.username;
    next();
  } catch (error) {
    throw new ApiError(401, "E007", error.message || "Invalid Access Token!");
  }
});

module.exports = { verifyJWT };
