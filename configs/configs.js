// Database configuration using environment variables
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// Leopard SMS API configuration using environment variables
const leopardSmsApiConfig = {
  apiUrl: process.env.LEOPARD_SMS_API_URL,
  apiKey: process.env.LEOPARD_SMS_API_KEY,
};

module.exports = { dbConfig, leopardSmsApiConfig };
