-- V19: make each invoice's total equal the sum of its line items.
--
-- The seed data had total_amount_usd values that disagreed with the invoice's own line items on
-- every one of the 500 invoices, so any screen showing both (an invoice and its itemised
-- charges) contradicted itself. The line items are the detail, so the total is recomputed
-- from them. Invoices with no line items keep their stored total.
UPDATE airline_billing_invoices i
SET total_amount_usd = s.total
FROM (
    SELECT invoice_id, ROUND(SUM(amount_usd), 2) AS total
    FROM invoice_line_items
    GROUP BY invoice_id
) s
WHERE s.invoice_id = i.invoice_id
  AND i.total_amount_usd IS DISTINCT FROM s.total;
