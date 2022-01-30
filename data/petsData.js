const { query } = require("../lib/db");
const SQL = require("@nearform/sql");
const imagePlaceHolder =
  "https://cdn-icons-png.flaticon.com/512/1642/1642989.png";

const getPets = () => {
  const sql = SQL`SELECT * FROM pets`;
  return query(sql);
};
exports.getPets = getPets;

const addPet = async (pet) => {
  const sql = SQL`INSERT INTO pets (type, name, adoptionStatus, color, breed, bio, height, weight, dietery, hypoallergenic, image) VALUES (${pet.type}, ${pet.name}, ${pet.adoptionStatus}, ${pet.color}, ${pet.breed}, ${pet.bio}, ${pet.height}, ${pet.weight}, ${pet.dietery}, ${pet.hypoallergenic}, ${pet.image})`;
  return query(sql);
};
exports.addPet = addPet;

const getSinglePet = (petID) => {
  const sql = SQL`SELECT * FROM pets WHERE pets.id = ${petID}`;
  return query(sql);
};
exports.getSinglePet = getSinglePet;

const adoptOrFosterPet = async (data) => {
  const sql = SQL`UPDATE pets SET ownerID = ${data.ownerID}, adoptionStatus = ${data.adoptionStatus} WHERE pets.id = ${data.petID}`;
  return query(sql);
};
exports.adoptOrFosterPet = adoptOrFosterPet;

const getUserPets = (userID) => {
  const sql = SQL`SELECT * FROM pets WHERE pets.ownerID = ${userID}`;
  return query(sql);
};
exports.getUserPets = getUserPets;

const returnPet = async (petID) => {
  const sql = SQL`UPDATE pets SET ownerID = null, adoptionStatus = "Both" WHERE pets.id = ${petID}`;
  return query(sql);
};
exports.returnPet = returnPet;

const updatePetData = async (petID, newData) => {
  if (newData.image === "noFile") newData.image = imagePlaceHolder;
  const sql = SQL`UPDATE pets SET color = ${newData.color}, name = ${
    newData.name
  }, breed = ${newData.breed}, height = ${Number(newData.height)}, bio= ${
    newData.bio
  }, weight = ${Number(newData.weight)}, dietery = ${
    newData.dietery
  }, hypoallergenic = ${newData.hypoallergenic}, image = ${
    newData.image
  } WHERE pets.id = ${petID}`;
  return query(sql);
};
exports.updatePetData = updatePetData;

const savePet = (pet) => {
  const sql = SQL`INSERT INTO savedList (userWhoSavedID, petID) VALUES (${pet.userWhoSavedID}, ${pet.petID})`;
  return query(sql);
};
exports.savePet = savePet;

const deleteSavedPet = (pet) => {
  const sql = SQL`DELETE FROM savedList WHERE petID=${pet.petID} and userWhoSavedID=${pet.userWhoSavedID}`;
  return query(sql);
};
exports.deleteSavedPet = deleteSavedPet;

const getPetsFiltered = (filterItems) => {
  const typeArray = filterItems.petType.split("_");
  const sql = SQL`SELECT * FROM pets WHERE (height BETWEEN ${filterItems.minHeight} AND ${filterItems.maxHeight}) AND (weight BETWEEN ${filterItems.minWeight} AND ${filterItems.maxWeight}) AND (name LIKE ${filterItems.petName}) AND (adoptionStatus LIKE ${filterItems.petStatus}) AND (type IN (${typeArray}))`;
  return query(sql);
};
exports.getPetsFiltered = getPetsFiltered;

const getSavedPets = (userWhoSavedID) => {
  const sql = SQL`SELECT * FROM pets JOIN savedList on pets.id = savedList.petID WHERE savedList.userWhoSavedID =  ${userWhoSavedID}`;
  return query(sql);
};
exports.getSavedPets = getSavedPets;
