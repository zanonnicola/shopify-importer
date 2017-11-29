const path = require("path");
const ordersStore = require("json-fs-store")("./store-orders");
const _ = require("lodash");
const merge = require("./merge-csv");

const finalArr = [];

merge().then(byId => {
  const finalObj = {
    line_items: [],
    subTotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  };
  _.forOwn(byId, function(value, key) {
    value.forEach(item => {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          const element = item[key];
          if (key == "product_item") {
            finalObj.line_items.push({
              variant_id: element,
              name: item.product_name,
              title: item.product_name,
              price: parseFloat(item.product_total),
              quantity: item.product_quantity,
              vendor: "Finishing Touches",
              tax_lines: [
                {
                  price: parseFloat(item.product_price),
                  rate: 0.2,
                  title: "VAT"
                }
              ]
            });
          } else {
            finalObj[key] = element;
          }
          subTotal = item["sub_total"];
          shipping = item["shipping"];
          tax = item["tax"];
          total = item["total"];
        }
      }
    });
    if (finalObj.order_id !== value.order_id) {
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
