require("dotenv").config();
const csv = require("csvtojson");
const path = require("path");
const delay = require("delay");

const customerSchema = require("./entities/customer");
const postDataToShopify = require("./network");

const ROOT = __dirname;
const filePath = path.normalize(path.join(ROOT, "csv/customers.csv"));
const customers = [];

csv({ checkColumn: true, workerNum: 3 })
  .fromFile(filePath)
  .on("json", jsonObj => {
    customers.push(jsonObj);
  })
  .on("done", error => {
    if (error) {
      throw new Error(`Something went wrong ${error}`);
    }
    console.log(`# of Customers: ${customers.length}`);
    createCustomer(customers);
  });

let limit = 40;

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
