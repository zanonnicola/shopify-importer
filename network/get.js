const axios = require("axios");

module.exports = (endpoint, param = "") => {
  return axios.get(
    `https://${process.env.SHOP_NAME}.myshopify.com/${endpoint}`,
    {
      params: {
        product_type: param
      },
      auth: {
        username: process.env.API_KEY,
        password: process.env.PASSWORD
      }
    }
  );
};
