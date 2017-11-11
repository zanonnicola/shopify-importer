require("dotenv").config();
const csv = require("csvtojson");
const path = require("path");
const delay = require("delay");

const customerSchema = require("./entities/customer");
const productSchema = require("./entities/products");
const collectionSchema = require("./entities/collections");
const postDataToShopify = require("./network/post");
const getDataFromShopify = require("./network/get");

const ROOT = __dirname;
const filePath = path.normalize(path.join(ROOT, "csv/customers.csv"));
const filePathProducts = path.normalize(path.join(ROOT, "csv/products.csv"));
const customers = [];
const products = [];
const maxAPIcalls = 35;
let numOfRequests;

csv({ checkColumn: true, workerNum: 3 })
  .fromFile(filePathProducts)
  .on("json", jsonObj => {
    products.push(jsonObj);
  })
  .on("done", error => {
    if (error) {
      throw new Error(`Something went wrong ${error}`);
    }
    console.log(`# of products: ${products.length}`);
    createProduct(products);
  });

function createCustomer(arr) {
  arr.forEach(person => {
    const data = customerSchema(person);
    const json = JSON.stringify(data);

    if (maxAPIcalls < numOfRequests) {
      postDataToShopify(json, "admin/customers.json", numOfRequests);
    } else {
      delay(500).then(() => {
        postDataToShopify(json, "admin/customers.json", numOfRequests);
      });
    }
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
