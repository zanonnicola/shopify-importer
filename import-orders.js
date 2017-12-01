require("dotenv").config();
const productStore = require("json-fs-store")();
const customersStore = require("json-fs-store")("./store-customers");
const ordersStore = require("json-fs-store")("./store-orders");
const createThrottle = require("async-throttle");

const postDataToShopify = require("./network/post");
const throttle = createThrottle(2);

ordersStore.list(function(err, orders) {
  if (err) throw err; // err if JSON parsing failed
  orders.forEach(order => {
    console.log(order.customer_id);
    constructObj(order)
      .then(obj => {
        const json = JSON.stringify(obj);
        throttle(async () => {
          const res = await postDataToShopify(json, "/admin/orders.json");
          return res;
        })
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
});

async function constructObj(item) {
  const customerObj = await loadObjFromStore(item.customer_id, customersStore);
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

  return {
    order: {
      fulfillment_status: "fulfilled",
      note_attributes: [
        {
          name: "Comment",
          value: item.comment
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
          amount: item.total
        }
      ],
      financial_status: normalizeStatus(item.status),
      shipping_address: {
        first_name: item.shipping_firstname,
        last_name: item.shipping_lastname,
        company: item.shipping_company,
        address1: item.shipping_address_1,
        address2: item.shipping_address_2,
        city: item.shipping_city,
        country: item.shipping_country,
        zip: item.shipping_postcode
      },
      billing_address: {
        first_name: item.payment_firstname,
        last_name: item.payment_lastname,
        company: item.payment_company,
        address1: item.payment_address_1,
        address2: item.payment_address_2,
        city: item.payment_city,
        country: item.payment_country,
        zip: item.payment_postcode
      },
      total_tax: item.tax,
      subtotal_price: item.subTotal,
      shipping_lines: [
        {
          code: item.shipping_method,
          price: item.shipping,
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
      return "paid";
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
