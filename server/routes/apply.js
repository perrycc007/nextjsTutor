const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const subject = req.body.subject;
  const place = req.body.place;
  const userid = parseInt(req.body.userid);
  console.log(req.body);
  const result = await prisma.apply.create({
    data: {
      subject: subject,
      place: place,
      userid: userid,
    },
  });
  console.log(result);
  res.json({ result });
});

module.exports = router;
