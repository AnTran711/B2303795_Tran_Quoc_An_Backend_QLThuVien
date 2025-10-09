class ApiError extends Error {
  constructor(statusCode, status, message) {
    super();
    this.statusCode = statusCode,
    this.status = status;
    this.message = message;
  }
}

export default ApiError;