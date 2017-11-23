SELECT `order`.`order_id`,
`date_added`,
`order`.`customer_group_id`, 
`order`.`firstname`,
`order`.`lastname`, 
`order`.`email`, 
`order`.`telephone`,
`order`.`total` AS order_total,
`order_total`.`value` AS tax_total,
`order`.`currency_code`,
`order`.`customer_id`, 
`order_status`.`name` AS status,
`order_product`.`product_id` AS product_item,
`order_option`.`order_product_id` AS option_product, 
`order_option`.`product_option_id` AS option_id 


FROM `order`
LEFT JOIN `order_product` ON `order`.`order_id` = `order_product`.`order_id`
LEFT JOIN `order_total` ON `order`.`order_id` = `order_total`.`order_id`
LEFT JOIN `order_status` ON `order`.`order_status_id` = `order_status`.`order_status_id`
LEFT JOIN `order_option` ON `order_product`.`order_product_id` = `order_option`.`order_product_id`

WHERE  `order_status`.`order_status_id` > 0
ORDER BY `order_id` DESC,
`date_added` LIMIT 8
