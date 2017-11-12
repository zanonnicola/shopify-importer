const fs = require("fs");
const { promisify } = require("util");

module.exports = (customer = {}, output = "json/customers.json") => {
  const writeFileAsync = promisify(fs.writeFile);
  console.log("Writing....");

  writeFileAsync(output, JSON.stringify(customer), { encoding: "utf8" })
    .then(text => {
      console.log("CUSTOMERS: Saved", text);
    })
    .catch(err => {
      console.log("ERROR:", err);
      throw err;
    });
};
