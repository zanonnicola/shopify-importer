module.exports = (product, collectionID) => {
  const data = {
    collect: {
      product_id: product.variants[0].id,
      collection_id: collectionID
    }
  };
  return data;
};
