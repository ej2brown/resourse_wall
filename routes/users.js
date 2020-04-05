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
  // Route for add new resource - WORK IN PROGRESS
  router.post('/addResource', (req, res) => {
    // add logic for IF logged in, otherwise display message 'please login to add resource'

    //capture user input
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
})
//search 
//TO DO: display any resource with searched keyword
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

  //profile
  //TO DO: display users name, username, email and profile pic 
  router.get("/users/profile", (req, res) => {
    db
      .query(`SELECT * FROM users;`)
      .then((data) => {
        const user = data.rows[0];
        console.log('=====', user);
        return res.render('profile', { user }); //assuming profile.ejs
        /*note: ejs file would need user.name, user.username, user.email and profile pic   */
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  })

  router.post("/users/profile/edit", (req, res) => {
    //TO DO: form for edit then return to profile page
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
        return res.redirect('/users/profile', { user }); //assuming edit.ejs
        /*note: ejs file would need user.name, user.username, user.email and profile pic */
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  })

  return router;
};
