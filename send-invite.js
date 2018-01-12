require("dotenv").config();
// const pThrottle = require('p-throttle');
const throat = require("throat");
const postDataToShopify = require("./network/post");
const getDataFromShopify = require("./network/get");

const maxAPIcalls = 35;

getDataFromShopify(
  "admin/customers.json",
  "100&created_at_max=2018-01-09 23:07:25"
)
  .then(response => {
    console.log(response.data.customers.length);
    return response.data.customers;
  })
  .then(customers => {
    const queue = customers.map(
      throat(2, customer => {
        console.log(customer.state, customer.id);
        if (customer.state === 'disabled') {
          return sendInvite(customer)
          .then(_ => {
            console.log("Done");
          })
          .catch(err => {
            console.log(err);
          });
        }
        return Promise.resolve('No');
      })
    );
  })
  .catch(error => {
    console.log(error);
  });

function sendInvite(person) {
  const data = {
    customer_invite: {}
  };
  const json = JSON.stringify(data);
  return new Promise((resolve, reject) => {
    postDataToShopify(json, `/admin/customers/${person.id}/send_invite.json`)
      .then(function(response) {
        console.log(
          response.headers["x-shopify-shop-api-call-limit"],
          response.status
        );
        // Keeping track of the current API limit
        numOfRequests = response.headers["x-shopify-shop-api-call-limit"].split(
          "/"
        )[0];
        console.log(`Limit: ${numOfRequests}`);
        resolve();
      })
      .catch(err => {
        reject(`Error in call: ${err} + ${person.customer_id}`);
      });
  });
}

process.on("unhandledRejection", error => {
  // Will print "unhandledRejection err is not defined"
  console.log("unhandledRejection");
});
