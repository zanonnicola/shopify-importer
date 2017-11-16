const Entities = require("html-entities").AllHtmlEntities;

function URLreplace(url) {
  return url.replace(
    "/Applications/MAMP/htdocs/ft-store/",
    "https://shop.finishingtouchesgroup.com/"
  );
}

module.exports = (product, category) => {
  const entities = new Entities();
  const data = {
    product: {
      title: product.name,
      body_html: entities.decode(product.description),
      vendor: product.brand,
      product_type: category,
      metafields_global_title_tag: product.meta_title,
      metafields_global_description_tag: product.meta_description,
      variants: [
        {
          price: product.price,
          sku: product.sku,
          inventory_quantity: product.quantity,
          inventory_management: "shopify",
          weight: product.weight,
          length: product.length,
          width: product.width,
          height: product.height,
          weight_unit: "lb",
          requires_shipping: true
        }
      ],
      images: [
        {
          src: URLreplace(product.image)
        }
      ]
    }
  };
  return data;
};
