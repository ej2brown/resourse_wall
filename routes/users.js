/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // Route for add new resource
  router.post('/addResource', (req, res) => {
    // add logic for IF logged in, otherwise display message 'please login to add resource'
    const resource = req.body;
    db
      .query(
        `
    INSERT into RESOURCES (title,description,type)
    VALUES('${resource.title}',
    '${resource.description}',
      '${resource.url}')
  returning *;
    ;`
      )
      .then((res) => res)
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
        const resources = data.rows[0];
        res.render('search_results', { resources });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });

    //need to add logic to catch error if there are no results and display appropriate message
  });

  // Add new resource to database - WORK IN PROGRESS - need add resource form to be set up to capture inputs
  router.post('/', (req, res) => {
    //capture input - use req.body
    db
      .query(
        `
    INSERT into RESOURCES (title,description,type)
    VALUES()
    ;`
      )
      .then((data) => {
        const resources = data.rows[0];
        console.log(resources);
        res.render('search_results', { resources });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
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
