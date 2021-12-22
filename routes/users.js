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
} = require("../data/usersData");
const jwt = require("jsonwebtoken");
const S = require("fluent-json-schema").default;
const router = express.Router();

const newUserValidateSchema = S.object()
  .prop("email", S.string().required())
  .prop("password", S.string().minLength(6).required())
  .prop("firstName", S.string().required())
  .prop("lastName", S.string())
  // .prop("phoneNumber", S.number())
  .valueOf();

router.post(
  "/signup",
  getValidationMiddleware(newUserValidateSchema),
  async (req, res) => {
    const newUser = {
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
    };
    try {
      // change to have the id
      const response = await createUser(newUser);
      const user = await getSingleUserByEmail(newUser.email);
      delete user[0].hashPassword;
      const token = jwt.sign(
        JSON.stringify(user[0]),
        process.env.ACCESS_TOKEN_SECRET
      );
      res.cookie("token", token);
      res.send(token);
    } catch (err) {
      res.send(err);
    }
  }
);

const loginUserValidateSchema = S.object()
  .prop("email", S.string().required())
  .prop("password", S.string().minLength(6).required())
  .valueOf();

router.post(
  "/login",
  getValidationMiddleware(loginUserValidateSchema),
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
      console.error(err);
      res.status(500).send({ message: "Internal server error" });
    }
  }
);

router.get("/user", async (req, res) => {
  const results = await getUsersData();
  res.send({ users: results });
});

router.get("/user/:id", async (req, res) => {
  const userID = req.params.id;
  const singleUserData = await getSingleUser(userID);
  res.send({ user: singleUserData });
});

router.put("/user/:id", async (req, res) => {
  const userID = req.params.id;
  try {
    const updatedUserData = await updateUserData(userID, req.body);
    const user = await getSingleUserByEmail(req.body.email);
    delete user[0].hashPassword;
    if (updatedUserData) {
      const token = jwt.sign(
        JSON.stringify(user[0]),
        process.env.ACCESS_TOKEN_SECRET
      );
      res.cookie("token", token);
      res.send({ user: user[0], token: token });
    } else {
      res
        .status(403)
        .send({ message: "Couldn't perform the update, check your inputs" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
