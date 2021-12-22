const { query } = require("../lib/db");
const SQL = require("@nearform/sql");

const getPets = () => {
  const sql = SQL`SELECT * FROM pets`;
  return query(sql);
};
exports.getPets = getPets;

const addPet = async (pet) => {
  const sql = SQL`INSERT INTO pets (type, name, status, color, breed, bio, height, weight, dietery, hypoallergnic, image) VALUES (${pet.type}, ${pet.name}, ${pet.status}, ${pet.color}, ${pet.breed}, ${pet.bio}, ${pet.height}, ${pet.weight}, ${pet.dietery}, ${pet.hypoallergnic}, ${pet.image})`;
  return query(sql);
};
exports.addPet = addPet;

const getSinglePet = (petID) => {
  const sql = SQL`SELECT * FROM pets WHERE pets.id = ${petID}`;
  return query(sql);
};
exports.getSinglePet = getSinglePet;

const adoptOrFosterPet = async (data) => {
  console.log(data);
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
  const sql = SQL`UPDATE pets SET ownerID = null, adoptionStatus = null WHERE pets.id = ${petID}`;
  return query(sql);
};
exports.returnPet = returnPet;
