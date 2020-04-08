const query = {};

query.getLikesCount = function (db, user_id) {
    return db
        .query(
            `
        SELECT COUNT(*)
        FROM resources 
        JOIN likes ON resources.id = resource_id
        WHERE user_id = $1::integer;
      `, [user_id]
        )
        .then((res) => {
            if (res) {
                return res.rows;
            } else {
                console.log('ERROR in getting all data from resources');
                return null;
            }
        })
        .catch((err) => console.log(err));
};



query.addLikedResource = function (resource) {
  return db
    .query(
      `INSERT INTO likes(
    user_id, resource_id)
    VALUES (2,1);
    `
    )
    .then((res) => res.rows)
    .catch((err) => console.log(err));
};


module.exports =  query;