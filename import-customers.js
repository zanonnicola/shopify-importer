require("dotenv").config();
const csv = require("csvtojson");
const path = require("path");
// const pThrottle = require('p-throttle');
const throat = require("throat");
const store = require("json-fs-store")();

const customerSchema = require("./entities/customer");
const postDataToShopify = require("./network/post");

const ROOT = __dirname;
const filePathCustomers = path.normalize(path.join(ROOT, "csv/customers.csv"));
const customers = [];
const customersIdMap = [];
const maxAPIcalls = 35;

csv({ checkColumn: true, workerNum: 3 })
  .fromFile(filePathCustomers)
  .on("json", jsonObj => {
    customers.push(jsonObj);
  })
  .on("done", error => {
    if (error) {
      throw new Error(`Something went wrong ${error}`);
    }
    console.log(`# of customers: ${customers.length}`);
    const queue = customers.map(
      throat(2, customer => {
        return sendCustomersToShopify(customer)
          .then(obj => {
            obj.id = obj.oldCustomerId;
            store.add(obj, err => {
              // called when the file has been written
              // to the /path/to/storage/location/12345.json
              if (err) throw err; // err if the save failed
            });
          })
          .catch(err => {
            console.log(err);
            const id = `err-${Math.floor(Math.random() * (1 - 2000)) + 1}`;
            store.add({ id, error: err }, err => {
              // called when the file has been written
              // to the /path/to/storage/location/12345.json
              if (err) throw err; // err if the save failed
            });
          });
      })
    );
  });

function sendCustomersToShopify(person) {
  const data = customerSchema(person);
  const json = JSON.stringify(data);
  return new Promise((resolve, reject) => {
    postDataToShopify(json, "admin/customers.json")
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
        console.log(`oldCustomerId: ${person.customer_id}`);
        resolve({
          oldCustomerId: person.customer_id,
          email: person.email,
          newCustomerId: response.data.customer.id
        });
      })
      .catch(err => {
        reject(`Error in call: ${err} + ${person.customer_id}`);
      });
  });
}

// getDataFromShopify("admin/customers.json", "?ids")
//   .then(response => {
//     console.log(response.data);
//     return response.data;
//   })
//   .then(customers => {
//     customers.forEach(customer => {
//       const data = ordersSchema(customer);
//       const json = JSON.stringify(data);
//       postDataToShopify(json, "/admin/orders.json", limit);
//     });
//   })
//   .catch(error => {
//     console.log(error);
//   });

process.on("unhandledRejection", error => {
  // Will print "unhandledRejection err is not defined"
  console.log("unhandledRejection");
});
