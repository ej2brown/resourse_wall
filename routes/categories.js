const express = require('express');
const router = express.Router();

module.exports = (db) => {
    //CATEGORIES GET route

    router.get('/', (req, res) => {
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

    return router;
};
