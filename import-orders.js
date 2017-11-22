require("dotenv").config();
const productStore = require("json-fs-store")();
const customersStore = require("json-fs-store")("./store-customers");
const ordersStore = require("json-fs-store")("./store-orders");

const postDataToShopify = require("./network/post");

ordersStore.list(function(err, object) {
  if (err) throw err; // err if JSON parsing failed
  constructObj(object[1])
    .then(obj => {
      const json = JSON.stringify(obj);
      console.log(json);
      postDataToShopify(json, "/admin/orders.json")
        .then(response => {
          console.log(
            response.headers["x-shopify-shop-api-call-limit"],
            response.status
          );
          // Keeping track of the current API limit
          numOfRequests = response.headers[
            "x-shopify-shop-api-call-limit"
          ].split("/")[0];
          console.log(`Limit: ${numOfRequests}`);
          console.log(response.data.order.id);
        })
        .catch(err => {
          console.log(`Error in call: ${err}`);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

async function constructObj(item) {
  const customerObj = await loadObjFromStore(item.Customer_id, customersStore);
  const lines = await Promise.all(
    item.line_items.map(async product => {
      return await loadObjFromStore(product.variant_id, productStore);
    })
  );

  item.line_items.forEach((el, i) => {
    if (el.hasOwnProperty("variant_id")) {
      el["variant_id"] = lines[i].newProductId;
    }
  });

  const shippingPrice = round(item.Order_total - item.productsSum, 2);

  return {
    order: {
      fulfillment_status: "fulfilled",
      note_attributes: [
        {
          name: "Comment",
          value: item.Comment
        }
      ],
      line_items: [...item.line_items],
      customer: {
        id: customerObj.newCustomerId
      },
      transactions: [
        {
          kind: "sale",
          status: "success",
          amount: item.Order_total
        }
      ],
      financial_status: normalizeStatus(item.Status),
      shipping_address: {
        first_name: item.Shipping_firstname,
        last_name: item.Shipping_lastname,
        company: item.Shipping_company,
        address1: item.Shipping_address_1,
        address2: item.Shipping_address_2,
        city: item.Shipping_city,
        country: item.Shipping_country,
        zip: item.Shipping_postcode
      },
      billing_address: {
        first_name: item.Payment_firstname,
        last_name: item.Payment_lastname,
        company: item.Payment_company,
        address1: item.Payment_address_1,
        address2: item.Payment_address_2,
        city: item.Payment_city,
        country: item.Payment_country,
        zip: item.Payment_postcode
      },
      total_tax: 10.8,
      shipping_lines: [
        {
          code: item.Shipping_method,
          price: shippingPrice,
          title: "Courier",
          carrier_identifier: null,
          requested_fulfillment_service_id: null
        }
      ]
    }
  };
}

function loadObjFromStore(id, store) {
  return new Promise((resolve, reject) => {
    store.load(id, (err, object) => {
      if (err) reject(err); // err if JSON parsing failed
      resolve(object);
    });
  });
}

function normalizeStatus(status) {
  switch (status) {
    case "Complete":
      return "paid";
      break;
    case "Pending":
      return "pending";
      break;
    case "Processing":
      return "pending";
      break;
    case "Refunded":
      return "refunded";
      break;

    default:
      return "voided";
      break;
  }
}
function round(x, n) {
  return parseFloat(Math.round(x * Math.pow(10, n)) / Math.pow(10, n)).toFixed(
    n
  );
}
