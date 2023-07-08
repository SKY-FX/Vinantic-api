const util = require("util");

const queryAsync = connection => util.promisify(connection.query).bind(connection);

module.exports = queryAsync;