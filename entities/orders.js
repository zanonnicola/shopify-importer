module.exports = order => {
  const data = {
    order: {
      fulfillment_status: "fulfilled",
      email: "bob.norman@hostmail.com",
      line_items: [
        {
          title: "Clicky Keyboard",
          price: 99.99,
          grams: "600",
          quantity: 1
        }
      ],
      customer: {
        id: 207119551
      },
      transactions: [
        {
          kind: "sale",
          status: "success",
          amount: 238.47
        }
      ],
      financial_status: "paid"
    }
  };
  return data;
};
