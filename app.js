const express = require("express");
const app = express();

//cookie-parser settings
const cookieParser = require("cookie-parser");

//env setting
const dotenv = require("dotenv");
dotenv.config();

//mongoose server connect
const connect = require("./schemas/index.js");
connect();

//router middleware setting
const mainRouter = require("./routes/index.js");

//cors settings;
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/api", mainRouter);

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
