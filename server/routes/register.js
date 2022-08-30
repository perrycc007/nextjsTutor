const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


router.post("/", async(req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const salt = await bcrypt.genSalt(8);
  const encrypedPassword = await bcrypt.hash(password, salt);
  console.log(encrypedPassword)
  const result = await prisma.user.create({
    data:  {
      email: email,
      password: encrypedPassword
      // password: password
  }})
  if (result.status == 200);
    const user = result
    const accessToken = generateAccessToken(user)
    res.json({ accessToken: accessToken})
  // console.log(result)
  res.json({result})
  if (error) return res.status(400).send(error.details[0].message);
});
  

  function generateAccessToken(email) {
    return jwt.sign(email, process.env.ACCESS_TOKEN_SECRET)
  }


module.exports = router;
