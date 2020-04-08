/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const request = require('request-promise-native');

// Helper functions
const createResource = (req, res, categoryId) => {
  db.query(
    `INSERT INTO resources(title, category_id,description, url)
       VALUES('${input.title}','${input.description}','${input.url}');`
  );
};

//ROUTES

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

  //LOGIN route
  router.get('/login', (req, res) => {
    res.render('login');
  });

  router.get("/profile", (req, res) => {
    db
      .query(`SELECT * FROM users WHERE users.id =1;`)
      .then((data) => {
        const user = data.rows;
        console.log("BOOP", user)
        res.render('profile', { user })
      })
      .catch((err) => {
        //need to add logic to catch error if there are no results and display appropriate message
        res.status(500).json({ error: err.message });
      });
  })


      router.post("/profile", (req, res) => {
          //TO DO: form for edit then return to profile page
          const option = req.body.edit
          const field = ''
          if (req.body[edit] === name) field = name;
          if (req.body[edit] === username) field = username;
          if (req.body[edit] === email) field = email;
          db
              .query(`UPDATE users SET $1 = $2 WHERE users.id = 1;`, [field, option])
              .then((data) => {
                  const user = data.rows[0];
                  console.log('=====', user);
                  return res.redirect('/profile', { user }); //assuming edit.ejs
                  /*note: ejs file would need user.name, user.username, user.email and profile pic */
              })
              .catch((err) => {
                  res.status(500).json({ error: err.message });
              });
      })

  return router;
};
