const path = require("path");
const csv = require("csvtojson");
const ordersStore = require("json-fs-store")("./store-orders");
const _ = require("lodash");

const ROOT = __dirname;
const filePath = path.normalize(path.join(ROOT, "csv/orders/order-test.csv"));
const orders = [];

csv({ checkColumn: true, workerNum: 3 })
  .fromFile(filePath)
  .on("json", jsonObj => {
    orders.push(jsonObj);
  })
  .on("done", error => {
    if (error) {
      throw new Error(`Something went wrong ${error}`);
    }
    const byId = _.groupBy(orders, "Order_id");
    const finalArr = [];

    _.forOwn(byId, function(value, key) {
      const finalObj = {
        line_items: [],
        productsSum: 0,
        taxSum: 0
      };
      value.forEach(item => {
        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            const element = item[key];
            if (key == "Product_item") {
              finalObj.line_items.push({
                variant_id: element,
                name: item.Product_name,
                title: item.Product_name,
                price: parseFloat(item.Product_total),
                quantity: item.Product_quantity,
                vendor: "Finishing Touches",
                tax_lines: [
                  {
                    price: parseFloat(item.Tax),
                    rate: 0.2,
                    title: "VAT"
                  }
                ]
              });
              finalObj.productsSum +=
                parseFloat(item.Product_total) + parseFloat(item.Tax);
              finalObj.taxSum += parseFloat(item.Tax);
            } else {
              finalObj[key] = element;
            }
          }
        }
      });
      if (finalObj.Order_id !== value.Order_id) {
        finalArr.push(finalObj);
      }
    });
    finalArr.forEach((data, index) => {
      data.id = index + 1;
      ordersStore.add(data, function(err) {
        if (err) throw err; // err if the save failed
      });
    });
  });
