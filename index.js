require("dotenv").config();
const csv = require("csvtojson");
const path = require("path");
const delay = require("delay");

const customerSchema = require("./entities/customer");
const productSchema = require("./entities/products");
const collectionSchema = require("./entities/collections");
const postDataToShopify = require("./network/post");
const getDataFromShopify = require("./network/get");

const mapCustomer = require("./map-customer");

const ROOT = __dirname;
const filePathCustomers = path.normalize(path.join(ROOT, "csv/customers.csv"));
const filePathProducts = path.normalize(path.join(ROOT, "csv/products.csv"));
const customers = [];
const customersIdMap = [];
const products = [];
const maxAPIcalls = 35;

csv({ checkColumn: true, workerNum: 3 })
  .fromFile(filePathCustomers)
  .on("json", jsonObj => {
    customers.push(jsonObj);
    //products.push(jsonObj);
  })
  .on("done", error => {
    if (error) {
      throw new Error(`Something went wrong ${error}`);
    }
    console.log(`# of products: ${customers.length}`);
    //createProduct(products);

    Promise.all(
      customers.map(customer => {
        return sendCustomersToShopify(customer);
      })
    )
      .then(res => {
        customersIdMap.push(...res);
        console.log("syncLooop done", customersIdMap);
        console.log("Length", customersIdMap.length);

        mapCustomer(customersIdMap);
      })
      .catch(function(error) {
        console.log("Error", error.message);
      });
  });

function sendCustomersToShopify(person) {
  const data = customerSchema(person);
  const json = JSON.stringify(data);
  return new Promise(function(resolve) {
    delay(500).then(() => {
      postDataToShopify(json, "admin/customers.json").then(function(response) {
        console.log(
          response.headers["x-shopify-shop-api-call-limit"],
          response.status
        );
        // Keeping track of the current API limit
        numOfRequests = response.headers["x-shopify-shop-api-call-limit"].split(
          "/"
        )[0];
        console.log(`Limit: ${numOfRequests}`);
        resolve({
          oldCustomerId: person.address_id,
          newCustomerId: response.data.customer.id
        });
      });
    });
  });
}

function createProduct(arr) {
  arr.forEach(product => {
    const data = productSchema(product);
    const json = JSON.stringify(data);
    if (maxAPIcalls < numOfRequests) {
      postDataToShopify(json, "/admin/products.json", numOfRequests);
    } else {
      delay(500).then(() => {
        postDataToShopify(json, "/admin/products.json", numOfRequests);
      });
    }
  });
}

// getDataFromShopify("admin/products.json", "?product_type=machine")
//   .then(response => {
//     console.log(response.data.products);
//     return response.data.products;
//   })
//   .then(products => {
//     products.forEach(product => {
//       const data = collectionSchema(product);
//       const json = JSON.stringify(data);
//       postDataToShopify(json, "admin/collects.json", limit);
//     });
//   })
//   .catch(error => {
//     console.log(error);
//   });

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
