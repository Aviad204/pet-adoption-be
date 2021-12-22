const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const {
  getPets,
  addPet,
  getSinglePet,
  adoptOrFosterPet,
  getUserPets,
  returnPet,
} = require("../data/petsData");
const S = require("fluent-json-schema").default;
const fs = require("fs");
const getValidationMiddleware = require("../middlewares/validation");
const multer = require("multer");
const { cookieJwtAuth } = require("../middlewares/cookieJwtAuth");

const baseURL = "http://localhost:5500/pets/pet/";

// need to work on the schema
const petValidateSchema = S.object()
  // .prop(
  //   "type",
  //   S.string()
  //     .minLength(2)
  //     .maxLength(15)
  //     .required()
  //     .enum(["Dog", "Cat", "Parrot", "Rabbit"])
  // )
  // .prop("name", S.string().minLength(1).required())
  // .prop("status", S.string().required().enum(["Available", "Fostered"]))
  // .prop("height", S.number().minimum(0).maximum(300))
  // .prop("weight", S.number().minimum(0).maximum(500))
  // .prop("color", S.string().minLength(0).maxLength(15))
  // .prop("bio", S.string().minLength(0).maxLength(200))
  // // .prop("hypoallergnic", S.boolean())
  // .prop("dietery", S.string())
  // .prop("breed", S.string().minLength(0).maxLength(50))
  // .prop("image", S.string())
  .valueOf();
// Middleware for the relevant parts
// getValidationMiddleware(petValidateSchema),

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.use("/pet", express.static("images"));
router.use(express.static(__dirname + "/pet"));

router.get("/pet/:id", async (req, res) => {
  const petID = req.params.id;
  const singlePetData = await getSinglePet(petID);
  res.send({ pet: singlePetData });
});

router.get("/pet", cookieJwtAuth, async (req, res) => {
  const petData = await getPets();
  res.send({ pets: petData });
});

router.post("/pet", upload.single("image"), async (req, res) => {
  console.log("image data" + JSON.stringify(req.file));
  const newPet = {
    type: req.body.type,
    name: req.body.name,
    status: req.body.status,
    color: req.body.color,
    breed: req.body.breed,
    bio: req.body.bio,
    height: req.body.height,
    weight: req.body.weight,
    dietery: req.body.dietery,
    hypoallergnic: req.body.hypoallergnic === "true" ? 1 : 0,
    image: baseURL + req.file.filename,
  };
  const response = await addPet(newPet);
  res.send(response);
});

router.post("/pet/:id/adopt", async (req, res) => {
  const data = {
    ownerID: req.body.ownerID,
    adoptionStatus: req.body.adoptionStatus,
    petID: req.params.id,
  };
  const response = await adoptOrFosterPet(data);
  res.send(response);
});

router.get("/pet/user/:id", async (req, res) => {
  const userPetsData = await getUserPets(req.params.id);
  res.send({ pets: userPetsData });
});

router.post("/pet/:id/return", async (req, res) => {
  const response = await returnPet(req.params.id);
  res.send(response);
});

module.exports = router;
