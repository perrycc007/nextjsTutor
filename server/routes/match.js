const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


router.post("/tutor", async(req, res) => {
    // console.log(req.body.information)
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
      console.log('61',found1)
    const before = await prisma.tutor.findUnique(
      {where:{
        tutorid: tutorid
      }
      }
    )
    let difference = []
if (before.matchedbefore !==null){
   difference = before.matchedbefore.filter(x => found1.indexOf(x) === -1);
}
console.log('difference',difference);
const deletetutor = await prisma.match.findMany(
  {where: {
    studentid: {
      in: difference
    }
  }}
)
for(const people of deletetutor){
  const availtutor = people.availtutor
  console.log('availtutor',availtutor)
  let notavaillist = []
  let list = availtutor.filter((tutor)=> tutor !== tutorid)
  console.log('list',list)
  if(people.notavailtutor !== null){
    notavaillist = people.notavailtutor
  }
  notavaillist = notavaillist.filter((id)=>{
    id !== tutorid
  })
  const result = await prisma.match.update({
    where: {
      idmatch: people.idmatch
    },
    data: {
      availtutor: list,
      notavailtutor: notavaillist
    },
  }
)
console.log('result',result)
}
    const student = await prisma.match.findMany(
      {where: {
        studentid: {
          in: found1
        }
      }}
    )
      console.log(student)
      const result = await prisma.tutor.update({
        where: {
          tutorid: tutorid
        },
        data: {
          matchedbefore: found1
        },
      }
    
    )
    console.log(result)

const updateServer = async() => {     
   for(const people of student){
        console.log(people.studentid)
        if (people.availtutor !== null) {
            let list = people.availtutor 
            let notavaillist = []


            if(people.notavailtutor !== null){
              notavaillist = people.notavailtutor
            }
            if (list.indexOf(tutorid)<0){
              list = [...list, tutorid]
            }else if (list.indexOf(tutorid)>=0){
              if (notavaillist.indexOf(tutorid)>=0){
                notavaillist = notavaillist.filter((id)=>{
                  id !== tutorid
                })
          }
          }
            console.log('92',notavaillist)
        const result =  await prisma.match.update({
          where: {
            idmatch: people.idmatch
          },
          data: {
            availtutor: list,
            notavailtutor: notavaillist
          },
        })
        console.log(result)
          }else{
            console.log(people.studentid)
            let list = [tutorid]
            console.log('105',list)
            const result = await prisma.match.update({
              where: {
                idmatch: people.idmatch
              },
              data: {
                availtutor: list,
                notavailtutor: []
              },
            }
          )
          console.log(result)
          }
      }
    }
    updateServer()
  } catch (err) {
      // 👇️ This runs
      console.log('Error: ', err.message);
      // res.json( err.message)
    }
  
    
  });

 
  module.exports = router;
