module.exports = person => {
  const data = {
    customer: {
      email: person.email,
      first_name: person.firstname,
      last_name: person.lastname,
      phone: person.telephone,
      verified_email: true,
      send_email_invite: true,
      addresses: [
        {
          address1: person.address_1,
          address2: person.address2,
          city: person.city,
          province: null,
          company: person.company,
          phone: person.telephone,
          zip: person.postcode,
          last_name: person.firstname,
          first_name: person.lastname,
          country_code: person.iso_code_2,
          country_name: person.country
        }
      ]
    }
  };
  return data;
};
