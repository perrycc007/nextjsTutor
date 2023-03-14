const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// matching system when someone post or change their tutor profile
router.post("/tutor", async (req, res) => {
  // getting those which can be filtered from database out
  const { location, subject, lowestfee, tutorid } = req.body.information;
  const preference = {
    highestfee: {
      gte: lowestfee,
    },
    status: 'open'
  };

  if (lowestfee == null) {
    delete preference["highestfee"];
  }
  // do the query
  const result = await prisma.student.findMany({ where: preference });
  // if there is no requirement on location, set found into the result
  // if there are, filter them out

  let found = [];
  if (result != []) {
    found =
      location != undefined
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
  }
  // clean those undefined data away
  found = found.filter(function (element) {
    return element !== undefined;
  });

  let found1 = found;
  // if found is empty, then return an empty array
  if (found !== [] && found !== undefined) {
    found1 =
      subject != undefined
        ? found.map((key) => {
            if (
              JSON.parse(key.subject) !== [] &&
              JSON.parse(key.subject) !== null
            ) {
              if (
                JSON.parse(key.subject).some(
                  (item) => subject.indexOf(item) >= 0
                )
              ) {
                return key;
              }
            }
          })
        : found;
  }

  found1 = found1.filter(function (element) {
    return element !== undefined;
  });

  // so after a list of students are filter out, time to update the matching table
  // first of all, get all those studentid from the case
  try {
    found1 = found1.map((info) => {
      return info.studentid;
    });
    // res.json(found1);
    // get the student that the tutor had already matched
    const before = await prisma.tutor.findUnique({
      where: {
        tutorid: tutorid,
      },
    });
    // check if there are different between the new match result and the existing one
    let difference = [];
    if (before.matchedbefore !== null) {
      difference = before.matchedbefore.filter((x) => found1.indexOf(x) === -1);
    }
    // get those id of students who are no longer match and set it as difference
    // console.log("difference", difference);
    // get the list of those no longer is a match students
    const deletetutor = await prisma.match.findMany({
      where: {
        studentid: {
          in: difference,
        },
      },
    });
    // for those who are no longer match, filter the tutorid from the avail list
    for (const people of deletetutor) {
      const availtutor = people.availtutor;
      // const checking = people.checking;
      // const checked = people.checked;
      // let nochecking = [];
      // let nochecked = [];
      let notavaillist = [];
      // filter this tutor id from the avail list
      let list = availtutor.filter((tutor) => tutor !== tutorid);
      // let nocheckinglist = checking.filter((tutor) => tutor !== tutorid);
      // let nocheckedlist = checked.filter((tutor) => tutor !== tutorid);

      // console.log("list", list);
      if (people.notavailtutor !== null) {
        notavaillist = people.notavailtutor;
      }
      // if (people.checking !== null) {
      //   nochecking = people.checking;
      // }
      // if (people.checked !== null) {
      //   nochecked = people.checked;
      // }
      // filter the tutorid if it is in the not avail list
      notavaillist = notavaillist.filter((id) => {
        id !== tutorid;
      });
      // update the matching table
      const result = await prisma.match.update({
        where: {
          idmatch: people.idmatch,
        },
        data: {
          availtutor: list,
          notavailtutor: notavaillist,
          // checked: nocheckinglist,
          // checking: nocheckedlist,
        },
      });
      console.log(result);
    }
    // after deleting those no longer matching user, we gonna update those new matching result
    // find those matching row in the mathcing table of those matched student
    const student = await prisma.match.findMany({
      where: {
        studentid: {
          in: found1,
        },
      },
    });
    console.log(student);
    // update the tutor matchedbefore list with the new one
    const result = await prisma.tutor.update({
      where: {
        tutorid: tutorid,
      },
      data: {
        matchedbefore: found1,
      },
    });
    console.log(result);

    //
    const updateServer = async () => {
      for (const people of student) {
        // console.log(people.studentid);
        if (people.availtutor !== null) {
          let list = people.availtutor;
          let notavaillist = [];

          if (people.notavailtutor !== null) {
            notavaillist = people.notavailtutor;
          }
          // if this tutor doesnt exist in the avail list, add him, if he is, the check if he is in the notavail list, remove him in the list if he is
          if (list.indexOf(tutorid) < 0) {
            list = [...list, tutorid];
          } else if (list.indexOf(tutorid) >= 0) {
            if (notavaillist.indexOf(tutorid) >= 0) {
              notavaillist = notavaillist.filter((id) => {
                id !== tutorid;
              });
            }
          }
          // console.log("92", notavaillist);
          // update the mathcing table
          const result = await prisma.match.update({
            where: {
              idmatch: people.idmatch,
            },
            data: {
              availtutor: list,
              notavailtutor: notavaillist,
            },
          });
          console.log(result);
        } else {
          // if the availlist is null, directly update it
          // console.log(people.studentid);
          let list = [tutorid];
          console.log("105", list);
          const result = await prisma.match.update({
            where: {
              idmatch: people.idmatch,
            },
            data: {
              availtutor: list,
              notavailtutor: [],
            },
          });
          console.log(result);
        }
      }
    };
    updateServer();
  } catch (err) {
    console.log("Error: ", err.message);
  }
});

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

// the matching systmem when a student apply for a case
router.post("/student", async (req, res) => {
  // Find Match using student's criteria on the tutor criteria
  const { location, subject, highestfee } = req.body.information;
  const studentid = req.body.studentid;
  console.log("matching", req.body.information);
  console.log("studentid", studentid);
  const preference = {
    lowestfee: {
      lte: highestfee,
    },
    where:{
      status: 'open'
    },
  };
  if (highestfee == null) {
    delete preference["lowestfee"];
  }

  const result = await prisma.tutor.findMany({ where: preference });
  // filter according to location
  let found = [];
  if (result != null) {
    found =
      location != undefined
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
  }
  found = found.filter(function (element) {
    return element !== undefined;
  });
  let found1 =
    subject != undefined
      ? found.map((key) => {
          if (
            JSON.parse(key.subject).some((item) => subject.indexOf(item) >= 0)
          ) {
            return key;
          }
        })
      : found;
  found1 = found1.filter(function (element) {
    return element !== undefined;
  });

  try {
    found1 = found1.map((info) => {
      return info.tutorid;
    });
    // res.json(found1);

    // find the mathcing row of the current student
    const student = await prisma.match.findUnique({
      where: {
        studentid: parseInt(studentid),
      },
    });
    // console.log("241", student);
    let differenceToAdd = found1;
    // check the availtutor and find those are new to the list
    if ((student != null) | (student != [])) {
      let beforeavailtutor = student.availtutor;
      let difference = [];
      differenceToAdd = [];
      if (beforeavailtutor !== null) {
        difference = beforeavailtutor.filter((x) => found1.indexOf(x) === -1);
      }
      differenceToAdd = found1.filter(
        (x) => beforeavailtutor.indexOf(x) === -1
      );
      // console.log("differenceToAdd", differenceToAdd);
      // find those tutor who are a matched but no longer is a match now, and try to delete this student id from the mathced before list
      const deletetutor = await prisma.tutor.findMany({
        where: {
          tutorid: {
            in: difference,
          },
        },
      });
      // console.log("deletetutor", deletetutor);
      // delete the studentid in there matchedbefore list
      const updateServer = async () => {
        for (const people of deletetutor) {
          let matchedbefore = people.matchedbefore;
          // console.log("matchedbefore", matchedbefore);
          let list = [];
          if (matchedbefore !== null) {
            list = matchedbefore.filter((student) => student !== studentid);
            // console.log("list", list);
          }
          const result = await prisma.tutor.update({
            where: {
              tutorid: people.tutorid,
            },
            data: {
              matchedbefore: list,
            },
          });
          console.log("result", result);
        }
      };
      updateServer();
    }
    // get those tutor that are new to the list and try to add this student id in the matchedbefore list
    const updateTutor = await prisma.tutor.findMany({
      where: {
        tutorid: {
          in: differenceToAdd,
        },
      },
    });
    for (const people of updateTutor) {
      let matchedbefore = [];
      matchedbefore = people.matchedbefore;
      console.log("matchedbefore", matchedbefore);
      let list = [...matchedbefore];
      if (matchedbefore !== null && matchedbefore !== []) {
        list.push(studentid);
        console.log("list", list);
      }
      const result = await prisma.tutor.update({
        where: {
          tutorid: people.tutorid,
        },
        data: {
          matchedbefore: list,
        },
      });
      console.log("result", result);
    }

    // update the match list with the new avail list and delete its name in the notavailtutor
    let notavailtutor = [];
    if (student != []) {
      student.notavailtutor !== null
        ? (notavailtutor = student.notavailtutor)
        : [];
    }

    const result = await prisma.match.update({
      where: {
        studentid: studentid,
      },
      data: {
        availtutor: found1,
        notavailtutor: notavailtutor,
      },
    });
    console.log(result);

    // update the tutor matched list for adding
  } catch (err) {
    // 👇️ This runs
    console.log("Error: ", err.message);
    // res.json( err.message)
  }
});

module.exports = router;
