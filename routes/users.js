/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  //LOGIN route
  router.get('/login', (req, res) => {
    res.render('login');
  });

  // ADD RESOURCE GET ROUTE
  router.get('/addResource', (req, res) => {
    res.render('new_resource');
  });

  // ADD RESOURCE POST ROUTE
  router.post('/addResource', (req, res) => {
    // add logic for IF logged in, otherwise display message 'please login to add resource'

    const input = req.body;
    db
      .query(
        `INSERT INTO resources(title, description, url)
         VALUES('${input.title}','${input.description}','${input.url}');`
      )
      .then(res.redirect('/'))
      .catch((e) => res.send(e));
  });

  //HOME ROUTE
  router.get('/', (req, res) => {
    //TO DO: display rescourse and liked resources
    db
      .query(`SELECT * FROM resources;`)
      .then((data) => {
        const resources = data.rows[0];
        res.render('index', { resources });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // SEARCH GET ROUTE
  router.get('/search', (req, res) => {
    const input = req.query.search;
    db
      .query(`SELECT * FROM resources WHERE title LIKE '%${input}%';`)
      .then((data) => {
        const resources = data.rows;
        res.render('search_results', { resources });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });

    //need to add logic to catch error if there are no results and display appropriate message
  });

  //PROFILE GET ROUTE
  router.get('/users/profile', (req, res) => {
    return res.render('profile'); //assuming profile.ejs

    //TO DO: display users name, username, email and profile pic
  });

  router.post('/users/profile/edit', (req, res) => {
    return res.render('edit'); //assuming edit.ejs

    //TO DO: form for edit
  });
  //

  return router;
};
