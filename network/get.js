const axios = require("axios");

module.exports = (endpoint, params = "") => {
  return axios(
    `https://${process.env.SHOP_NAME}.myshopify.com/${endpoint}${params}`,
    {
      auth: {
        username: process.env.API_KEY,
        password: process.env.PASSWORD
      }
    }
  );
};
