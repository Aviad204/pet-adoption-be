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
  updatePetData,
  savePet,
  deleteSavedPet,
  getPetsFiltered,
  getSavedPets,
} = require("../data/petsData");
const fs = require("fs");
const getValidationMiddleware = require("../middlewares/validation");
const multer = require("multer");
const { cookieJwtAuth, isAdmin } = require("../middlewares/cookieJwtAuth");
const { addPetSchema, editPetSchema } = require("../schemas/petSchema");
const baseURL = "http://localhost:5500/pets/pet/";

router.use("/pet", express.static("images"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/pet/:id", async (req, res) => {
  const petID = req.params.id;
  try {
    const singlePetData = await getSinglePet(petID);
    res.send({ pet: singlePetData });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post(
  "/pet",
  isAdmin,
  upload.single("image"),
  getValidationMiddleware(addPetSchema),
  async (req, res) => {
    const newPet = {
      type: req.body.type,
      name: req.body.name,
      adoptionStatus: req.body.adoptionStatus,
      color: req.body.color,
      breed: req.body.breed,
      bio: req.body.bio,
      height: req.body.height,
      weight: req.body.weight,
      dietery: req.body.dietery,
      hypoallergenic: req.body.hypoallergenic === "true" ? 1 : 0,
      image: baseURL + req.file.filename,
      dateCreated: Date.now(),
    };
    try {
      const response = await addPet(newPet);
      res.send(response);
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

router.post("/pet/:id/adopt", cookieJwtAuth, async (req, res) => {
  const data = {
    ownerID: req.body.ownerID,
    adoptionStatus: req.body.adoptionStatus,
    petID: req.params.id,
  };
  try {
    const response = await adoptOrFosterPet(data);
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/pet/user/:id", cookieJwtAuth, async (req, res) => {
  try {
    const userPetsData = await getUserPets(req.params.id);
    res.send({ pets: userPetsData });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/pet/:id/return", cookieJwtAuth, async (req, res) => {
  try {
    const response = await returnPet(req.params.id);
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put(
  "/pet/:id",
  isAdmin,
  upload.single("image"),
  getValidationMiddleware(editPetSchema),
  async (req, res) => {
    const oldPetData = await getSinglePet(req.body.petID);
    let fileName;
    if (req.file) fileName = baseURL + req.file.filename;
    else if (!req.file && oldPetData[0].image) fileName = oldPetData[0].image;
    else fileName = "noFile";
    const editData = {
      name: req.body.name,
      breed: req.body.breed,
      color: req.body.color,
      height: req.body.height,
      weight: req.body.weight,
      dietery: req.body.dietery,
      bio: req.body.bio,
      hypoallergenic: req.body.hypoallergnic === "true" ? 1 : 0,
      image: fileName,
    };
    try {
      const response = await updatePetData(req.body.petID, editData);
      res.send(response);
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

router.get("/pet/:id", async (req, res) => {
  try {
    const petData = await getSinglePet(req.params.id);
    res.send({ pets: petData });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/pet/:id/save", cookieJwtAuth, async (req, res) => {
  const petToSave = {
    userWhoSavedID: req.body.userWhoSavedID,
    petID: req.body.petID,
  };
  try {
    const response = await savePet(petToSave);
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/pet/:id/save", cookieJwtAuth, async (req, res) => {
  const petToRemove = {
    userWhoSavedID: req.body.userWhoSavedID,
    petID: req.body.petID,
  };
  try {
    const response = await deleteSavedPet(petToRemove);
    res.send(response);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/pet", async (req, res) => {
  const petToSearch = {
    petType: req.query.petType || "cat_dog_parrot_rabbit",
    petName: req.query.petName || "%",
    minHeight: Number(req.query.minHeight) || 0,
    maxHeight: Number(req.query.maxHeight) || 300,
    minWeight: Number(req.query.minWeight) || 0,
    maxWeight: Number(req.query.maxWeight) || 80,
    petStatus: req.query.petStatus || "%",
  };
  try {
    const petData = await getPetsFiltered(petToSearch);
    res.send({ pets: petData });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/pet/saved/:id", cookieJwtAuth, async (req, res) => {
  try {
    const petData = await getSavedPets(req.params.id);
    res.send({ pets: petData });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
