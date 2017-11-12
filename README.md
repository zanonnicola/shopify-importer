# Backend ULRS

admin/controller/sale/customer.php
catalog/controller/account/address.php

# Customers import Flow

Read CSV => `{...customers}` => POST data to Shopify => `{... {oldCustomer.id, newCustomer.id} }` => write to file