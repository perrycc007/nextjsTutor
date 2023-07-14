const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Matching system when someone posts or changes their tutor profile
router.post("/tutor", async (req, res) => {
  try {
    const { location, subject, lowestfee, tutorid } = req.body.information;

    const preference = {
      highestfee: {
        gte: lowestfee,
      },
      status: "open",
    };

    if (lowestfee == null) {
      delete preference["highestfee"];
    }

    const students = await findMatchingStudents(location, subject, preference);
    const found1Ids = students.map((student) => student.studentid);

    const before = await prisma.tutor.findUnique({
      where: {
        tutorid: tutorid,
      },
    });

    const difference = findDifference(before.matchedbefore, found1Ids);
    await updateNotMatchingStudents(difference, tutorid);

    const studentMatches = await prisma.match.findMany({
      where: {
        studentid: {
          in: found1Ids,
        },
      },
    });

    await updateTutorMatchedBefore(tutorid, found1Ids);

    await updateMatchingStudents(studentMatches, tutorid);

    res.status(200).json({ message: "Tutor profile updated successfully." });
  } catch (err) {
    console.log("Error: ", err.message);
    res
      .status(500)
      .json({ error: "An error occurred while processing the tutor profile." });
  }
});

// Matching system when a student applies for a case
router.post("/student", async (req, res) => {
  try {
    const { location, subject, highestfee } = req.body.information;
    const studentid = req.body.studentid;

    const preference = {
      lowestfee: {
        lte: highestfee,
      },
      status: "open",
    };

    if (highestfee == null) {
      delete preference["lowestfee"];
    }

    const tutors = await findMatchingTutors(location, subject, preference);
    const found1Ids = tutors.map((tutor) => tutor.tutorid);

    const student = await prisma.match.findUnique({
      where: {
        studentid: parseInt(studentid),
      },
    });

    const difference = findDifference(student.availtutor, found1Ids);

    await updateNotMatchingTutors(difference, studentid);

    const tutorMatches = await prisma.tutor.findMany({
      where: {
        tutorid: {
          in: found1Ids,
        },
      },
    });

    await updateStudentAvailTutors(studentid, found1Ids);

    await updateMatchingTutors(tutorMatches, studentid);

    res
      .status(200)
      .json({ message: "Student request processed successfully." });
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(500).json({
      error: "An error occurred while processing the student request.",
    });
  }
});

// Helper function to find matching students
async function findMatchingStudents(location, subject, preference) {
  const students = await prisma.student.findMany({ where: preference });

  if (!students || students.length === 0) {
    return [];
  }

  let found = students;
  if (location !== undefined) {
    found = students.filter((key) =>
      JSON.parse(key.location).some((item) => location.includes(item))
    );
  }

  let found1 = found;
  if (found !== [] && found !== undefined) {
    found1 =
      subject !== undefined
        ? found.filter((key) =>
            JSON.parse(key.subject).some((item) => subject.includes(item))
          )
        : found;
  }

  return found1.filter(Boolean);
}

// Helper function to find matching tutors
async function findMatchingTutors(location, subject, preference) {
  const tutors = await prisma.tutor.findMany({ where: preference });

  if (!tutors || tutors.length === 0) {
    return [];
  }

  let found = tutors;
  if (location !== undefined) {
    found = tutors.filter((key) =>
      JSON.parse(key.location).some((item) => location.includes(item))
    );
  }

  let found1 =
    subject !== undefined
      ? found.filter((key) =>
          JSON.parse(key.subject).some((item) => subject.includes(item))
        )
      : found;

  return found1.filter(Boolean);
}

// Helper function to find the difference between two arrays
function findDifference(array1, array2) {
  return array1.filter((x) => !array2.includes(x));
}

// Helper function to update the matching table for not matching students
async function updateNotMatchingStudents(difference, tutorid) {
  const deletetutor = await prisma.match.findMany({
    where: {
      studentid: {
        in: difference,
      },
    },
  });

  for (const people of deletetutor) {
    const availtutor = people.availtutor || [];
    const notavaillist = people.notavailtutor || [];

    const list = availtutor.filter((tutor) => tutor !== tutorid);
    const notavaillistUpdated = notavaillist.filter((id) => id !== tutorid);

    await prisma.match.update({
      where: {
        idmatch: people.idmatch,
      },
      data: {
        availtutor: list,
        notavailtutor: notavaillistUpdated,
      },
    });
  }
}

// Helper function to update the matching table for not matching tutors
async function updateNotMatchingTutors(difference, studentid) {
  const deletestudent = await prisma.tutor.findMany({
    where: {
      tutorid: {
        in: difference,
      },
    },
  });

  for (const people of deletestudent) {
    const matchedbefore = people.matchedbefore || [];

    const list = matchedbefore.filter((student) => student !== studentid);

    await prisma.tutor.update({
      where: {
        tutorid: people.tutorid,
      },
      data: {
        matchedbefore: list,
      },
    });
  }
}

// Helper function to update the matchedbefore list for the tutor
async function updateTutorMatchedBefore(tutorid, matchedStudents) {
  await prisma.tutor.update({
    where: {
      tutorid: tutorid,
    },
    data: {
      matchedbefore: matchedStudents,
    },
  });
}

// Helper function to update the matching table for matching students
async function updateMatchingStudents(studentMatches, tutorid) {
  for (const student of studentMatches) {
    if (student.availtutor !== null) {
      let list = student.availtutor || [];
      let notavaillist = student.notavailtutor || [];

      if (!list.includes(tutorid)) {
        list = [...list, tutorid];
      } else if (list.includes(tutorid) && notavaillist.includes(tutorid)) {
        notavaillist = notavaillist.filter((id) => id !== tutorid);
      }

      await prisma.match.update({
        where: {
          idmatch: student.idmatch,
        },
        data: {
          availtutor: list,
          notavailtutor: notavaillist,
        },
      });
    } else {
      const list = [tutorid];

      await prisma.match.update({
        where: {
          idmatch: student.idmatch,
        },
        data: {
          availtutor: list,
          notavailtutor: [],
        },
      });
    }
  }
}

// Helper function to update the availtutor list for the student
async function updateStudentAvailTutors(studentid, availTutors) {
  const student = await prisma.match.findUnique({
    where: {
      studentid: studentid,
    },
  });

  let notavailtutor = [];
  if (student !== null) {
    notavailtutor = student.notavailtutor || [];
  }

  await prisma.match.update({
    where: {
      studentid: studentid,
    },
    data: {
      availtutor: availTutors,
      notavailtutor: notavailtutor,
    },
  });
}

// Helper function to update the matched students list for matching tutors
async function updateMatchingTutors(tutorMatches, studentid) {
  for (const tutor of tutorMatches) {
    let matchedbefore = [];
    if (tutor.matchedbefore !== null && tutor.matchedbefore !== []) {
      matchedbefore = tutor.matchedbefore;
      matchedbefore.push(studentid);
    }

    await prisma.tutor.update({
      where: {
        tutorid: tutor.tutorid,
      },
      data: {
        matchedbefore: matchedbefore,
      },
    });
  }
}

module.exports = router;
