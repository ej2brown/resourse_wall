/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const request = require('request-promise-native');
const query = require('../lib/query.js')



module.exports = (db) => {
  router.get('/', (req, res) => {
    db
      .query(
        `
        SELECT resources.*, users.name, COUNT(likes.id)::integer as like_count
        FROM resources
        LEFT JOIN likes On resources.id = likes.resource_id
        JOIN categories ON categories.id = resources.category_id
        JOIN users ON users.id = categories.user_id
        WHERE users.id = 1
        GROUP BY resources.id, users.name;`
      )
      .then((data) => {
        const resources = data.rows;
        // res.send('OK')
        console.log('===resources===', resources)
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
    res.render('new_resource');
  });

  // ADD RESOURCE POST ROUTE
  router.post('/addResource', (req, res) => {
    const input = req.body;

    db.query(`select * from categories where name = '${input.category}';`).then((data) => {
      if (data.rows[0]) {
        request(
          `https://api.linkpreview.net/?key=3bd09bc66604502d6b96be1b65dca12c&q=https://${input.url}`
        ).then((img) => {
          const parsed = JSON.parse(img);
          console.log('======', parsed);
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
        db
          .query(
            `INSERT INTO categories(user_id, name)
                  VALUES(1,'${input.category}')
                  RETURNING *;`
          )
          .then(
            request(
              `https://api.linkpreview.net/?key=3bd09bc66604502d6b96be1b65dca12c&q=https://${input.url}`
            ).then((img) => {
              const parsed = JSON.parse(img);
              console.log(parsed);
              db
                .query(
                  `INSERT INTO resources(title, category_id,description,image, url)
            VALUES('${input.title}','${data.rows[0].id}','${input.description}','${parsed.image}','${input.url}');`
                )
                .then(res.redirect('/'))
                .catch((e) => res.send(e));
            })
          )
          .then(res.redirect('/'))
          .catch((e) => res.send(e));
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

//   // ADD RESOURCE GET ROUTE
//   router.get('/addResource', (req, res) => {
//     res.render('new_resource');
//   });

//   // ADD RESOURCE POST ROUTE
//   router.post('/addResource', (req, res) => {
//     // add logic for IF logged in, otherwise display message 'please login to add resource'
// console.log('in addresource')
//     const input = req.body;

//     const createResource = (req, res, categoryId) => {
//       db.query(
//         `INSERT INTO resources(title, category_id,description, url)
//          VALUES('${input.title}','${input.description}','${input.url}');`
//       );
//     };

//     // 1. separate the create a new resource db query into a separate function eg, const createResource = (req, res, categoryId) => { /* copy the full db query here */ }
//     // 2. query db for category by name
//     // 3. in the .then() for that query, if the category exists, use the id on the category and create a new resource by calling createResource(req, res, categoryId)
//     // 4. if the category does not exist, make a new db insert call with the category name, and use RETURNING * at the end of your query to return the category in the then for this db call
//     // 5. in the .then() for your insert category call, create a new resource by calling createResource(req, res, categoryId)

//     db.query(`select * from categories where name = '${input.category}';`).then((data) => {
//       if (data.rows[0]) {
//         db
//           .query(
//             `INSERT INTO resources(title, category_id,description, url)
//                   VALUES('${input.title}','${data.rows[0].id}','${input.description}','${input.url}');`
//           )
//           .then(res.redirect('/'))
//           .catch((e) => res.send(e));
//       } else {
//         console.log('in else');
//         db
//           .query(
//             `INSERT INTO categories(user_id, name)
//                   VALUES(1,'${input.category}')
//                   RETURNING *;`
//           )
//           .then((data) => {
//             db.query(
//               `INSERT INTO resources(title, category_id,description, url)
//                   VALUES('${input.title}','${data.rows[0].id}','${input.description}','${input.url}');`
//             );
//           })
//           .then(res.redirect('/'))
//           .catch((e) => res.send(e));
//       }
//     });
//   });

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
        SELECT resources.*, users.name, COUNT(likes.id)::integer as like_count
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
  })

  return router;
};
