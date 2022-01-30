const { query } = require("../lib/db");
const SQL = require("@nearform/sql");
const bcrypt = require("bcrypt");

const createUser = async (user) => {
  const hashPassword = await bcrypt.hash(user.password, 10);
  const sql = SQL`INSERT INTO users (email, hashPassword, firstName, lastName, phoneNumber) VALUES (${user.email}, ${hashPassword}, ${user.firstName}, ${user.lastName}, ${user.phoneNumber})`;
  return query(sql);
};
exports.createUser = createUser;

const loginUser = async (email, password) => {
  const [user] = await query(SQL`SELECT * FROM users WHERE email = ${email}`);
  const isValidPass = await bcrypt.compare(password, user.hashPassword);
  if (isValidPass) {
    return user;
  }
};
exports.loginUser = loginUser;

const getUsersData = () => {
  return query(SQL`SELECT * FROM users`);
};
exports.getUsersData = getUsersData;

const getSingleUser = (userID) => {
  const sql = SQL`SELECT * FROM users WHERE users.id = ${userID}`;
  return query(sql);
};
exports.getSingleUser = getSingleUser;

const updateUserData = async (userID, newData) => {
  const oldUserDetails = await getSingleUser(userID);
  if (!newData.password) {
    newData.password = oldUserDetails[0].hashPassword;
  } else {
    const hashedPassword = await bcrypt.hash(newData.password, 10);
    newData.password = hashedPassword;
  }
  if (newData.bio == null && !oldUserDetails.bio) {
    newData.bio = " ";
  } else if (newData.bio == null && oldUserDetails.bio) {
    newData.bio = oldUserDetails.bio;
  }
  const sql = SQL`UPDATE users SET email=${newData.email} , firstName=${newData.firstName} , lastName=${newData.lastName} , phoneNumber=${newData.phoneNumber} ,bio=${newData.bio}, hashPassword=${newData.password}  WHERE users.id = ${userID}`;
  return query(sql);
};
exports.updateUserData = updateUserData;

const getSingleUserByEmail = (email) => {
  const sql = SQL`SELECT * FROM users WHERE users.email = ${email}`;
  return query(sql);
};
exports.getSingleUserByEmail = getSingleUserByEmail;

const getFullUserData = async (userID) => {
  const sqlUser = SQL`SELECT * FROM users WHERE users.id = ${userID}`;
  const userData = await query(sqlUser);
  const sqlUserPets = SQL`SELECT * FROM pets WHERE pets.ownerID = ${userID}`;
  const userPetsData = await query(sqlUserPets);
  delete userData[0].hashPassword;
  userData[0].ownedPets = userPetsData;
  return userData[0];
};
exports.getFullUserData = getFullUserData;
