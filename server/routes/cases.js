const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


router.get("/", async(req, res) => {

  const result = await prisma.student.findMany()
  res.json(result)
console.log(result)
});
  

router.get("/:casesid", async(req, res) => {
  console.log('rec')
  const casesid = JSON.parse(req.params.casesid)
  const result = await prisma.student.findUnique({
    where:{
      studentid: casesid
    }
  })
  res.json(result)

});


router.post("/", async(req, res) => {
  console.log(req.body.preference)
  const preference = req.body.preference
  const location = req.body.location
  console.log(location)
  const availtime = req.body.availtime
  const subject = req.body.subject
  const result = await prisma.student.findMany(
    {where: preference}
  )

const arr2 = location
const found =  result.map((key)=>{if(JSON.parse(key.location).some((item)=> arr2.indexOf(item) >= 0))
                                  {return (key)}})

  try {
    // const result = JSON.parse(...s);
    console.log(found)
  } catch (err) {
    // 👇️ This runs
    console.log('Error: ', err.message);
  }
  

  if (result.status == 200);
  // result.map((item)=>item.map(item=>console.log(item)))
  console.log(result)
  res.json(result)
});
  

module.exports = router;
