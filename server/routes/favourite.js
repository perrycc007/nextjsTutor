const express = require("express");
const router = express.Router();

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


router.get("/case", async(req, res) => {

  const userid = parseInt(req.body.userid);
  const result = await prisma.user.findUnique( 
    { where: {
      userid: userid
    }}
  )
  if (result.status == 200);
  res.json(result)
});
 
router.get("/tutor/:userid", async(req, res) => {
  const userid = parseInt(req.params.userid)
  console.log(userid)
  const result = await prisma.user.findUnique( 
    { where: {
      userid: userid
    }}
  )
  if (result.status == 200);
  res.json(result)
});
  

router.patch("/case", async(req, res) => {
  const userid = parseInt(req.body.userid);
  const caseid = req.body.caseid
  console.log(req.body.caseid)
  const result = await prisma.user.upsert({
    where: {
      userid: userid,
      },
      update: {
        favouritecaseid: caseid,
      },
      create: {
        userid: userid,
        favouritecaseid: caseid
      },
    }
  )
  // console.log(result)
  res.json({result})
  });

  router.patch("/tutor", async(req, res) => {
    const userid = parseInt(req.body.userid);
    const caseid = req.body.caseid
    const result = await prisma.user.update({
      where: {
        userid: userid,
        },
        data: {
          favouritetutorid: caseid,
        },
      }
    )
    // console.log(result)
    res.json({result})
    });
  
  

module.exports = router;
