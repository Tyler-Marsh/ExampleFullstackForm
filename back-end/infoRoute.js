const express = require("express");
const path = require("path");
const router = express.Router();
const bs3 = require("better-sqlite3");
const dbPath = path.join(__dirname, "data.db");

router.get("/", async function (req, res, next) {
  try {
    const db = new bs3(dbPath, { fileMustExist: true });
    const stmt = db.prepare(
      "SELECT * FROM Person WHERE pk_PersonId = (SELECT MAX(pk_PersonId) FROM PERSON)"
    );
    const results = stmt.get();
    db.close();

    if (!results) {
      res.status(204).json({ status: 204 });
      return;
    }
    res.status(200).json({ data: results, status: 200 });
    return;
  } catch (err) {
    res.sendStatus(500);
    if (db) {
      db.close();
    }
  }
});

router.post("/", async function (req, res, next) {
  try {
    const db = new bs3(dbPath, { fileMustExist: true });

    if (req.body.name && req.body.city && parseInt(req.body.year)) {
      const stmt = db.prepare(
        `INSERT INTO Person(Name, City, Year) VALUES(?, ?, ?)`
      );
      const info = stmt.run(req.body.name, req.body.city, req.body.year);
      res.sendStatus(201);
      return;
    }
    res.sendStatus(400);
    return;
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
