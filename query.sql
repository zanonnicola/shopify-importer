SELECT 'order'.order_id, 'date_added', 'order_total'.value AS tax_total, 'order'.customer_group_id, firstname, lastname, email, telephone, 'order'.date_added, 'order'.total AS order_total, currency_code, 'order'.customer_id, 'order_status'.name AS status, 'order_product'.product_id AS product_item, 'order_product'.name AS product_name, 'order_product'.model AS product_model, 'order_product'.quantity AS product_quantity, 'order_option'.order_product_id AS option_product, 'order_option'.product_option_id AS option_id, 'order_option'.name AS option_name, 'order_option'.value AS option_value, 'order_product'.total AS product_total, 'order_total'.value AS tax_total, 'order_product'.tax, 'order'.payment_code, 'order'.payment_firstname, 'order'.payment_lastname, 'order'.payment_company, 'order'.payment_address_1, 'order'.payment_address_2, 'order'.payment_city, 'order'.payment_zone, 'order'.payment_postcode, 'order'.payment_country, 'order'.shipping_method, 'order'.shipping_code, 'order'.shipping_firstname, 'order'.shipping_lastname, 'order'.shipping_company, 'order'.shipping_address_1, 'order'.shipping_address_2, 'order'.shipping_city, 'order'.shipping_zone, 'order'.shipping_postcode, 'order'.shipping_country, 'order'.comment
FROM 'order' LEFT JOIN     'order_total'
ON 'order'.'order_id' = 'order_total'.'order_id'
LEFT JOIN 'order_product' ON 'order'.'order_id' = 'order_product'.'order_id'
LEFT JOIN 'order_status' ON 'order'.'order_status_id' = 'order_status'.'order_status_id'
LEFT JOIN 'order_option' ON 'order_product'.'order_product_id' = 'order_option'.'order_product_id'
WHERE  'order_status'.'order_status_id' > 0
ORDER BY
'order'.'order_id' DESC,
'order'.'date_added' LIMIT 8