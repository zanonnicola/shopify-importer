require("dotenv").config();
const store = require("json-fs-store")();
const createThrottle = require("async-throttle");

const collectionSchema = require("./entities/collections");
const postDataToShopify = require("./network/post");
const getDataFromShopify = require("./network/get");

const throttle = createThrottle(2);

store.list(function(err, objects) {
  if (err) throw err;
  objects.forEach(element => {
    console.log(element.newProductId);
    const ID = element.newProductId;
    const data = {
      collect: {
        product_id: ID,
        collection_id: 11756404765
      }
    };
    const json = JSON.stringify(data);
    throttle(async () => {
      const res = await postDataToShopify(json, "admin/collects.json");
      return res;
    })
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
        console.log(response.data.collect.collection_id);
        console.log("#---------------------#");
      })
      .catch(err => {
        console.log(err);
      });
  });
});

// getDataFromShopify("admin/products.json", "Christmas")
//   .then(response => {
//     return response.data.products;
//   })
//   .then(products => {
//     const collections = products.map(
//       throat(2, product => {
//         return assignCollections(product)
//           .then(obj => {
//             console.log("Assigning Collection...", obj, "-------------");
//           })
//           .catch(err => {
//             console.log("Error in assigning Collection...");
//             console.log(err);
//             console.log("-------------");
//           });
//       })
//     );
//   })
//   .catch(error => {
//     console.log(error);
//   });

// function assignCollections(product) {
//   const data = collectionSchema(product, 11756404765);
//   const json = JSON.stringify(data);
//   return new Promise((resolve, reject) => {
//     postDataToShopify(json, "admin/collects.json")
//       .then(function(response) {
//         console.log(
//           response.headers["x-shopify-shop-api-call-limit"],
//           response.status
//         );
//         // Keeping track of the current API limit
//         numOfRequests = response.headers["x-shopify-shop-api-call-limit"].split(
//           "/"
//         )[0];
//         console.log(`Limit: ${numOfRequests}`);
//         console.log(`Position: ${response.collect.id}`);
//         resolve(response.collect);
//       })
//       .catch(err => {
//         reject(`Error in call: ${err}`);
//       });
//   });
// }

process.on("unhandledRejection", error => {
  // Will print "unhandledRejection err is not defined"
  console.log("unhandledRejection");
});
