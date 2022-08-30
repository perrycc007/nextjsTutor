const express = require("express");
const cors = require("cors");
const register = require("./routes/register");
const login = require("./routes/login");
const apply = require("./routes/apply");
const cases = require("./routes/cases");
const profile = require("./routes/profile");
const favourite = require("./routes/favourite")
const time = require("./routes/time")
const app = express();

require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use("/signup", register);
app.use("/login", login);
app.use("/apply", apply);
app.use("/cases", cases);
app.use("/profile", profile);
app.use("/favourite", favourite);
app.use("/time", time);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on port: ${port}...`);
});

