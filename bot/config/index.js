const config = {
  PORT: process.env.PORT || 3000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  AGENT_HOSTNAME: process.env.AGENT_HOSTNAME || 'localhost',
  AGENT_PORT: process.env.AGENT_PORT || 3000,
  TG: {
    TG_API_KEY: process.env.TG_API_KEY,
    TG_BOT_USERNAME: process.env.TG_BOT_USERNAME,
  },
  APP: {
    FREE_USER: {
      QUOTA_LIMIT: 10,
    },
    PREMIUM_USER: {
      QUOTA_LIMIT: 0,
    },
  },
};

module.exports = config;
