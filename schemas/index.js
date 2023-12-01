const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

const connect = () => {
  mongoose
    .connect(process.env.MONGODB_ADDR)
    .then(() => console.log("MongoDB 연결 완료"))
    .catch((err) => console.error(err));
};

module.exports = connect;
