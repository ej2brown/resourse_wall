/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const request = require('request-promise-native');
// const bcrypt = require('bcrypt');
// const cookieSession = require('cookie-session');

// router.use(
//   cookieSession({
//     name: 'session123',
//     keys: [ 'key' ]
//   })
// );

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

  //LOGIN route GET
  router.get('/login', (req, res) => {
    res.render('login');
  });

  //LOGIN route POST
  router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db
      .query(`SELECT * FROM users WHERE email='${email}' and password='${password}';`)
      .then((user) => {
        if (user.rows.length === 0) {
          res.send({ error: 'Invalid user' });
          return;
        } else {
          //Set cookie
          req.session.email = email;
          // console.log('======', req.session.email);
          res.render('index');
        }
      })
      .catch((e) => res.send(e));
  });

  //REGISTER route GET
  router.get('/register', (req, res) => {
    res.render('register');
  });

  // POST /register
  router.post('/register', (req, res) => {
    // if email or password entered is blank, return error
    if (req.body.email === '' || req.body.password === '') {
      res.status(404).send('Email or password blank');
      return;
    }

    // if email already exists, send message
    db.query(`SELECT * FROM users;`).then((data) => {
      for (user of data.rows) {
        if (user.email === req.body.email) {
          res.send('Email already exists');
          return;
        }
      }
    });

    // add new user to users table
    db
      .query(
        `INSERT INTO users(name,email,username,password)
          VALUES('${req.body.name}','${req.body.email}','${req.body.username}','${req.body.password}');`
      )
      .then(() => {
        // req.session.email = email;
        res.redirect('/');
      })
      .catch((e) => e);
  });

  //PROFILE route GET
  router.get('/profile', (req, res) => {
    db
      .query(`SELECT * FROM users WHERE users.id =1;`)
      .then((data) => {
        const user = data.rows;
        // console.log('BOOP', user);
        res.render('profile', { user });
      })
      .catch((err) => {
        //need to add logic to catch error if there are no results and display appropriate message
        res.status(500).json({ error: err.message });
      });
  });

  //PROFILE route POST
  router.post('/profile', (req, res) => {
    //TO DO: form for edit then return to profile page
    const option = req.body.edit;
    const field = '';
    if (req.body[edit] === name) field = name;
    if (req.body[edit] === username) field = username;
    if (req.body[edit] === email) field = email;
    db
      .query(`UPDATE users SET $1 = $2 WHERE users.id = 1;`, [ field, option ])
      .then((data) => {
        const user = data.rows[0];
        // console.log('=====', user);
        return res.redirect('/profile', { user }); //assuming edit.ejs
        /*note: ejs file would need user.name, user.username, user.email and profile pic */
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
