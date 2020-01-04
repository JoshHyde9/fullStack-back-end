const jwt = require("jsonwebtoken");

function checkTokenSetUser(req, res, next) {
  const authHeader = req.get("authorization");
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
          console.error(err);
        }
        req.user = user;
        next();
      });
    } else {
      next();
    }
  } else {
    next();
  }
}

module.exports = {
  checkTokenSetUser
};
