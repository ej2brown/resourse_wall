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
module.exports =  query;



//   const addLikedResource = function() {
//   //TO DO implement
//   }
//   exports.addLikedResource = addLikedResource;
