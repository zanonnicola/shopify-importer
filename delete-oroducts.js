require("dotenv").config();
const createThrottle = require("async-throttle");
const get = require("./network/get");
const deleteStore = require("json-fs-store")("./store-delete");
const del = require("./network/delete");

const throttle = createThrottle(2);

function prepare() {
  get("admin/products.json", "Precision Plus Needles")
    .then(response => {
      return response.data.products;
    })
    .then(products => {
      const collections = [];
      products.forEach(element => {
        const obj = {
          id: element.id,
          handle: element.handle
        };
        collections.push(obj);
      });
      deleteStore.add(collections, function(err) {
        if (err) throw err; // err if the save failed
      });
    })
    .catch(error => {
      console.log(error);
    });
}

function remove() {
  deleteStore.list(function(err, object) {
    if (err) throw err; // err if JSON parsing failed
    object[0].forEach(element => {
      throttle(async () => {
        const res = await del(`admin/products/${element.id}.json`);
        return res;
      })
        .then(function(response) {
          console.log(
            response.headers["x-shopify-shop-api-call-limit"],
            response.status
          );
          // Keeping track of the current API limit
          numOfRequests = response.headers[
            "x-shopify-shop-api-call-limit"
          ].split("/")[0];
          console.log(`Limit: ${numOfRequests}`);
          console.log(response.data);
          console.log("#---------------------#");
        })
        .catch(err => {
          console.log(err);
        });
    });
  });
}

prepare();
