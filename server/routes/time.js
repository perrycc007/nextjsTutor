const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", 
// authenticateToken,
 async (req, res) => {
  const userid = req.body.userid;
  const result = await prisma.profile.findMany({
    where: {
      userid: userid,
    },
  });
  if (result.status == 200);
  res.json({ result });
});

router.patch("/", async (req, res) => {
  const time = JSON.stringify(req.body.time);
  const userid = req.body.userid;
  console.log(req.body);
  const result = await prisma.profile.update({
    where: {
      userid: userid,
    },
    data: {
      availtime: time,
    },
  });
  try {
    console.log(result);
    res.json({ result });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
});

module.exports = router;
