const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const result = await prisma.student.findMany({
    orderBy: [
      {
        lastOnline: "desc",
      },
    ],
  });
  if (result.status == 200);
  try {
    res.json({ result });
  } catch (error) {
    res.json({ error });
  }
});
router.post("/getFavouriteCase/:userid", async (req, res) => {
  const userid = parseInt(req.params.userid);
  const favourite = await prisma.user.findUnique({
    where: {
      userid: userid,
    },
  });
  const caseidList = favourite ? favourite.favouritecaseid : [];
  const result = await prisma.student.findMany({
    where: {
      studentid: { in: caseidList },
    },
  });
  res.json({ result });
});

router.get("/:casesid", async (req, res) => {
  console.log("rec");
  const casesid = JSON.parse(req.params.casesid);
  const result = await prisma.student.findUnique({
    where: {
      studentid: casesid,
    },
  });
  res.json(result);
});

router.post("/", async (req, res) => {
  // console.log(req.body.preference)
  const { fee, location, highestteachinglevel, subject } = req.body.preference;
  const preference = {
    highestteachinglevel: highestteachinglevel,
    lowestfee: {
      gte: fee[0],
    },
  };
  if (fee[0] == null) {
    delete preference[("lowestfee", "highestfee")];
  }
  if (highestteachinglevel[0] == null) {
    delete preference["highestteachinglevel"];
  }

  const result = await prisma.tutor.findMany({
    orderBy: [
      {
        lastOnline: "desc",
      },
    ],
    where: preference,
  });

  const filteringFunction = (filterCriteria, inputList) => {
    let result =
      filterCriteria[0] != null
        ? inputList.map((key) => {
            if (
              JSON.parse(key.location).some(
                (item) => filterCriteria.indexOf(item) >= 0
              )
            ) {
              return key;
            }
          })
        : inputList;
    return result;
  };

  const found = filteringFunction(location, result);
  const found1 = filteringFunction(subject, found);

  try {
    // const result = JSON.parse(...s);
    // console.log(found1)
    found1 = found1.filter((item) => item != null);
    res.json(found1);
  } catch (err) {
    // 👇️ This runs
    console.log("Error: ", err.message);
    res.json(err.message);
  }
});

module.exports = router;
