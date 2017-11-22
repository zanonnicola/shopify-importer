require("dotenv").config();
const csv = require("csvtojson");
const path = require("path");
const throat = require("throat");
const store = require("json-fs-store")();

const productSchema = require("./entities/products");
const postDataToShopify = require("./network/post");

const ROOT = __dirname;
const filePathProducts = path.normalize(
  path.join(ROOT, "csv/products/BSDA-membership.csv")
);
const products = [];

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
    const queue = products.map(
      throat(4, product => {
        return sendProductsToShopify(product)
          .then(obj => {
            obj.id = obj.oldProductId;
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

function sendProductsToShopify(product) {
  const data = productSchema(product, "BSDA Membership");
  const json = JSON.stringify(data);
  return new Promise((resolve, reject) => {
    postDataToShopify(json, "/admin/products.json")
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
        console.log(`oldProductId: ${product.product_id}`);
        resolve({
          oldProductId: product.product_id,
          category: product.category_name,
          newProductId: response.data.product.id
        });
      })
      .catch(err => {
        reject(`Error in call: ${err} + ${product.product_id}`);
      });
  });
}
