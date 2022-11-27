const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/:userid", async (req, res) => {
  const userid = parseInt(req.params.userid);
  const result = await prisma.student.findUnique({
    where: {
      userid: userid,
    },
  });
  if (result);
  console.log(result);
  res.json({ result });
});

router.patch("/", async (req, res) => {
  const information = req.body.information;
  const studentid = parseInt(req.body.studentid);
  const result = await prisma.student.update({
    where: {
      studentid: studentid,
    },
    data: {
      ...information,
    },
  });
  const createMatch = await prisma.match.upsert({
    where: {
      studentid: studentid,
    },
    update: {},
    create: {
      studentid: studentid,
    },
  });
  createMatch
  console.log(result);
  res.json({ result });
});

router.post("/", async (req, res) => {
  const information = req.body.information;
  const userid = parseInt(req.body.userid);
  const result = await prisma.student.create({
    data: {
      userid: userid,
      ...information,
    },
  });
  console.log(result);
  res.json({ result });
});

module.exports = router;
