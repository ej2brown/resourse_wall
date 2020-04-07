let dbParams = {};
if (process.env.DATABASE_URL) {
  dbParams.connectionString = process.env.DATABASE_URL;
} else {
  dbParams = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  };
}

module.exports = dbParams;

const getLikesCount = function(user_id) {
  return db
    .query(
      `
      SELECT COUNT(*)
      FROM resources 
      JOIN likes ON resources.id = resource_id
      WHERE user_id = 2;
    `
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
exports.getLikesCount = getLikesCount;


const addLikedResource = function() {

}

exports.addLikedResource = addLikedResource;
