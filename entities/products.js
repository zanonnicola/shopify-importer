module.exports = product => {
  const data = {
    product: {
      title: product.name,
      body_html: product.description,
      vendor: product.brand,
      product_type: "machine",
      tags: "",
      metafields_global_title_tag: product.meta_title,
      metafields_global_description_tag: product.meta_description,
      variants: [
        {
          price: product.price,
          sku: product.sku,
          inventory_quantity: product.quantity,
          inventory_management: "shopify",
          weight: 0.0,
          weight_unit: "lb",
          requires_shipping: true
        }
      ],
      images: [
        {
          src:
            "https://shop.finishingtouchesgroup.com/image/data/2017%20new/li-pigment%20banner.jpg"
        }
      ]
    }
  };
  return data;
};
