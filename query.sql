/*
create index ORDER_2_PRODUCT_IDX on order_product(`order_id`);
create index ORDER_2_TOTAL_IDX on order_total(`order_id`);
create index ORDER_STATUS_IDX on order(`order_status_id`);
create index ORDER_2_STATUS_IDX on order_status(`order_status_id`);
create index ORDER_OPTION_IDX on order(`order_product_id`);
create index ORDER_2_OPTION_IDX on order_option(`order_product_id`);
*/

select count(`o`.`order_status_id`) from `order` o where o.`order_status_id` = 0; 



SELECT 
	o.`order_id`,
	o.`date_added`,
	o.`customer_group_id`, 
	o.`firstname`,
	o.`lastname`, 
	o.`email`, 
	o.`telephone`,
	o.`total` AS order_total,
	o.`currency_code`,
	o.`customer_id` 
FROM 
	`order` o 
WHERE 
	o.`order_status_id` > 0
ORDER BY 
	o.`date_added` 
DESC LIMIT 100;


SELECT 
	o2.*,
	`order_total`.`value` AS tax_total,
	`order_status`.`name` AS status,
	`order_product`.`product_id` AS product_item,
	`order_option`.`order_product_id` AS option_product, 
	`order_option`.`product_option_id` AS option_id 
FROM (
SELECT 
	o.`order_id`,
	o.`date_added`,
	o.`customer_group_id`, 
	o.`firstname`,
	o.`lastname`, 
	o.`email`, 
	o.`telephone`,
	o.`total` AS order_total,
	o.`currency_code`,
	o.`customer_id`,
	o.`order_status_id`
FROM 
	`order` o 
WHERE 
	o.`order_status_id` > 0
ORDER BY 
	o.`date_added` DESC
) o2
LEFT JOIN `order_product` ON o2.`order_id` = `order_product`.`order_id`
LEFT JOIN `order_total` ON o2.`order_id` = `order_total`.`order_id`
LEFT JOIN `order_status` ON o2.`order_status_id` = `order_status`.`order_status_id`
LEFT JOIN `order_option` ON `order_product`.`order_product_id` = `order_option`.`order_product_id`
WHERE
	`order_option`.`order_product_id` IS NOT NULL
		
