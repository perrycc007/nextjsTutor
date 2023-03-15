const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
// const sendResetPasswordEmail = require('../emails/account')

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const email = req.body.email;
  const result = await prisma.user.findFirst({
    where: {
      email: email,
      // password:password
    },
  });
  console.log(result);
  if (result != null) {
    console.log(result.userid);
    const secret = process.env.RESET_PASSWORD_SECRET + result.password;
    const payload = {
      email: email,
      userid: result.userid,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "15m" });

    const link = `http://localhost:3000/resetPassword/${result.userid}/${token}`;
    // sendResetPasswordEmail(email, link)
    console.log(link);
    res.send("reset link is sent");
  } else {
    res.send("user not found");
  }
});

router.get("/:userid/:token", async (req, res) => {
  const { userid, token } = req.params;
  const result = await prisma.user.findFirst({
    where: {
      userid: parseInt(userid),
    },
  });
  console.log(result);
  if (result != null) {
    const secret = process.env.RESET_PASSWORD_SECRET + result.password;
    try {
      const payload = jwt.verify(token, secret);
      res.json(payload);
    } catch (error) {
      console.log(error.message);
      res.send(error.message);
    }
  }
});

router.post("/:userid/:token", async (req, res) => {
  const { userid, token } = req.params;
  const password = req.body.password;
  const salt = await bcrypt.genSalt(8);
  try {
    const encrypedPassword = await bcrypt.hash(password, salt);
    const result = await prisma.user.findFirst({
      where: {
        userid: parseInt(userid),
      },
    });
    if (result != null) {
      const secret = process.env.RESET_PASSWORD_SECRET + result.password;
      try {
        const payload = jwt.verify(token, secret);
        console.log(payload);
        if (userid == payload.userid) {
          const result = await prisma.user.update({
            where: {
              userid: parseInt(userid),
            },
            data: {
              password: encrypedPassword,
            },
          });
          res.json(result);
        }
      } catch (error) {
        console.log(error.message);
        res.send(error.message);
      }
    }
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});


module.exports = router;
