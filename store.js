const store = require("json-fs-store")("./store-orders");
const _ = require("lodash");

// const arr = [];
// store.list(function(err, object) {
//   if (err) throw err; // err if JSON parsing failed
//   const cat = object.filter(item => item.category == "Products & Accessories");
//   console.log(cat.length);
// });

store.list(function(err, object) {
  if (err) throw err; // err if JSON parsing failed
  const finalObj = {
    line_items: []
  };

  _.forOwn(object[0], function(value, key) {
    console.log(key);
  });
});
