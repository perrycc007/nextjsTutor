const express = require("express");
const cors = require("cors");
const register = require("./routes/register");
const login = require("./routes/login");
const apply = require("./routes/apply");
const cases = require("./routes/cases");
const profile = require("./routes/profile");
const tutor = require("./routes/tutor");
const student = require("./routes/student");
const favourite = require("./routes/favourite")
const history = require("./routes/history")
const match = require("./routes/match")
const forgetPassword = require("./routes/forgetPassword")
const app = express();

require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use("/register", register);
app.use("/login", login);
app.use("/apply", apply);
app.use("/cases", cases);
app.use("/tutor", tutor);
app.use("/student", student);
app.use("/profile", profile);
app.use("/favourite", favourite);
app.use("/history", history);
app.use("/forgetPassword", forgetPassword);
app.use("/match", match);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on port: ${port}...`);
});

