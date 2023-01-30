const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dummyProfile = require("../DUMMY/dummyProfile");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/:userid", async (req, res) => {
  const userid = parseInt(req.params.userid);
  const result = await prisma.profile.findUnique({
    where: {
      userid: userid,
    },
  });
  console.log("profile", result);
  if (result !== null) {
    console.log(result);
    res.json({ result });
  } else {
    const result = { userid: userid, ...dummyProfile };
    console.log(result);
    res.json({ result });
  }
});

router.post("/", async (req, res) => {
  const reqUserid = parseInt(req.body.userid);
  let { userid, idprofile, ...information } = req.body.information;
  agreewith = information.agreewith;
  console.log(reqUserid);
  // userid = parseInt(req.body.userid);
  let date_ob = new Date();
  const result = await prisma.profile.upsert({
    where: {
      userid: reqUserid,
    },
    update: {
      ...information,
      lastOnline: date_ob,
      // agreewith: `${agreewith}`,
    },
    create: {
      userid: reqUserid,
      ...information,
      lastOnline: date_ob,
      agreewith: `${agreewith}`,
    },
  });
  console.log(result);
  res.json({ result });
});

module.exports = router;
