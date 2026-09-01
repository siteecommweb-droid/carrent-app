Add these routes to your existing App.tsx:

- `/payment-success` → `PaymentSuccess`
- `/my-invoices` → `MyInvoices`
- `/admin/invoices` → `AdminInvoices`

Mount `AM38StripeCheckoutBlock` inside your existing `Checkout.tsx` after your booking summary and before final submit fallback logic, using the real booking id, computed payable amount, selected currency, and customer billing data already present in your BookingContext.