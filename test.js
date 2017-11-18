const store = require("json-fs-store")("./test-store");

store.add({ a: "b" }, err => {
  // called when the file has been written
  // to the /path/to/storage/location/12345.json
  if (err) throw err; // err if the save failed
});
