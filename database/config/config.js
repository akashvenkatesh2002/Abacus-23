require('dotenv').config();

module.exports ={
  "development": {
    "username": process.env.USERNAME,
    "password": process.env.PASSWORD,
    "database": process.env.DATABASE,
    "host": process.env.HOST,
    "url": process.env.DEV_DATABASE_URL,
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": true
    },
    "timezone": "+05:30"
  },
  "test": {
    "url": process.env.TEST_DATABASE_URL,
    "dialect": "postgres",
    "ssl": true
  },
  "production": {
    "url": process.env.DEV_DATABASE_URL,
    "dialect": "postgres",
    "ssl": true
  }
}
