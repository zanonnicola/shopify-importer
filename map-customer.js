const fs = require("fs");
const { promisify } = require("util");

module.exports = (customers = [], output = "json/customers.json") => {
  const writeFileAsync = promisify(fs.writeFile);
  console.log("Writing....");

  const data = {
    customers
  };

  writeFileAsync(output, JSON.stringify(data), { encoding: "utf8" })
    .then(_ => {
      console.log("CUSTOMERS: Saved");
    })
    .catch(err => {
      console.log("ERROR:", err);
      throw err;
    });
};
