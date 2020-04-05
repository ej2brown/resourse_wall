/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

//test
router.get("/test", (req, res) => {
  res.render("test");
});

//home
// router.get("/", (req, res) => {
//   res.render("index");
// });



module.exports = (db) => {

  //home
  router.get("/", (req, res) => {
    //TO DO: display rescourse and liked resources 
    db.query(`
    SELECT * FROM resources
    ;`)
      .then(data => {
        const resources = data.rows;
        console.log(resources)
        res.render('index', resources);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  })


  //search 
  router.get("/users/searchResults", (req, res) => {
    return res.render('searchResults'); //assuming searchResults.ejs

    //TO DO: display any resource with searched keyword
  })


  //profile
  //TO DO: display users name, username, email and profile pic 
  router.get("/users/profile", (req, res) => {
    db
    .query(`SELECT * FROM users;`)
    .then((data) => {
      const user = data.rows[0];
      console.log('=====', user);
      return res.render('profile', { user }); //assuming profile.ejs
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
      });
  })

  router.post("/users/profile/edit", (req, res) => {
    //TO DO: form for edit 
    const option = req.body.edit
    const field = ''
    if (req.body[edit] === name) field = name;
    if (req.body[edit] === name) field = username;
    if (req.body[edit] === name) field = email;
    db
    .query(`UPDATE users SET $1 = $2 WHERE users.id = 1;`, [field, option])
    .then((data) => {
      const user = data.rows[0];
      console.log('=====', user);
      return res.render('edit', { user }); //assuming edit.ejs
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
      });
  })
  //



  return router;
};

//test
router.get("/test", (req, res) => {
  db.query(`SELECT * FROM users;`)
    .then(data => {
      const users = data.rows;
      res.json({ users });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});