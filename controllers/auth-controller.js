const jwt = require("jsonwebtoken");

const User = require("../schemas/users.js");

const checkUser = async (req, res) => {
  const { nickname, password } = req.body;
  const user = await User.findOne({ nickname: nickname });

  try {
    if (!user) {
      res.status(412).json({ errorMessage: "유저가 존재하지 않습니다." });
      return;
    }

    if (password !== user.password) {
      res.status(412).json({ errorMessage: "비밀번호가 일치하지 않습니다." });
      return;
    }

    const token = jwt.sign({ userId: user.userId }, process.env.PRIVATE_KEY);

    res.cookie("permission", `Bearer ${token}`, {
      maxAge: 60 * 60 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(201).json({ message: "로그인에 성공하셨습니다" });
  } catch (error) {
    res.status(400).json({ errorMessage: "로그인에 실패하셨습니다." });
  }
};

const createUser = async (req, res) => {
  const { nickname, password } = req.body;

  try {
    const checkNickname = await User.findOne({ nickname: nickname });

    if (checkNickname) {
      res.status(412).json({ errorMessage: "닉네임이 중복되었습니다." });
      return;
    }

    await User.create({ nickname, password });

    res.status(201).json({ message: "회원가입에 성공하셨습니다." });
  } catch (error) {
    res.status(400).json({ errorMessage: "회원가입에 실패하셨습니다." });
  }
};

module.exports = {
  checkUser,
  createUser,
};
