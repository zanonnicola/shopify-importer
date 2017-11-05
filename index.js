const csv = require("csvtojson");
const path = require("path");
const Shopify = require("shopify-api-node");

const ROOT = __dirname;
const filePath = path.normalize(path.join(ROOT, "csv/customers.csv"));
const customers = [];

const shopify = new Shopify({
  shopName: "your-shop-name",
  apiKey: "your-api-key",
  password: "your-app-password"
});

csv({ checkColumn: true, workerNum: 3 })
  .fromFile(filePath)
  .on("json", jsonObj => {
    customers.push(jsonObj);
  })
  .on("done", error => {
    if (error) {
      throw new Error(`Something went wrong ${error}`);
    }
    console.log(customers.length);
  });
