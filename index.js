require("dotenv").config();
const csv = require("csvtojson");
const path = require("path");
const axios = require("axios");
const delay = require("delay");

const ROOT = __dirname;
const filePath = path.normalize(path.join(ROOT, "csv/customers.csv"));
const customers = [];

csv({ checkColumn: true, workerNum: 3 })
  .fromFile(filePath)
  .on("json", jsonObj => {
    customers.push(jsonObj);
  })
  .on("done", error => {
    if (error) {
      throw new Error(`Something went wrong ${error}`);
    }
    console.log(`# of Customers: ${customers.length}`);
    createCustomer(customers);
  });

let limit = 40;

function createCustomer(arr) {
  arr.forEach(person => {
    const data = {
      customer: {
        email: person.email,
        first_name: person.firstname,
        last_name: person.lastname,
        phone: person.telephone,
        verified_email: true,
        send_email_invite: false,
        addresses: [
          {
            address1: person.address_1,
            address2: person.address2,
            city: person.city,
            province: null,
            company: person.company,
            phone: person.telephone,
            phone: person.telephone,
            zip: person.postcode,
            last_name: person.firstname,
            first_name: person.lastname,
            country: person.country
          }
        ]
      }
    };
    const json = JSON.stringify(data);

    if (limit > 3) {
      postData(json);
    } else {
      delay(2000).then(() => {
        postData(json);
      });
    }
  });
}

function postData(json) {
  axios
    .post(
      `https://${process.env.SHOP_NAME}.myshopify.com/admin/customers.json`,
      json,
      {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        withCredentials: true,
        auth: {
          username: process.env.API_KEY,
          password: process.env.PASSWORD
        }
      }
    )
    .then(function(response) {
      console.log(
        response.headers["x-shopify-shop-api-call-limit"],
        response.status
      );
      limit -= response.headers["x-shopify-shop-api-call-limit"].split("/")[0];
      console.log(`Limit: ${limit}`);
    })
    .catch(function(error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}
