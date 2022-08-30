const express = require("express");
const router = express.Router();

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()


router.get("/", async(req, res) => {
  const userid = req.body.userid;
  const result = await prisma.favourite.findMany( 
    { where: {
      userid:userid
    }}
  )
  if (result.status == 200);
  res.json({result})
});
  
router.post("/", async(req, res) => {
  console.log(req.body.favourites)
  favourites = req.body.favourites
  const result = await prisma.apply.findMany(
    {where: {
        idapply: {in:favourites}

    }}
  )
  if (result.status == 200);
  console.log(result)
  res.json(result)
});


router.patch("/", async(req, res) => {
  const userid = parseInt(req.body.userid);
  console.log(req.body.caseid)
  const caseid = req.body.caseid
  const result = await prisma.favourite.update({
    where: {
      userid: userid,
      },
      data: {
        caseid: caseid,
      },
    }
  )
  console.log(result)
  res.json({result})
  });




module.exports = router;
