class ApiError extends Error {
  constructor(statusCode, errorCode, result = "Something went wrong!") {
    super(result);
    this.statusCode = statusCode;
    this.data = null;
    this.errorCode = errorCode;
    this.success = false;
    this.result = result;
  }
}

module.exports = { ApiError };
