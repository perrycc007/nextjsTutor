const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


router.post("/tutor", async(req, res) => {
    console.log(req.body.information)
    // const {lowestfrequency,highestfrequency,location,highestteachinglevel,subject} = req.body.information
    const {location,subject,lowestfrequency,highestfrequency,tutorid} = req.body.information
    // console.log('matching',req.body.information)
    const preference = { 
    //   highestteachinglevel:highestteachinglevel,
    lowestfrequency:{
        gte: lowestfrequency,
      },
    highestfrequency:{
        lte: highestfrequency
    }
    }
   if (highestfrequency == null){
    delete preference['highestfrequency']
   }
   if (lowestfrequency == null){
    delete preference['lowestfrequency']
   }
  //  if (highestteachinglevel[0] ==null){
  //   delete preference['highestteachinglevel']
  //  }
  
    const result = await prisma.student.findMany(
      {where: 
        preference
      },
    ) 
    // console.log('match', result)
  // console.log(result)
  let found = location[0] != null? result.map((key)=>{if(JSON.parse(key.location).some((item)=> location.indexOf(item) >= 0))
                                    {return (key)}}) : result
  found = found.filter(function( element ) {
   return element !== undefined;
  });
  // console.log('found',found)
  let found1 =  subject[0] != null ? found.map((key)=>{if(JSON.parse(key.subject).some((item)=> subject.indexOf(item) >= 0))
                                    {return (key)}}): found
  found1 = found1.filter(function( element ) {
    return element !== undefined;
    });
  
  
    try {
      // const result = JSON.parse(...s);
      found1 = found1.map((info)=>{
        return info.studentid
      })
    // console.log('found1',found1)
    res.json(found1)


    const student = await prisma.match.findMany(
      {where: {
        studentid: {
          in: found1
        }
      }}
    )
      console.log(student)


      for (people in student){
        if (people.availtutor !== null) {
          let list = JSON.parse(people.availtutor)
          if(people.notavailtutor !== null){
            let notavaillist = JSON.parse(people.notavailtutor)
              return notavaillist
          }
        if (list.indexOf(tutorid)<0){
          list = [...list, tutorid]

    }else if (list.indexOf(tutorid)>=0){
        if (notavaillist.indexOf(tutorid)>0){
          notavaillist.filter((id)=>{
            id == tutorid
          return notavaillist
          })
      }
      }
      const result = await prisma.student.update({
        where: {
          studentid: people.studentid
        },
        data: {
          availtutor: JSON.stringify(list),
          notavailtutor: JSON.stringify(notavaillist)
        },
      })
        }else{
          let list = JSON.parse([tutorid])
          const result = await prisma.student.update({
            where: {
              studentid: people.studentid
            },
            data: {
              availtutor: JSON.stringify(list),
              notavailtutor: JSON.stringify([])
            },
          }
        )
        }
      }


    // const upsertUser = await prisma.user.upsert({
    //     where: {
    //       email: 'viola@prisma.io',
    //     },
    //     update: {
    //       name: 'Viola the Magnificent',
    //     },
    //     create: {
    //       email: 'viola@prisma.io',
    //       name: 'Viola the Magnificent',
    //     },
    //   })





    } catch (err) {
      // 👇️ This runs
      console.log('Error: ', err.message);
      res.json( err.message)
    }
  
  
  });

 
  module.exports = router;
