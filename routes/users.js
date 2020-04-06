/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  //CATEGORIES GET route

  router.get('/categories', (req, res) => {
    db
      .query(`SELECT * from categories;`)
      .then((data) => {
        const categories = data.rows;
        res.render('categories', { categories });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

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

    const createResource = (req, res, categoryId) => {
      db.query(
        `INSERT INTO resources(title, category_id,description, url)
         VALUES('${input.title}','${input.description}','${input.url}');`

      );
    };

    // 1. separate the create a new resource db query into a separate function eg, const createResource = (req, res, categoryId) => { /* copy the full db query here */ }
    // 2. query db for category by name
    // 3. in the .then() for that query, if the category exists, use the id on the category and create a new resource by calling createResource(req, res, categoryId)
    // 4. if the category does not exist, make a new db insert call with the category name, and use RETURNING * at the end of your query to return the category in the then for this db call
    // 5. in the .then() for your insert category call, create a new resource by calling createResource(req, res, categoryId)

    db.query(`select * from categories where name = '${input.category}';`).then((data) => {
      if (data.rows[0]) {
        db
          .query(
            `INSERT INTO resources(title, category_id,description, url)
                  VALUES('${input.title}','${data.rows[0].id}','${input.description}','${input.url}');`
          )
          .then(res.redirect('/'))
          .catch((e) => res.send(e));
      } else {
        console.log('in else');
        db
          .query(
            `INSERT INTO categories(user_id, name)
                  VALUES(1,'${input.category}')
                  RETURNING *;`
          )
          .then((data) => {
            db.query(
              `INSERT INTO resources(title, category_id,description, url)
                  VALUES('${input.title}','${data.rows[0].id}','${input.description}','${input.url}');`
            );
          })
          .then(res.redirect('/'))
          .catch((e) => res.send(e));
      }
    });

  });

  //HOME ROUTE
  router.get('/', (req, res) => {
    //TO DO: display rescourse and liked resources
    db
      .query(`SELECT * FROM resources join categories on categories.id = category_id;`)
      .then((data) => {
        const resources = data.rows;
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
      .query(`SELECT * FROM resources join categories on categories.id = category_id WHERE title LIKE '%${input}%';`)
      .then((data) => {
        const resources = data.rows;
        res.render('search_results', { resources });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  })
  //

  //PROFILE
  router.get("/profile", (req, res) => {
    db
      .query(`SELECT * FROM users WHERE users.id =1;`)
      .then((data) => {
        const user = data.rows[0];
        console.log('=====', user);
        res.render('profile', { user }); //assuming profile.ejs
        /*note: ejs file would need user.name, user.username, user.email and profile pic   */
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
      //need to add logic to catch error if there are no results and display appropriate message

  })
  router.post("/profile/", (req, res) => {
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
