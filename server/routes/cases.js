const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


router.get("/", async(req, res) => {
const result = await prisma.student.findMany()
if (result.status == 200);
try {
  res.json({result})
} catch (error) {
  res.json({error})
}

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
  // console.log(req.body.preference)
  const {fee,location,highestteachinglevel,subject} = req.body.preference
  const preference = { 
    highestteachinglevel:highestteachinglevel,
    lowestfee:{
        gte: fee[0],
      }
  }
 if (fee[0] == null){
  delete preference['lowestfee','highestfee']
 }
 if (highestteachinglevel[0] ==null){
  delete preference['highestteachinglevel']
 }

  const result = await prisma.tutor.findMany(
    {where: 
      preference
    },
  ) 
  
let found = location[0] != null? result.map((key)=>{if(JSON.parse(key.location).some((item)=> location.indexOf(item) >= 0))
                                  {return (key)}}) : result
console.log(found)
found = found.filter((item)=> item != null)
let found1 =  subject[0] != null ? found.map((key)=>{if(JSON.parse(key.subject).some((item)=> subject.indexOf(item) >= 0))
                                  {return (key)}}): found



  try {
    // const result = JSON.parse(...s);
  // console.log(found1)
  found1 = found1.filter((item)=> item != null)
  res.json(found1)
  } catch (err) {
    // 👇️ This runs
    console.log('Error: ', err.message);
    res.json( err.message)
  }


});

module.exports = router;
