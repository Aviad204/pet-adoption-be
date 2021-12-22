const Postgrator = require("postgrator");
const path = require("path");
const mysql = require("mysql");
require("dotenv").config();

const postgrator = new Postgrator({
  migrationDirectory: path.resolve(__dirname, "../migrations"),
  driver: "mysql",
  host: "127.0.0.1",
  port: 3306,
  database: "pets",
  user: "root",
  password: process.env.DB_PASSWORD,
  schemaTable: "migrations",
});
exports.postgrator = postgrator;

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "pets",
});
exports.pool = pool;

const query = (sql) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
exports.query = query;
