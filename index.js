require("dotenv").config();
const csv = require("csvtojson");
const path = require("path");
const delay = require("delay");

const customerSchema = require("./entities/customer");
const productSchema = require("./entities/products");
const postDataToShopify = require("./network");

const ROOT = __dirname;
const filePath = path.normalize(path.join(ROOT, "csv/customers.csv"));
const filePathProducts = path.normalize(path.join(ROOT, "csv/products.csv"));
const customers = [];
const products = [];
let limit = 40;

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

    if (limit > 3) {
      postDataToShopify(json, "admin/customers.json", limit);
    } else {
      delay(2000).then(() => {
        postDataToShopify(json, "admin/customers.json", limit);
      });
    }
  });
}

function createProduct(arr) {
  arr.forEach(product => {
    const data = productSchema(product);
    const json = JSON.stringify(data);

    if (limit > 3) {
      postDataToShopify(json, "/admin/products.json", limit);
    } else {
      delay(2000).then(() => {
        postDataToShopify(json, "/admin/products.json", limit);
      });
    }
  });
}
