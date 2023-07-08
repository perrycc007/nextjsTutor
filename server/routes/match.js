const { Router } = require("express");
const router = Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Helper function to clean undefined elements from an array
function cleanArray(array) {
  return array.filter((element) => element !== undefined);
}

// Tutor matching function
async function matchTutors(location, subject, lowestfee, tutorid) {
  const preference = {
    highestfee: {
      gte: lowestfee,
    },
    status: "open",
  };

  if (lowestfee == null) {
    delete preference["highestfee"];
  }

  const students = await prisma.student.findMany({ where: preference });

  let found = students;

  if (students.length > 0) {
    found = location
      ? students.filter((student) =>
          JSON.parse(student.location).some((item) => location.includes(item))
        )
      : students;
  }

  found = cleanArray(found);

  let found1 = found;

  if (found.length > 0) {
    found1 = subject
      ? found.filter((student) =>
          JSON.parse(student.subject).some((item) => subject.includes(item))
        )
      : found;
  }

  found1 = cleanArray(found1);

  return found1;
}

// Update tutor's matching information
async function updateTutorMatching(tutorid, found1) {
  const before = await prisma.tutor.findUnique({
    where: {
      tutorid: tutorid,
    },
    include: {
      matchedbefore: true,
    },
  });

  const difference = before.matchedbefore.filter(
    (x) => found1.findIndex((student) => student.studentid === x) === -1
  );

  const deletetutor = await prisma.match.findMany({
    where: {
      studentid: {
        in: difference,
      },
    },
  });

  for (const match of deletetutor) {
    const list = match.availtutor.filter((tutor) => tutor !== tutorid);
    const notavaillist = match.notavailtutor.filter((id) => id !== tutorid);

    await prisma.match.update({
      where: {
        idmatch: match.idmatch,
      },
      data: {
        availtutor: list,
        notavailtutor: notavaillist,
      },
    });
  }

  const tutor = await prisma.tutor.update({
    where: {
      tutorid: tutorid,
    },
    data: {
      matchedbefore: found1.map((info) => info.studentid),
    },
  });

  return tutor;
}

// Student matching function
async function matchStudents(location, subject, highestfee) {
  const preference = {
    lowestfee: {
      lte: highestfee,
    },
    status: "open",
  };

  if (highestfee == null) {
    delete preference["lowestfee"];
  }

  const tutors = await prisma.tutor.findMany({ where: preference });

  let found = tutors;

  if (tutors.length > 0) {
    found = location
      ? tutors.filter((tutor) =>
          JSON.parse(tutor.location).some((item) => location.includes(item))
        )
      : tutors;
  }

  found = cleanArray(found);

  let found1 = found;
  if (found.length > 0) {
    found1 = subject
      ? found.filter((tutor) =>
          JSON.parse(tutor.subject).some((item) => subject.includes(item))
        )
      : found;
  }

  found1 = cleanArray(found1);

  return found1;
}

// Update student's matching information
async function updateStudentMatching(studentid, found1) {
  const student = await prisma.match.findUnique({
    where: {
      studentid: studentid,
    },
  });

  const differenceToAdd = found1
    .map((info) => info.tutorid)
    .filter((x) => student.availtutor.findIndex((tutor) => tutor === x) === -1);

  const difference = student.availtutor.filter(
    (x) => found1.findIndex((tutor) => tutor.tutorid === x) === -1
  );

  const deletetutor = await prisma.tutor.findMany({
    where: {
      tutorid: {
        in: difference,
      },
    },
  });

  for (const tutor of deletetutor) {
    const matchedbefore = tutor.matchedbefore.filter(
      (student) => student !== studentid
    );

    await prisma.tutor.update({
      where: {
        tutorid: tutor.tutorid,
      },
      data: {
        matchedbefore: matchedbefore,
      },
    });
  }

  const updateTutor = await prisma.tutor.findMany({
    where: {
      tutorid: {
        in: differenceToAdd,
      },
    },
  });

  for (const tutor of updateTutor) {
    const matchedbefore = tutor.matchedbefore
      ? [...tutor.matchedbefore, studentid]
      : [studentid];

    await prisma.tutor.update({
      where: {
        tutorid: tutor.tutorid,
      },
      data: {
        matchedbefore: matchedbefore,
      },
    });
  }

  const result = await prisma.match.update({
    where: {
      studentid: studentid,
    },
    data: {
      availtutor: found1.map((info) => info.tutorid),
      notavailtutor: student.notavailtutor || [],
    },
  });

  return result;
}

// Tutor matching route
router.post("/tutor", async (req, res) => {
  const { location, subject, lowestfee, tutorid } = req.body.information;

  try {
    const found1 = await matchTutors(location, subject, lowestfee, tutorid);
    const tutor = await updateTutorMatching(tutorid, found1);

    res.json(tutor);
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Student matching route
router.post("/student", async (req, res) => {
  const { location, subject, highestfee } = req.body.information;
  const studentid = req.body.studentid;

  try {
    const found1 = await matchStudents(location, subject, highestfee);
    const result = await updateStudentMatching(studentid, found1);

    res.json(result);
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
