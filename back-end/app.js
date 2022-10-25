const express = require("express");
const path = require("path");
const morgan = require("morgan");
const infoRouter = require("./infoRoute");
const app = express();
const fs = require("fs");
const bs3 = require("better-sqlite3");
const cors = require("cors");

const dbPath = path.join(__dirname, "data.db");

if (!fs.existsSync(dbPath)) {
  const createTableSQL = `CREATE TABLE IF NOT EXISTS Person (
        pk_PersonId integer NOT NULL CONSTRAINT pk_PersonId PRIMARY KEY,
        Name varchar(50) NOT NULL,
        City varchar(50) NOT NULL,
        Year INT NOT NULL
        )`;
  const db = new bs3(dbPath);

  try {
    db.exec(createTableSQL);
  } catch (err) {
    console.log("ERROR CREATING DATABASE: " + err);
  }
  db.close();
}

app.set("port", 8080);
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/", infoRouter);

app.listen(8080, () => {
  console.log(`This app is listening on port 8080`);
});
