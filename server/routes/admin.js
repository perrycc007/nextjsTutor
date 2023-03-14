const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.patch("/toggleCheck", async (req, res) => {
  const result = await prisma.match.update({
    where: {
      idmatch: req.body.idmatch,
    },
    data: {
      checking: req.body.checking,
      checked: req.body.checked,
    },
  });
  // console.log(result)
  res.json({ result });
});

router.patch("/toggleAvail", async (req, res) => {
  const result = await prisma.match.update({
    where: {
      idmatch: req.body.idmatch,
    },
    data: {
      notavailtutor: req.body.notavailtutor,
    },
  });
  // console.log(result)
  res.json({ result });
});

router.patch("/updateTutorVerify", async (req, res) => {
  console.log(req.body.tutorid);
  const tutorid = req.body.tutorid;
  const verify = req.body.verify;
  const result = await prisma.tutor.update({
    where: {
      tutorid: parseInt(tutorid),
    },
    data: {
      verify: verify,
    },
  });
  if (result.status == 200) {
    res.json({ result });
  }
});

module.exports = router;
