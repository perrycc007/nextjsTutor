const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')
const dummyTutor = require('../DUMMY/dummyTutor')


const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get("/", async(req, res) => {
  const tutorCount = await prisma.tutor.count()
  console.log(tutorCount)
  const result = await prisma.tutor.findMany({
    take: parseInt(req.query.limit),
    skip: parseInt(req.query.skip)
  })
  if (result.status == 200);
try {
  res.json({result})
} catch (error) {
  res.json({error})
}

});
  

router.post("/getFavouriteCase", async(req, res) => {
  // console.log(req)    
  tutoridList = req.body.tutoridList
  console.log(tutoridList)
  const result = await prisma.tutor.findMany({
        where: {
            tutorid: { in: tutoridList },
        }

  })
  res.json({result})
});


router.get("/:userid", async(req, res) => {
  const userid = parseInt(req.params.userid);
  const result = await prisma.tutor.findUnique({
  where: {
    tutorid: userid ,
  },
})  
console.log('tutor',result)
    if (result !== null){
      // console.log(result)
      res.json({result})}
    else{
      const result = {userid: userid,...dummyTutor}
      console.log(result)
      res.json({result})
}
})


router.post("/", async(req, res) => {
  console.log(req.body.preference)
  const {fee,location,highestteachinglevel,subject} = req.body.preference
  const preference = { 
    highestteachinglevel:highestteachinglevel,
    lowestfee:{
        gte: fee[0],
      },
    highestfee:{
        lte: fee[1]
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

const found = location[0] != null? result.map((key)=>{if(JSON.parse(key.location).some((item)=> location.indexOf(item) >= 0))
                                  {return (key)}}) : result
const found1 =  subject[0] != null ? found.map((key)=>{if(JSON.parse(key.subject).some((item)=> subject.indexOf(item) >= 0))
                                  {return (key)}}): found



  try {
    // const result = JSON.parse(...s);
  console.log(found1)
  res.json(found1)
  } catch (err) {
    // 👇️ This runs
    console.log('Error: ', err.message);
    res.json( err.message)
  }


});
  

router.patch("/", async(req, res) => {
  const information = req.body.information
  if (information.subject == undefined){
    information.subject = JSON.stringify([])
  }
  console.log(req.body.information)
  const userid = parseInt(req.body.userid);
  console.log(information)
  const result = await prisma.tutor.upsert({
      where: {
        tutorid: userid
      },
      update: {
        ...information
      },
      create: {
        userid:userid,
        ...information
      },
    }
  
  )
  console.log(result)
  res.json({result})
  });



module.exports = router;
