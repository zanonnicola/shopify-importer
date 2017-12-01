/* First Query */
SELECT o2.*, 
	`order_product`.`product_id` AS product_item,
    `order_product`.`name` AS product_name,
     `order_product`.`price` AS product_price,
	`order_product`.`quantity` AS product_quantity,
	`order_option`.`order_product_id` AS option_product,
	`order_status`.`name` AS status
FROM
(
SELECT o.`order_id`, o.`date_added`,
	o.`firstname`,
	o.`lastname`, 
	o.`email`, 
	o.`telephone`,
	o.`currency_code`,
	o.`customer_id`,
	o.`order_status_id`,
	o.`payment_method`,
	o.`payment_code`,
	o.`payment_firstname`,
	o.`payment_lastname`,
	o.`payment_company`,
	o.`payment_address_1`,
	o.`payment_address_2`,
	o.`payment_city`,
	o.`payment_zone`,
	o.`payment_postcode`,
	o.`payment_country`,
	o.`shipping_method`,
	o.`shipping_code`,
	o.`shipping_firstname`,
	o.`shipping_lastname`,
	o.`shipping_company`,
	o.`shipping_address_1`,
	o.`shipping_address_2`,
	o.`shipping_city`,
	o.`shipping_zone`,
	o.`shipping_postcode`,
	o.`shipping_country`,
	o.`comment`
FROM 
	`order` o 
WHERE 
	o.`order_status_id` > 0 AND
	o.`order_id` < 14678
	
ORDER BY 
	o.`date_added` DESC
	LIMIT 150
) o2
LEFT JOIN `order_product` ON o2.`order_id` = `order_product`.`order_id`
LEFT JOIN `order_status` ON o2.`order_status_id` = `order_status`.`order_status_id`
LEFT JOIN `order_option` ON `order_product`.`order_product_id` = `order_option`.`order_product_id`;

/* Second Query */
SELECT o2.*, 
	`order_total`.`code` AS code_title,
	`order_total`.`value` AS code_value
FROM
(SELECT o.`order_id`
FROM 
	`order` o 
WHERE 
	o.`order_status_id` > 0 AND
	o.`order_id` < 14678
ORDER BY 
	o.`date_added` DESC
	LIMIT 150
) o2
LEFT JOIN `order_total` ON o2.`order_id` = `order_total`.`order_id`