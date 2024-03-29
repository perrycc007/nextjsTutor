const express = require("express");
const router = express.Router();
const dummyProfile = require("../DUMMY/dummyProfile");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// const {authenticateToken} = require("./middleware/authentication.js");
router.get(
  "/:userid",
  // authenticateToken,
  async (req, res) => {
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
  }
);

router.post(
  "/",
  // authenticateToken,
  async (req, res) => {
    const reqUserid = parseInt(req.body.userid);
    let { userid, idprofile, ...information } = req.body.information;
    let { availtime, country, lastOnline, ...requiredInfo } = information;
    const isEmpty = Object.values(requiredInfo).some(
      (x) => x == null || x == ""
    );
    if (isEmpty) {
      return res.status(400).json({ message: "請填寫所有格子" });
    }
    agreewith = information.agreewith;
    console.log(information);
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
    // console.log(result);
    res.json({ result });
  }
);

module.exports = router;
