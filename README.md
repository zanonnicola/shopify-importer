# Shopify Importer

I'm thinking of creating a command line tool for importing stuff into Shopify. At the moment I've hard-coded a lot of things because I didn't have time to do it properly 😅.

You can fork it and dig into the code as you please.

> It's still in dev.... there might be **BUGS** 😱

## API KEYS

You will need the API Keys from your *Shopify* Store in order to use this tool.

1. Create a `.env` file in your root directory
2. Add the following lines:
```
SHOP_NAME=shop-name
API_KEY=XXXXXXXXXXXXXX
PASSWORD=XXXXXXXXXXXXX
```

## RUN

`node index.js`


## SQL Query

```
SELECT `order`.`order_id`,
`date_added`,
`order_total`.`value` AS tax_total
FROM `order`
LEFT JOIN `order_total` ON `order`.`order_id` = `order_total`.`order_id`
ORDER BY `order_id` DESC,
`date_added` LIMIT 8
```
