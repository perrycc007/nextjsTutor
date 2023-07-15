const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// const {authenticateToken} = require("./middleware/authentication.js");

router.get(
  "/:userid",
  //  authenticateToken,
  async (req, res) => {
    const userid = req.params.userid;
    console.log(userid);
    const result = await prisma.student.findMany({
      where: {
        userid: parseInt(userid),
      },
    });
    if (result.status == 200);

    res.json({ result });
  }
);

router.patch(
  "/updateCaseStatus",
  // authenticateToken,
  async (req, res) => {
    console.log(req.body.studentid);
    const studentid = req.body.studentid;
    const status = req.body.status;
    const result = await prisma.student.update({
      where: {
        studentid: parseInt(studentid),
      },
      data: {
        status: status,
      },
    });
    const resultmatch = await prisma.match.update({
      where: {
        studentid: parseInt(studentid),
      },
      data: {
        status: status,
      },
    });

    res.json({ result });
  }
);

router.patch(
  "/updateTutorStatus",
  //  authenticateToken,
  async (req, res) => {
    console.log(req.body.tutorid);
    const tutorid = req.body.tutorid;
    const status = req.body.status;
    const result = await prisma.tutor.update({
      where: {
        tutorid: parseInt(tutorid),
      },
      data: {
        status: status,
      },
    });
    res.json({ result });
  }
);

module.exports = router;
