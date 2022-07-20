
const  jwt = require('express-jwt');

module.exports = jwt({ secret: "SecretServer", algorithms: ['HS256'] });
