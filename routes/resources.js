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

const cookieSession = require('cookie-session');

router.use(
  cookieSession({
    name: 'session123',
    keys: [ 'key' ]
  })
);

module.exports = (db) => {
  router.get('/', (req, res) => {
    if (!req.session.id) {
      db
        .query(
          `
        SELECT resources.*, users.name, COUNT(likes.resource_id) as likes_count, ROUND(AVG(ratings.star_rating),1) as star_rating
        FROM resources
        LEFT JOIN likes On resources.id = likes.resource_id
        JOIN categories ON categories.id = resources.category_id
        JOIN users ON users.id = categories.user_id
	      LEFT JOIN ratings ON resources.id = ratings.resource_id     
        GROUP BY resources.id, users.name
		    ORDER BY resources.id;`
        )
        .then((data) => {
          const resources = data.rows;
          res.json({ resources });
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    }

    if (req.session.id) {
      db
        .query(
          `
        SELECT resources.*, users.name, COUNT(likes.id)::integer as likes_count
        FROM resources
        LEFT JOIN likes On resources.id = likes.resource_id
        JOIN categories ON categories.id = resources.category_id
        JOIN users ON users.id = categories.user_id
        WHERE users.id = '${req.session.id}'
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
    }
  });

  router.get('/comments', (req, res) => {
    // res.render('new_resource');
    db
    .query(
      `SELECT comments.*, users.name
      FROM comments
      JOIN users ON users.id = user_id
      GROUP BY comments.id, users.name;`
        ) 
        .then((data) => {
          const comments = data.rows;
          console.log('comments', comments)
          res.json({ comments });
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
      
  });

  // ADD RESOURCE GET ROUTE
  router.get('/addResource', (req, res) => {
    if (!req.session.id) {
      res.render('login');
      return;
    }
    res.render('new_resource');
  });

  // ADD RESOURCE POST ROUTE
  router.post('/addResource', (req, res) => {
    if (!req.session.id) {
      res.render('login');
    }

    const input = req.body;
    var urlForAPI = req.body.url.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];

    console.log('====', urlForAPI);

    db
      .query(
        `select *,categories.id from categories join users on users.id = categories.user_id where categories.name = '${input.category}' and users.id='${req
          .session.id}';`
      )
      .then((data) => {
        if (data.rows[0]) {
          request(
            `https://api.linkpreview.net/?key=3bd09bc66604502d6b96be1b65dca12c&q=http://${urlForAPI}`
          ).then((img) => {
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
          db.query(`select * from users where id = '${req.session.id}'`).then((user) => {
            db
              .query(
                `INSERT INTO categories(user_id, name)
                    VALUES(${user.rows[0].id},'${input.category}')
                    RETURNING *;`
              )
              .then((data) => {
                const newCatId = data.rows[0].id;
                return request(
                  `https://api.linkpreview.net/?key=3bd09bc66604502d6b96be1b65dca12c&q=http://${urlForAPI}`
                )
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
        }
      });
  });

  // SEARCH GET ROUTE
  router.get('/search', (req, res) => {
    const input = req.query.search;
    db
      .query(
        `SELECT * FROM resources join categories on categories.id = category_id WHERE title LIKE '%${input}%' or categories.name LIKE '%${input}%';`
      )
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
        WHERE users.id = '${req.session.id}'
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
    const resource_id = Object.keys(req.body);
    const content = Object.values(req.body);
    const user_id = req.session.id;
    db
      .query(
        `
        INSERT INTO comments(user_id, resource_id, content)
        VALUES($1, $2, $3);`,
        [user_id, resource_id, content]
      )
      .then(() => {
        console.log('inserted comment');
        res.sendStatus(200)
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post('/addLikes', (req, res) => {
    const resource_id = Object.values(req.body);
    const user_id = req.session.id;
    db
      .query(
        `INSERT INTO likes(user_id, resource_id)
        VALUES (${user_id}, ${resource_id});`
      )
      .then(() => {
        console.log('added like');
        res.sendStatus(200)
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post('/addRatings', (req, res) => {
    const resource_id = Object.keys(req.body)
    const star_rating= Object.values(req.body);
    const user_id = req.session.id;
    db
      .query(
        `INSERT INTO ratings(user_id, resource_id, star_rating)
        VALUES (${user_id}, ${resource_id}, ${star_rating});`
      )
      .then(() => {
        console.log('added ratings');
        res.sendStatus(200)
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
