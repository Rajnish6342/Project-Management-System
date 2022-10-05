const createErrorResponse = (ex, res) => {
  const { statusCode = 400, message } = ex;
  return res.status(statusCode).json({
    status: 'FAIL',
    statusCode,
    message,
  });
};

const generateJsonResponse = (response, responseStatusCode, responseStatusMessage) => {
  const responseData = response || [];
  return {
    data: responseData,
    statusCode: responseStatusCode,
    statusMessage: responseStatusMessage,
  };
};

module.exports = {
  createErrorResponse,
  generateJsonResponse,
};
