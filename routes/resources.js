/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const request = require('request-promise-native');
const query = require('../lib/query.js');

module.exports = (db) => {
  router.get('/', (req, res) => {
    // if (!req.session.session123) {
    //   console.log('in if');
    //   res.render('login');
    //   return;
    // }
    db
      .query(
        `
        SELECT resources.*, users.name, COUNT(likes.like_status) as likes_count
        FROM resources
        LEFT JOIN likes ON resources.id = likes.resource_id
        JOIN categories ON categories.id = resources.category_id
        JOIN users ON users.id = categories.user_id
        WHERE users.email = '${req.session.email}'
        GROUP BY resources.id, users.name;`
      )
      .then((data) => {
        const resources = data.rows;
        // res.send('OK')
        // console.log('===resources===', resources)
        res.json({ resources });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get('/comments', (req, res) => {
    res.render('new_resource');
  });

  // ADD RESOURCE GET ROUTE
  router.get('/addResource', (req, res) => {
    if (!req.session.email) {
      res.render('login');
    }

    res.render('new_resource');
  });

  // ADD RESOURCE POST ROUTE
  router.post('/addResource', (req, res) => {
    if (!req.session.email) {
      res.render('login');
    }

    const input = req.body;

    db
      .query(
        `select *,categories.id from categories join users on users.id = categories.user_id where categories.name = '${input.category}' and users.email='${req
          .session.email}';`
      )
      .then((data) => {
        if (data.rows[0]) {
          request(`https://api.linkpreview.net/?key=3bd09bc66604502d6b96be1b65dca12c&q=${input.url}`).then((img) => {
            const parsed = JSON.parse(img);
            // console.log('======', parsed);
            console.log(data.rows[0]);
            db
              .query(
                `INSERT INTO resources(title, category_id,description,image, url)
            VALUES('${input.title}','${data.rows[0].id}','${input.description}','${parsed.image}','${input.url}');`
              )
              .then(res.redirect('/'))
              .catch((e) => res.send(e));
          });
        } else {
          console.log('in else');
          db.query(`select * from users where email = '${req.session.email}'`).then((user) => {
            db
              .query(
                `INSERT INTO categories(user_id, name)
                    VALUES(${user.rows[0].id},'${input.category}')
                    RETURNING *;`
              )
              .then((data) => {
                console.log('above newcatid', data.rows[0]);
                const newCatId = data.rows[0].id;
                return request(`https://api.linkpreview.net/?key=3bd09bc66604502d6b96be1b65dca12c&q=${input.url}`)
                  .then((img) => {
                    const parsed = JSON.parse(img);
                    db
                      .query(
                        `INSERT INTO resources(title, category_id,description,image, url)
              VALUES('${input.title}','${newCatId}','${input.description}','${parsed.image}','${input.url}');`
                      )
                      .then(() => res.redirect('/'))
                      .catch((e) => res.send(e));
                  })
                  .catch((e) => res.send(e));
              });
          });
          // .then((data) => {
          //   console.log('====', data);
          //   const newCatId = data.rows[0].id;
          //   return request(`https://api.linkpreview.net/?key=3bd09bc66604502d6b96be1b65dca12c&q=https://${input.url}`)
          //     .then((img) => {
          //       const parsed = JSON.parse(img);
          //       db
          //         .query(
          //           `INSERT INTO resources(title, category_id,description,image, url)
          //   VALUES('${input.title}','${newCatId}','${input.description}','${parsed.image}','${input.url}');`
          //         )
          //         .then(() => res.redirect('/'))
          //         .catch((e) => res.send(e));
          //     })
          //     .catch((e) => res.send(e));
          // });
        }
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
  });

  //LIKES GET ROUTE
  router.get('/likes', (req, res) => {
    db
      .query(
        `
        SELECT resources.*, users.name, COUNT(likes.id)::integer as likes_count
        FROM resources
        JOIN likes ON resources.id = resource_id
		    JOIN categories ON categories.id = category_id
        JOIN users ON users.id = categories.user_id
        WHERE likes.user_id = 1
        GROUP BY resources.id, users.name;
          `
      )
      .then((data) => {
        const resources = data.rows;
        res.json({ resources });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get('/ratings', (req, res) => {
    db
      .query(
        `SELECT resource_id, ROUND(AVG(star_rating), 1) as star_rating
        FROM public.ratings
        GROUP BY resource_id;`
      )
      .then((data) => {
        const resources = data.rows;
        res.json({ resources });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // GET ROUTE FOR COMMENTS
  router.post('/comments', (req, res) => {
    const { user_id, resource_id, content } = req.body;

    // console.log('=====================');
    console.log(req);
    // console.log('=====================');
    db.query(
      `
        INSERT INTO comments(user_id, resource_id, content)
        VALUES($1, $2, $3)`,
      [ user_id, resource_id, content ]
    );
  });
  return router;
};
