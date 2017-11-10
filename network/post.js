const axios = require("axios");

module.exports = (json, endpoint, limit) => {
  axios
    .post(`https://${process.env.SHOP_NAME}.myshopify.com/${endpoint}`, json, {
      headers: { "Content-Type": "application/json; charset=utf-8" },
      withCredentials: true,
      auth: {
        username: process.env.API_KEY,
        password: process.env.PASSWORD
      }
    })
    .then(function(response) {
      console.log(
        response.headers["x-shopify-shop-api-call-limit"],
        response.status
      );
      // Keeping track of the current API limit
      limit -= response.headers["x-shopify-shop-api-call-limit"].split("/")[0];
      console.log(`Limit: ${limit}`);
    })
    .catch(function(error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Response Error");
        console.log(error.response.status);
        //console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log("Request Error", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
};
