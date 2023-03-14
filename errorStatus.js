const statusError = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

const statusSucces = {
  CREATED: 201,
};

module.exports = {
  statusError, statusSucces,
};
