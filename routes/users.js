const express = require("express");

const bcrypt = require("bcrypt");
require("dotenv").config();
const getValidationMiddleware = require("../middlewares/validation");
const {
  createUser,
  loginUser,
  getUsersData,
  getSingleUser,
  updateUserData,
  getSingleUserByEmail,
  getFullUserData,
} = require("../data/usersData");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { cookieJwtAuth, isAdmin } = require("../middlewares/cookieJwtAuth");
const { authLoginSchema, authSignupSchema } = require("../schemas/userSchema");

router.post(
  "/signup",
  getValidationMiddleware(authSignupSchema),
  async (req, res) => {
    const newUser = {
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber || null,
    };
    try {
      const existedUser = await getSingleUserByEmail(req.body.email);
      if (existedUser[0]?.email) res.status(422).send("User already exist");
      else {
        const response = await createUser(newUser);
        const user = await getSingleUserByEmail(newUser.email);
        delete user[0].hashPassword;
        const token = jwt.sign(
          JSON.stringify(user[0]),
          process.env.ACCESS_TOKEN_SECRET
        );
        res.cookie("token", token);
        res.send(token);
      }
    } catch (err) {
      res.send(err);
    }
  }
);

router.post(
  "/login",
  getValidationMiddleware(authLoginSchema),
  async (req, res) => {
    try {
      const user = await loginUser(req.body.email, req.body.password);
      delete user.hashPassword;
      if (user) {
        const token = jwt.sign(
          JSON.stringify(user),
          process.env.ACCESS_TOKEN_SECRET
        );
        res.cookie("token", token);
        res.send(token);
      } else {
        res.status(403).send({ message: "Bad email or password" });
      }
    } catch (err) {
      res.status(500).send({ message: "Internal server error" });
    }
  }
);

router.get("/user", isAdmin, async (req, res) => {
  try {
    const results = await getUsersData();
    const mappedArray = results.map((user) => {
      delete user.hashPassword;
      return { ...user };
    });
    res.send({ users: mappedArray });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/user/:id", cookieJwtAuth, async (req, res) => {
  const userID = req.params.id;
  try {
    const singleUserData = await getSingleUser(userID);
    res.send({ user: singleUserData });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/user/:id", cookieJwtAuth, async (req, res) => {
  const userID = req.params.id;
  try {
    const oldUserData = await getSingleUser(userID);
    if (oldUserData[0].email !== req.body.email) {
      const userEmailOwner = await getSingleUserByEmail(req.body.email);
      if (oldUserData[0].id !== userEmailOwner[0].id) {
        res.status(422).send("This email is already in use");
      }
    }
    const updatedUserData = await updateUserData(userID, req.body);
    const updatedUser = await getSingleUser(userID);
    delete updatedUser[0].hashPassword;
    if (updatedUserData) {
      const token = jwt.sign(
        JSON.stringify(updatedUser[0]),
        process.env.ACCESS_TOKEN_SECRET
      );
      res.cookie("token", token);
      res.send({ user: updatedUser[0], token: token });
    } else {
      res
        .status(403)
        .send({ message: "Couldn't perform the update, check your inputs" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/user/:id/full", isAdmin, async (req, res) => {
  const userID = req.params.id;
  try {
    const singleUserData = await getFullUserData(userID);
    res.send(singleUserData);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
