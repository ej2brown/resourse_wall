/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({ user: 'labber', password: 'labber', host: 'localhost', database: 'midterm' });

module.exports = (db) => {
  router.get('/', (req, res) => {
    db
      .query(`SELECT * FROM users;`)
      .then((data) => {
        const users = data.rows;
        res.json({ users });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  const showResults = (name) => {
    return pool
      .query(`SELECT * FROM widgets where name = '${input}';`)
      .then((data) => {
        const users = data.rows;
        res.json({ users });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  };

  router.get('/search', (req, res) => {
    showResults(req.query).then((results) => res.send({ results }));

    return router;
  });
};

const dbTesting = function() {
  console.log('fn dbtetsing works');
};
exports.dbTesting = dbTesting;

router.post('/dbTest', (req, res) => {
  dbTesting()
    .then(() => {
      console.log('works');
      res.send({ user: { name: user.name, email: user.email, id: user.id } });
    })
    .catch((e) => res.send(e));
});
