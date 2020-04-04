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

  router.post("/", (req, res) => {
    const input = req.body;
    console.log(input);
    db.query(`
    SELECT * FROM resources
    WHERE title = '${input}'
    ;`)
      .then(data => {
        const resources = data.rows;
        console.log()
        res.render('index');
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
  router.get("/users/profile", (req, res) => {
    return res.render('profile'); //assuming profile.ejs

    //TO DO: display users name, username, email and profile pic 
  })

  router.post("/users/profile/edit", (req, res) => {
    return res.render('edit'); //assuming edit.ejs

    //TO DO: form for edit 

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