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

// ============================
// ======== TOKEN CONFIG ======
// ============================
process.env.EXPIRES_TOKEN = 60 * 60 * 24 * 30;
process.env.SEED_SIGN = process.env.SEED_SIGN || 'seed-dev';