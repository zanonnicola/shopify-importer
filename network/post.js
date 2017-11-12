const axios = require("axios");

module.exports = (json, endpoint) => {
  return axios.post(
    `https://${process.env.SHOP_NAME}.myshopify.com/${endpoint}`,
    json,
    {
      headers: { "Content-Type": "application/json; charset=utf-8" },
      withCredentials: true,
      auth: {
        username: process.env.API_KEY,
        password: process.env.PASSWORD
      }
    }
  );
};
