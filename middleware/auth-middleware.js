const jwt = require("jsonwebtoken");

const User = require("../schemas/users.js");

module.exports = async (req, res, next) => {
  const { permission } = req.cookies;

  const [permission_type, permission_token] = (permission ?? "").split(" ");

  if (!permission_token || permission_type !== "Bearer") {
    res.status(403).json({ errorCode: "A001" });
    return;
  }

  try {
    const { userId } = jwt.verify(permission_token, process.env.PRIVATE_KEY);

    const user = await User.findById(userId);

    res.locals.user = user;

    next();
  } catch (error) {
    res.status(403).json({ errorMessage: "인증에 실패하셨습니다." });
    return;
  }
};
