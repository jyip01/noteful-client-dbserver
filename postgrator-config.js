require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "role": "jyip",
  "db": "recommend_test",
  "connectionString": (process.env.NODE_ENV === 'test')
    ? "postgresql://jyip:1234@localhost/noteful_test"
    : process.env.DATABASE_URL,
  "ssl": !!process.env.SSL,
    
};