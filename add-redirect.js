require("dotenv").config();
const store = require("json-fs-store")();
const createThrottle = require("async-throttle");
const postDataToShopify = require("./network/post");
const { urls } = require("./json/redirects.json");

const throttle = createThrottle(2);

urls.forEach(element => {
  const redirect = {
    redirect: {
      path: element.path,
      target: escape(`/products/${element.target}`)
    }
  };
  const json = JSON.stringify(redirect);
  throttle(async () => {
    const res = await postDataToShopify(json, "admin/redirects.json");
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
      console.log(response.data.redirect.id);
      console.log("#---------------------#");
    })
    .catch(err => {
      console.log(err);
    });
});

// objects.forEach(element => {
//   console.log(element.newProductId);
//   const ID = element.newProductId;
//   const data = {
//     collect: {
//       product_id: ID,
//       collection_id: 11756404765
//     }
//   };
//   const json = JSON.stringify(data);
//   throttle(async () => {
//     const res = await postDataToShopify(json, "admin/collects.json");
//     return res;
//   })
//     .then(function(response) {
//       console.log(
//         response.headers["x-shopify-shop-api-call-limit"],
//         response.status
//       );
//       // Keeping track of the current API limit
//       numOfRequests = response.headers["x-shopify-shop-api-call-limit"].split(
//         "/"
//       )[0];
//       console.log(`Limit: ${numOfRequests}`);
//       console.log(response.data.collect.collection_id);
//       console.log("#---------------------#");
//     })
//     .catch(err => {
//       console.log(err);
//     });
// });

// process.on("unhandledRejection", error => {
//   // Will print "unhandledRejection err is not defined"
//   console.log("unhandledRejection");
// });
