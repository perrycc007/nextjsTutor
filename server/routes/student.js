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
  let date_ob = new Date();
  const result = await prisma.student.update({
    where: {
      studentid: studentid,
    },
    data: {
      ...information,
      lastOnline: date_ob,
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
  let date_ob = new Date();
  const result = await prisma.student.create({
    data: {
      userid: userid,
      ...information,
      lastOnline: date_ob
    },
  });
  console.log(result);
  res.json({ result });
});

module.exports = router;
