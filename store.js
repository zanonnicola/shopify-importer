const store = require("json-fs-store")();

const arr = [];
store.list(function(err, object) {
  if (err) throw err; // err if JSON parsing failed
  const cat = object.filter(item => item.category == "Products & Accessories");
  console.log(cat.length);
});
