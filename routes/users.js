/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Route to display add resource page
  router.get('/addResource', (req, res) => {
    res.render('new_resource');
  });

  // Route for add new resource - WORK IN PROGRESS
  router.post('/addResource', (req, res) => {
    // add logic for IF logged in, otherwise display message 'please login to add resource'

    //capture user input
    const input = req.body;
    console.log(input.id);
    db
      .query(
        `
INSERT INTO resources
    (id, category_id, title, description, url)
        VALUES('${input.id}','${input.category_id}','${input.title}',
        '${input.description}',
          '${input.url}');`
      )
      .then(res.redirect('/'))
      .catch((e) => res.send(e));
  });

  //home
  router.get('/', (req, res) => {
    //TO DO: display rescourse and liked resources
    db
      .query(
        `
    SELECT * FROM resources
    ;`
      )
      .then((data) => {
        const resources = data.rows[0];
        res.render('index', { resources });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // search
  router.get('/search', (req, res) => {
    const input = req.query.search;
    // console.log(`input=======`, input);
    db
      .query(
        `
    SELECT * FROM resources
    WHERE title LIKE '%${input}%'
    ;`
      )
      .then((data) => {
        const resources = data.rows;
        console.log('====', resources);
        res.render('search_results', { resources });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });

    //need to add logic to catch error if there are no results and display appropriate message
  });

  //profile
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
