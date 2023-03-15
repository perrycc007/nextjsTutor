const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
// const sendResetPasswordEmail = require('../emails/account')

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/:userid", async (req, res) => {
  const { userid } = req.params;
  const password = req.body.password;
  console.log(userid, password);
  const salt = await bcrypt.genSalt(8);
  try {
    const encrypedPassword = await bcrypt.hash(password, salt);
    const result = await prisma.user.findFirst({
      where: {
        userid: parseInt(userid),
      },
    });
    if (result != null) {
      try {
        const result = await prisma.user.update({
          where: {
            userid: parseInt(userid),
          },
          data: {
            password: encrypedPassword,
          },
        });
        res.json(result);
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
