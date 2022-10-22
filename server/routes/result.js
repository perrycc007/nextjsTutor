
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


router.get("/", async(req, res) => {
    const result = await prisma.match.findMany({
  })  
  // console.log('result',result)
    if (result !== null){
      let result1 = []
        // console.log(result)
        // res.json({result})
    for(const match of result){
      let favouritetutorid = []
      let result2 = []
        const student = await prisma.student.findUnique({
          where:{
            studentid: match.studentid
          }
        })
        if (student !=null){
          const user = await prisma.user.findUnique({
            where:{
              userid: student.userid
            }
          })

          if(user.favouritetutorid != null){
            // console.log('favouriteTutor',user.favouritetutorid)
            favouritetutorid = user.favouritetutorid
          }
          result2 = {...match,...student, favouritetutorid}
        }
        if( match.availtutor !==null){
          const tutor = await prisma.tutor.findMany({
            where:{
              tutorid: {
                in: match.availtutor
              }
            }
          })
          // console.log('tutor',tutor)
          for(let teahcer of tutor){
            const user = await prisma.user.findUnique({
              where:{
                userid: teahcer.userid
              }
            })
            if(user.favouritecaseid != null){
              // console.log('favouriteCase', user.favouritecaseid)
              const favouritecaseid = user.favouritecaseid
              teahcer = {...teahcer, favouritecaseid}
            }
            result2 = {...result2, tutor}

          }

        }
          // match.availtutor !=null?console.log([2]):''
          result1.push(result2)
    }
    console.log(result1)
    res.json(result1)
    }
    else{
        const result = {userid: userid,...dummyProfile}
        // console.log(result)
        // res.json({result})
    }
  })
  


module.exports = router;
