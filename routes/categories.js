const express = require('express');
const router = express.Router();
const request = require('request-promise-native');

const cookieSession = require('cookie-session');

router.use(
  cookieSession({
    name: 'session123',
    keys: [ 'key' ]
  })
);

module.exports = (db) => {
  //CATEGORIES GET route

  router.get('/', (req, res) => {
    const user_exists = req.session.id;
    db
      .query(`SELECT * from categories;`)
      .then((data) => {
        const categories = data.rows;
        res.render('categories', { categories, user_exists });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get('/:category', (req, res) => {
    const user_exists = req.session.id;
    const category = req.params.category;

    db
      .query(`SELECT * from categories join resources on categories.id = category_id where name='${category}';`)
      .then((data) => {
        const categories = data.rows;
        console.log(categories);
        res.render('categoryResults', { categories, user_exists });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
