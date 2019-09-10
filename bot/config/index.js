const config = {
  PORT: process.env.PORT || 3000,
  TG: {
    TG_API_KEY: process.env.TG_API_KEY,
    TG_BOT_USERNAME: process.env.TG_BOT_USERNAME,
  },
  DB: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
  },
  APP: {
    FREE_USER: {
      QUOTA_LIMIT: 0,
    },
    PREMIUM_USER: {
      QUOTA_LIMIT: 0,
    },
  },
};

module.exports = config;
