const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/ApiError.js");
const jwt = require("jsonwebtoken");

const generateToken = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    throw new ApiError(400, "E001", "All fields are required!");
  }
  // checking credentials
  if (
    username !== process.env.TOKEN_USERNAME ||
    password !== process.env.TOKEN_PASSWORD
  ) {
    throw new ApiError(401, "E007", "Unauthorized Access - Wrong Credentials!");
  }

  // generating token
  const authToken = jwt.sign(
    {
      username: username,
      password: password,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );

  if (!authToken) {
    throw new ApiError(500, "E005", "Token Generation Failed!");
  }

  const options = {
    secure: true,
  };

  res.status(200).json({ username, authToken, message: "Token Granted!" });
});

module.exports = { generateToken };
