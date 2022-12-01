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
        checked: req.body.checked
      },
    }
  )
  // console.log(result)
  res.json({result})
});

module.exports = router;
