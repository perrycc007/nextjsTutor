// const bcrypt = require("bcrypt");
// const express = require("express");
// const router = express.Router();
// const jwt = require("jsonwebtoken");

// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// // Matching system when someone posts or changes their tutor profile
// router.post("/tutor", async (req, res) => {
//   try {
//     const { location, subject, lowestfee, tutorid } = req.body.information;
//     const preference = {
//       highestfee: {
//         gte: lowestfee,
//       },
//       status: "open",
//     };

//     if (lowestfee == null) {
//       delete preference["highestfee"];
//     }

//     // Find students that match the tutor's criteria
//     const result = await prisma.student.findMany({ where: preference });

//     let found = [];
//     if (result !== null) {
//       // Filter based on location
//       found =
//         location !== undefined
//           ? result.filter((key) =>
//               JSON.parse(key.location).some((item) => location.includes(item))
//             )
//           : result;
//     }

//     found = found.filter((element) => element !== undefined);

//     let found1 = found;
//     if (found !== [] && found !== undefined) {
//       // Filter based on subject
//       found1 =
//         subject !== undefined
//           ? found.filter((key) => {
//               if (
//                 JSON.parse(key.subject) !== [] &&
//                 JSON.parse(key.subject) !== null
//               ) {
//                 return JSON.parse(key.subject).some((item) =>
//                   subject.includes(item)
//                 );
//               }
//             })
//           : found;
//     }

//     found1 = found1.filter((element) => element !== undefined);

//     const found1Ids = found1.map((info) => info.studentid);

//     // Get the tutor's previous matches
//     const before = await prisma.tutor.findUnique({
//       where: {
//         tutorid: tutorid,
//       },
//     });
//     console.log("b4", before);
//     let difference = [];
//     if (before.matchedbefore !== null) {
//       // Find the students who are no longer a match
//       difference = before.matchedbefore.filter((x) => !found1Ids.includes(x));
//     }
//     console.log("found", found1Ids);

//     // Find the matching rows in the match table for the students who are no longer a match
//     const deletetutor = await prisma.match.findMany({
//       where: {
//         studentid: {
//           in: difference,
//         },
//       },
//     });

//     // Remove the tutor ID from the availtutor list for the students who are no longer a match
//     for (const people of deletetutor) {
//       const availtutor = people.availtutor || [];
//       const notavaillist = people.notavailtutor || [];

//       const list = availtutor.filter((tutor) => tutor !== tutorid);
//       const notavaillistUpdated = notavaillist.filter((id) => id !== tutorid);

//       await prisma.match.update({
//         where: {
//           idmatch: people.idmatch,
//         },
//         data: {
//           availtutor: list,
//           notavailtutor: notavaillistUpdated,
//         },
//       });
//     }

//     // Find the matching rows in the match table for the new matching students
//     const student = await prisma.match.findMany({
//       where: {
//         studentid: {
//           in: found1Ids,
//         },
//       },
//     });

//     // Update the tutor's matchedbefore list with the new matching students
//     const tutorUpdateResult = await prisma.tutor.update({
//       where: {
//         tutorid: tutorid,
//       },
//       data: {
//         matchedbefore: found1Ids,
//       },
//     });

//     // Update the match table with the new availtutor list for the matching students
//     const updateServer = async () => {
//       for (const people of student) {
//         if (people.availtutor !== null) {
//           let list = people.availtutor || [];
//           let notavaillist = people.notavailtutor || [];

//           if (list.indexOf(tutorid) < 0) {
//             list = [...list, tutorid];
//           } else if (list.indexOf(tutorid) >= 0) {
//             notavaillist = notavaillist.filter((id) => id !== tutorid);
//           }

//           await prisma.match.update({
//             where: {
//               idmatch: people.idmatch,
//             },
//             data: {
//               availtutor: list,
//               notavailtutor: notavaillist,
//             },
//           });
//         } else {
//           let list = [tutorid];

//           await prisma.match.update({
//             where: {
//               idmatch: people.idmatch,
//             },
//             data: {
//               availtutor: list,
//               notavailtutor: [],
//             },
//           });
//         }
//       }
//     };

//     await updateServer();

//     res.status(200).json({ message: "Tutor profile updated successfully." });
//   } catch (err) {
//     console.log("Error: ", err.message);
//     res
//       .status(500)
//       .json({ error: "An error occurred while processing the tutor profile." });
//   }
// });

// // Matching system when a student applies for a case
// router.post("/student", async (req, res) => {
//   try {
//     const { location, subject, highestfee } = req.body.information;
//     const studentid = req.body.studentid;

//     const preference = {
//       lowestfee: {
//         lte: highestfee,
//       },
//       status: "open",
//     };

//     if (highestfee == null) {
//       delete preference["lowestfee"];
//     }

//     // Find tutors that match the student's criteria
//     const result = await prisma.tutor.findMany({ where: preference });

//     let found = [];
//     if (result !== null) {
//       // Filter based on location
//       found =
//         location !== undefined
//           ? result.filter((key) =>
//               JSON.parse(key.location).some((item) => location.includes(item))
//             )
//           : result;
//     }

//     found = found.filter((element) => element !== undefined);

//     let found1 =
//       subject !== undefined
//         ? found.filter((key) =>
//             JSON.parse(key.subject).some((item) => subject.includes(item))
//           )
//         : found;

//     found1 = found1.filter((element) => element !== undefined);

//     const found1Ids = found1.map((info) => info.tutorid);

//     // Get the student's previous matches
//     const student = await prisma.match.findUnique({
//       where: {
//         studentid: parseInt(studentid),
//       },
//     });

//     let differenceToAdd = found1Ids;

//     if (student !== null) {
//       const beforeavailtutor = student.availtutor || [];
//       const difference = beforeavailtutor.filter((x) => !found1Ids.includes(x));
//       differenceToAdd = found1Ids.filter((x) => !beforeavailtutor.includes(x));

//       // Find tutors who are no longer a match and update their matchedbefore list
//       const deletetutor = await prisma.tutor.findMany({
//         where: {
//           tutorid: {
//             in: difference,
//           },
//         },
//       });

//       const updateServer = async () => {
//         for (const people of deletetutor) {
//           let matchedbefore = [];
//           if (people.matchedbefore !== null && people.matchedbefore !== []) {
//             matchedbefore = people.matchedbefore;
//             matchedbefore = matchedbefore.filter(
//               (student) => student !== studentid
//             );
//           }

//           await prisma.tutor.update({
//             where: {
//               tutorid: people.tutorid,
//             },
//             data: {
//               matchedbefore: matchedbefore,
//             },
//           });
//         }
//       };

//       await updateServer();
//     }

//     // Update the matched students list for the new matching tutors
//     const updateTutor = await prisma.tutor.findMany({
//       where: {
//         tutorid: {
//           in: differenceToAdd,
//         },
//       },
//     });

//     for (const people of updateTutor) {
//       let matchedbefore = [];
//       if (people.matchedbefore !== null && people.matchedbefore !== []) {
//         matchedbefore = people.matchedbefore;
//         matchedbefore.push(studentid);
//       }

//       await prisma.tutor.update({
//         where: {
//           tutorid: people.tutorid,
//         },
//         data: {
//           matchedbefore: matchedbefore,
//         },
//       });
//     }

//     // Update the match table with the new availtutor list for the student
//     let notavailtutor = [];
//     if (student !== null) {
//       notavailtutor = student.notavailtutor || [];
//     }

//     await prisma.match.update({
//       where: {
//         studentid: studentid,
//       },
//       data: {
//         availtutor: found1Ids,
//         notavailtutor: notavailtutor,
//       },
//     });

//     res
//       .status(200)
//       .json({ message: "Student request processed successfully." });
//   } catch (err) {
//     console.log("Error: ", err.message);
//     res.status(500).json({
//       error: "An error occurred while processing the student request.",
//     });
//   }
// });

// module.exports = router;
