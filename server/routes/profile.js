const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


router.get("/:userid", async(req, res) => {
    const userid = parseInt(req.params.userid);
    const result = await prisma.profile.findUnique({
    where: {
      userid: userid ,
    },
  })  
    if (result);
        console.log(result)
        res.json({ result})
  })
  
  router.patch("/", async(req, res) => {
    const subject = req.body.subject;
    const place = req.body.place;
    const userid = req.body.userid;
    const result = await prisma.profile.updateMany({
        where: {
          userid: userid,
        data: {
          subject: subject,
          place: place
        },
      }
    }
    )
    console.log(result)
    res.json({result})
    });
 
 
    router.post("/", async(req, res) => {
      const subject = req.body.subject;
      const place = req.body.place;
      const userid = parseInt(req.body.userid);
      const result = await prisma.profile.create({
          data: {
            subject: subject,
            place: place,
            userid:userid
          },
        }
      )
      console.log(result)
      res.json({result})
      });

module.exports = router;
