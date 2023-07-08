const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email | !password) {
    return res.status(400).send("Please enter both email and password...");
  }

  const result = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (result);
  console.log(result);
  const validPassword = await bcrypt.compare(password, result.password);
  if (!validPassword)
    return res.status(400).send("Invalid email or password...");
  else {
    let date_ob = new Date();

    const update = await prisma.profile.updateMany({
      where: {
        userid: result.userid,
      },
      data: {
        lastOnline: date_ob,
      },
    });
    const updateStudent = await prisma.student.updateMany({
      where: {
        userid: result.userid,
      },
      data: {
        lastOnline: date_ob,
      },
    });
    const updateTutor = await prisma.tutor.updateMany({
      where: {
        userid: result.userid,
      },
      data: {
        lastOnline: date_ob,
      },
    });
    console.log(update, updateStudent, updateTutor);
    const accessToken = generateAccessToken(result);
    res.json({ accessToken: accessToken, userID: result.userid });
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

module.exports = router;
