const axios = require("axios");
require("dotenv").config();

module.exports = (json, endpoint) => {
  return axios({
    method: "delete",
    url: `https://${process.env.SHOP_NAME}.myshopify.com/${endpoint}`,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    auth: {
      username: process.env.API_KEY,
      password: process.env.PASSWORD
    }
  });
};
