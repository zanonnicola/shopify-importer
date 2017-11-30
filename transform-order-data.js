const path = require("path");
const ordersStore = require("json-fs-store")("./store-orders");
const _ = require("lodash");
const merge = require("./merge-csv");

const finalArr = [];

merge().then(byId => {
  _.forOwn(byId, function(value, key) {
    const finalObj = {
      line_items: [],
      subTotal: 0,
      shipping: 0,
      tax: 0,
      total: 0
    };
    console.log("forOwn");
    value.forEach(item => {
      console.log("forEach");
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          const element = item[key];
          if (key == "product_item") {
            const lineItems = {
              variant_id: element,
              name: item.product_name,
              title: item.product_name,
              price: parseFloat(item.product_price),
              quantity: item.product_quantity,
              vendor: "Finishing Touches",
              tax_lines: [
                {
                  price: parseFloat(item.product_price),
                  rate: 0.2,
                  title: "VAT"
                }
              ]
            };
            finalObj.line_items.push(lineItems);
          } else {
            finalObj[key] = element;
          }
          finalObj.subTotal = item["sub_total"];
          finalObj.shipping = item["shipping"];
          finalObj.tax = item["tax"];
          finalObj.total = item["total"];
        }
      }
    });
    console.log(finalObj.order_id, finalArr.length);
    //console.log(finalObj.order_id, value[0].order_id);
    finalArr.push(finalObj);
  });
  console.log(
    "+++++++++++++++++++++++\n",
    finalArr.length,
    "\n+++++++++++++++++++++++\n"
  );
  console.log(finalArr[2].order_id, finalArr[0].order_id);
  finalArr.forEach((data, index) => {
    data.id = index + 1;
    ordersStore.add(data, function(err) {
      if (err) throw err; // err if the save failed
    });
  });
});
