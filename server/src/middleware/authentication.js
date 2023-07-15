const jwt = require("jsonwebtoken");
const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    let date_ob = new Date();

    try {
      const update = await prisma.profile.updateMany({
        where: {
          userid: user, // assuming 'user' contains the correct user ID
        },
        data: {
          lastOnline: date_ob,
        },
      });
      next();
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.sendStatus(500);
    }
  });
}

module.exports = authenticateToken;
