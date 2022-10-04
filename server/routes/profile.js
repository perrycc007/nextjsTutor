const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')
const dummyProfile = require('../DUMMY/dummyProfile')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


router.get("/:userid", async(req, res) => {
    const userid = parseInt(req.params.userid);
    const result = await prisma.profile.findUnique({
    where: {
      userid: userid ,
    },
  })  
  console.log('profile',result)
    if (result !== null){
        console.log(result)
        res.json({result})}
    else{
        const result = {userid: userid,...dummyProfile}
        console.log(result)
        res.json({result})
    }
  })
  
  router.post("/", async(req, res) => {
    const information = req.body.information
    agreewith=information.agreewith
    console.log(agreewith)
    const userid = parseInt(req.body.userid);
    const result = await prisma.profile.upsert({
        where: {
          userid: userid,
        },
        update: {
          ...information,
          agreewith: `${agreewith}`
        },
        create: {
          userid:userid,
          ...information,
          agreewith: `${agreewith}`
        },
      
    }
    )
    console.log(result)
    res.json({result})
    });

module.exports = router;
