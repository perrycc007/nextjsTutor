const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


router.get("/", async(req, res) => {
  const subject = req.body.subject;
  const place = req.body.place;
  console.log(subject)
  const result = await prisma.apply.findMany( )
  if (result.status == 200);
  res.json({result})
});
  
router.post("/", async(req, res) => {
  console.log(req.body.preference)
  preference = req.body.preference
  const result = await prisma.apply.findMany(
    {where: preference}
  )
  if (result.status == 200);
  console.log(result)
  res.json(result)
});
  

module.exports = router;
