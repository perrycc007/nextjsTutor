const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')


const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


router.post("/", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const result = await prisma.user.findFirst({
      where: {
        email: email,
        // password:password
      },
    })
    if (result.status == 200);
      console.log(result.password)
      const validPassword = await bcrypt.compare(password, result.password);
      if (!validPassword)
        return res.status(400).send("Invalid email or password...");
      else{
      const accessToken = generateAccessToken(result)
      res.json({ accessToken: accessToken, userID: result.userid})}
  });

  function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  }

module.exports = router;
