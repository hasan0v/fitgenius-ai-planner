-- Migration to replace Kapitalbank fields with Epoint fields

-- Drop old Kapitalbank columns and add Epoint column
ALTER TABLE orders DROP COLUMN kapital_order_id;
ALTER TABLE orders DROP COLUMN kapital_session_id;
ALTER TABLE orders ADD COLUMN epoint_transaction_id TEXT;

-- Create index for Epoint transaction ID
CREATE INDEX IF NOT EXISTS idx_orders_epoint_transaction ON orders(epoint_transaction_id);
