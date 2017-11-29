const path = require("path");
const csv = require("csvtojson");
const _ = require("lodash");

const ROOT = __dirname;
const filePath1 = path.normalize(
  path.join(ROOT, "csv/merge/query_result-1.csv")
);
const filePath2 = path.normalize(
  path.join(ROOT, "csv/merge/query_result-2.csv")
);

const convert = function(filePath) {
  const orders = [];
  return new Promise(resolve => {
    csv({ checkColumn: true, workerNum: 3 })
      .fromFile(filePath)
      .on("json", jsonObj => {
        orders.push(jsonObj);
      })
      .on("done", error => {
        if (error) {
          throw new Error(`Something went wrong ${error}`);
        }
        const byId = _.groupBy(orders, "order_id");
        resolve(byId);
      });
  });
};

const merge = async function() {
  const a = await convert(filePath1);
  const b = await convert(filePath2);
  const cleanB = {};

  for (let key in b) {
    cleanB[key] = {};
    if (b.hasOwnProperty(key)) {
      b[key].forEach(element => {
        if (cleanB[key][element.code_title] !== element.code_title) {
          cleanB[key][element.code_title] = element.code_value;
        }
      });
    }
  }

  let obj = {};
  for (let key in a) {
    if (a.hasOwnProperty(key)) {
      obj[key] = a[key].concat(cleanB[key]);
    }
  }
  return obj;
};

module.exports = merge;
