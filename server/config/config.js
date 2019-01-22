process.env.PORT = process.env.PORT || 3000;

// ============================
// ======== ENVIROMENT ========
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
// ======== DATA BASE  ========
// ============================
let urlDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/db-coffee' : process.env.MONGO_URI;

process.env.URLDB = urlDB;