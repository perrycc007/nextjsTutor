const express = require("express");
const router = express.Router();
const dummyTutor = require("../DUMMY/dummyTutor");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get("/", async (req, res) => {
  const result = await prisma.tutor.findMany({
    where: {
      status: "open",
    },
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

router.post(
  "/getFavouriteCase/:userid",
  // authenticateToken,
  async (req, res) => {
    const userid = parseInt(req.params.userid);
    const favourite = await prisma.user.findUnique({
      where: {
        userid: userid,
      },
    });
    const tutoridList = favourite ? favourite.favouritetutorid : [];
    const result = await prisma.tutor.findMany({
      orderBy: [
        {
          lastOnline: "desc",
        },
      ],
      where: {
        tutorid: { in: tutoridList },
      },
    });
    res.json({ result });
  }
);

router.get(
  "/:userid",
  //  authenticateToken,
  async (req, res) => {
    const userid = parseInt(req.params.userid);
    const result = await prisma.tutor.findUnique({
      where: {
        tutorid: userid,
      },
    });
    // console.log('tutor',result)
    if (result !== null) {
      console.log(result);
      res.json({ result });
    } else {
      const result = { userid: userid, ...dummyTutor };
      // console.log(result)
      res.json({ result });
    }
  }
);

router.post(
  "/",
  // authenticateToken,
  async (req, res) => {
    // console.log(req.body.preference)
    const { fee, location, highestteachinglevel, subject } =
      req.body.preference;
    const preference = {
      highestteachinglevel: highestteachinglevel,
      lowestfee: {
        gte: fee[0],
      },
      status: "open",
    };
    if (fee[0] == null) {
      delete preference[("lowestfee", "highestfee")];
    }
    if (highestteachinglevel[0] == null) {
      delete preference["highestteachinglevel"];
    }

    const result = await prisma.tutor.findMany({ where: preference });

    let found =
      location[0] != null
        ? result.map((key) => {
            if (
              JSON.parse(key.location).some(
                (item) => location.indexOf(item) >= 0
              )
            ) {
              return key;
            }
          })
        : result;
    console.log(found);
    found = found.filter((item) => item != null);
    let found1 =
      subject[0] != null
        ? found.map((key) => {
            if (
              JSON.parse(key.subject).some((item) => subject.indexOf(item) >= 0)
            ) {
              return key;
            }
          })
        : found;

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
  }
);

router.patch(
  "/",
  // authenticateToken,
  async (req, res) => {
    const information = req.body.information;
    if (information.subject == undefined) {
      information.subject = JSON.stringify([]);
    }
    // console.log(req.body.information)
    const userid = parseInt(req.body.userid);
    // console.log(information)
    let date_ob = new Date();
    const result = await prisma.tutor.upsert({
      where: {
        tutorid: userid,
      },
      update: {
        ...information,
        lastOnline: date_ob,
      },
      create: {
        userid: userid,
        ...information,
        lastOnline: date_ob,
      },
    });
    // console.log(result)
    res.json({ result });
  }
);

module.exports = router;
