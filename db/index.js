const pgp = require('pg-promise')();

// configuration object
const cn = {
    host: 'localhost',
    port: 5432,
    database: 'pink_playhouse',
    // change this to your user name
    // (type 'whoami' into the terminal if there's any doubt)
};

const db = pgp(process.env.DATABASE_URL || cn);

module.exports = db;