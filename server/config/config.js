process.env.PORT = process.env.PORT || 3000;

// ============================
// ======== ENVIROMENT ========
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
// ======== DATA BASE  ========
// ============================
let urlDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/db-coffee' : 'mongodb://user:123qwe@ds163764.mlab.com:63764/db-coffee';

process.env.URLDB = urlDB;