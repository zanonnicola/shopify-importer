const store = require("json-fs-store")();

store.load("778", function(err, object) {
  if (err) throw err; // err if JSON parsing failed

  // do something with object here
  console.log(object);
});
