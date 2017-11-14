require("dotenv").config();
const csv = require("csvtojson");
const path = require("path");
const delay = require("delay");

const productSchema = require("./entities/products");
const collectionSchema = require("./entities/collections");
const postDataToShopify = require("./network/post");
const getDataFromShopify = require("./network/get");

const ROOT = __dirname;
const filePathProducts = path.normalize(path.join(ROOT, "csv/products.csv"));
const products = [];
const maxAPIcalls = 35;

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

getDataFromShopify("admin/products.json", "?product_type=machine")
  .then(response => {
    console.log(response.data.products);
    return response.data.products;
  })
  .then(products => {
    products.forEach(product => {
      const data = collectionSchema(product);
      const json = JSON.stringify(data);
      postDataToShopify(json, "admin/collects.json", limit);
    });
  })
  .catch(error => {
    console.log(error);
  });
