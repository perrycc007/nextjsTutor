const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken')

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


router.get("/:userid", async(req, res) => {
 
    const userid = req.params.userid
    console.log(userid)
    const result = await prisma.student.findMany(
        { where: {
            userid:1
          }
        }
  )
  if (result.status == 200);


  // console.log(result[0].location)
  // console.log(result)
  res.json({result})
});
  


module.exports = router;
