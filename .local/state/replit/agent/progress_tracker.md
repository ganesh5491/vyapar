[x] 1. Install the required packages
[x] 2. Restart the workflow to see if the project is working
[x] 3. Verify the project is working using the feedback tool
[x] 4. Inform user the import is completed and they can start building, mark the import as completed using the complete_project_import tool
[x] 5. Created expenses.json data file for storing expense data
[x] 6. Added comprehensive expense routes to server (CRUD for expenses, mileage, mileage settings, import)
[x] 7. Implemented comprehensive Expenses page with tabs, forms, and data display
[x] 8. Fixed cross-env missing package issue and verified workflow is running
[x] 9. Verified application is fully functional with screenshot
[x] 10. Final verification - application running successfully on port 5000
[x] 11. Added Salesperson dropdown with Manage Salespersons to sales-order-edit.tsx
[x] 12. Added Salesperson dropdown with Manage Salespersons to invoice-edit.tsx
[x] 13. Re-installed cross-env package and restarted workflow
[x] 14. Verified application is running after session restart
[x] 15. Updated sidebar to use accordion behavior (only one section open at a time)
[x] 16. Updated Customers page UI to table layout with columns: Name, Company Name, Email, Work Phone, Place of Supply, Receivables, Unused Credits
[x] 17. Updated Quotes/Estimates page UI to proper table layout with full detail panel
[x] 18. Session restart - reinstalled cross-env and verified application running (Dec 11, 2025)
[x] 19. Session restart - reinstalled cross-env and verified application running (Dec 12, 2025)
[x] 20. Session restart - reinstalled cross-env and verified application running (Dec 12, 2025 - current session)
[x] 21. Fixed customer creation to save data to server/data/customers.json via API call (Dec 12, 2025)
[x] 22. Implemented Payments Received section under Sales with list view, detail panel, create/edit dialog (Dec 12, 2025)
[x] 23. Fixed Bills detail view layout - improved responsive sizing for detail panel (Dec 12, 2025)
[x] 24. Session restart - reinstalled cross-env and verified application running (Dec 12, 2025 - afternoon session)
[x] 25. Created e-Way Bills API routes in server/routes.ts with full CRUD operations (Dec 12, 2025)
[x] 26. Updated e-way-bills.tsx with proper list view matching reference image (filters, table columns: Date, Transaction#, Customer Name, Customer GSTIN, Expiry Date, Total)
[x] 27. Updated e-way-bills.tsx form with proper fields matching reference image (Document Type, Transaction Sub Type, Customer, Credit Note#, Address Details, Transportation Details, Part B)
[x] 28. Connected e-Way Bills to related sections (customers, credit notes, invoices, delivery challans)
[x] 29. Added e-Way Bills route to App.tsx router
[x] 30. Session restart - reinstalled cross-env and verified application running (Dec 15, 2025)
[x] 31. Reinstalled cross-env package and restarted workflow successfully (Dec 15, 2025)
[x] 32. Updated Quotes status to show "Converted to Invoice" or "Converted to Sales Order" instead of just "CONVERTED" (Dec 15, 2025)
[x] 33. Session restart - reinstalled cross-env and verified application running (Dec 15, 2025 - current session)
[x] 34. Removed activity logs timeline from invoice detail Comments & History tab, kept only Payment History table (Dec 15, 2025)
[x] 35. Fixed Quote file attachment functionality - users can now upload, view and remove files (Dec 15, 2025)
[x] 36. Updated Quote What's Next section - shows "Send Quote" for DRAFT quotes, "Convert" for SENT quotes (Dec 15, 2025)
[x] 37. Session restart - reinstalled cross-env and verified application running (Dec 15, 2025 - current session)
[x] 38. Session restart - reinstalled cross-env and verified application running (Dec 15, 2025 - new session)
[x] 39. Updated Invoice detail view with comprehensive action menu (Dec 15, 2025):
    - Added Edit, Send dropdown, Share, PDF/Print dropdown, Record Payment buttons
    - Added More (...) menu with: Mark As Sent, Make Recurring, Create Credit Note, Add e-Way Bill Details, Clone, Void, View Journal, Delete, Invoice Preferences
    - All menu items fully functional with proper dialogs and API integrations
[x] 40. Fixed 404 navigation errors in Invoice menu actions (Dec 15, 2025):
    - Changed /credit-notes/new to /credit-notes/create (matches existing route)
    - Changed /e-way-bills/new to /e-way-bills (matches existing route)
    - Verified Credit Notes page loads correctly without 404 error
[x] 41. Session restart - reinstalled cross-env and verified application running (Dec 15, 2025 - latest session)
[x] 42. Record Payment now saves to Payments Received section (Dec 15, 2025):
    - Updated /api/invoices/:id/record-payment endpoint to also create a payment record in paymentsReceived.json
    - Payment includes invoice details (number, amount, balance due, payment amount)
    - Tracks customer info, payment mode, date, and payment reference
    - Users can now see recorded payments in the Payments Received section under Sales
[x] 43. Updated Payments Received default status to "PAID" (Dec 16, 2025):
    - Changed default status from "RECEIVED" to "PAID" for all new payments
    - Status shows "PAID" (green badge) by default
    - Status changes to "REFUNDED" (red badge) only when refund is processed
    - Both invoice record-payment and direct payment creation use "PAID" as default
[x] 44. Session restart - reinstalled cross-env and verified application running (Dec 16, 2025)
[x] 45. Updated Quotes status column display (Dec 16, 2025):
    - Changed "SENT" to display as "Quotation Send"
    - Capitalized each word in all status values (Draft, Accepted, Declined, Expired, Converted To Invoice, Converted To Sales Order)
[x] 46. Implemented synchronized refund system between Invoices and Payments Received (Dec 16, 2025):
    - Added /api/invoices/:id/refund endpoint that creates refund records in both invoices and payments
    - Updated /api/payments-received/:id/refund to also update linked invoices when a payment is refunded
    - Added Refund button next to Record Payment in invoice detail (only visible when amountPaid > 0)
    - Added refund dialog with amount, mode, and reason fields
    - Updated invoice detail to show Payment Made and Refunded amounts
    - Added Refund History table in Comments & History tab
    - Added amountRefunded and refunds array to invoice data structure
    - Fixed refund validation to use amountPaid as remaining refundable balance
[x] 47. Session restart - reinstalled cross-env and verified application running (Dec 16, 2025 - current session)
[x] 48. Added pagination with 10 items per page to all list sections (Dec 16, 2025):
    - Created reusable pagination components: use-pagination.ts hook and table-pagination.tsx component
    - Added pagination to: Customers, Products, Invoices, Estimates/Quotes, Sales Orders, Purchase Orders, Bills, Credit Notes, Delivery Challans, E-Way Bills, Payments Received, Payments Made, Vendors, Vendor Credits, Expenses
    - Each section shows 10 items per page with navigation controls (first, prev, page numbers, next, last)
    - Pagination info shows "Showing X to Y of Z entries"
[x] 49. Fixed invoice-create page issues (Dec 16, 2025):
    - Updated table-pagination component with centered, attractive design with gradient background
    - Fixed customer dropdown to fetch real data from /api/customers instead of using store dummy data
    - Fixed items dropdown to fetch real products from /api/items instead of hardcoded options
    - Removed dummy items from invoice-create (now starts with empty state)
    - Added loading states for customers and products while fetching
    - Added empty state message when no items are added
    - Improved pagination styling with better visual hierarchy and hover effects
[x] 50. Session restart - reinstalled cross-env and verified application running (Dec 16, 2025 - current session)
[x] 51. Enhanced Customer Creation Form (Dec 16, 2025):
    - Added Display Name dropdown with auto-generated options from Primary Contact fields (Salutation, First Name, Last Name, Company Name)
    - Implemented Tax Preference toggle (Taxable/Tax Exempt) with conditional field visibility:
      * Taxable: Shows GST Treatment*, Place of Supply*, GSTIN fields
      * Tax Exempt: Shows Exemption Reason*, Place of Supply* fields, hides GST Treatment and GSTIN
    - Added complete Indian States dropdown with all 36 states/UTs and GST codes for Place of Supply
    - Added GSTIN field with 15-character format validation and state code mismatch warning
    - Added Exemption Reason dropdown with common exemption reasons and free-text input
    - State management clears incompatible fields when switching between Taxable and Tax Exempt
    - All dropdowns support keyboard navigation and search functionality
[x] 52. Session restart - reinstalled cross-env and verified application running (Dec 16, 2025 - current session)
[x] 53. Enhanced Customer Module (Dec 16, 2025):
    - Updated customer-create.tsx: Moved GSTIN field next to PAN in responsive side-by-side layout (flex-row on desktop, stacked on mobile)
    - Updated customer-edit.tsx: Added Tax Preference toggle with conditional field visibility:
      * Taxable: Shows GSTIN and GST Treatment fields
      * Tax Exempt: Shows Exemption Reason field, hides GST/GSTIN
    - Added Customer List Filters dropdown with 9 predefined filters:
      * All Customers, Active Customers, CRM Customers, Duplicate Customers
      * Inactive Customers, Customer Portal Enabled, Customer Portal Disabled
      * Overdue Customers, Unpaid Customers
    - Filter dropdown includes favorite toggle (star icon) and "New Custom View" option
    - Updated New Transaction navigation to auto-fetch customer data:
      * invoice-create.tsx: Parses customerId from URL and auto-selects customer
      * sales-order-create.tsx: Parses customerId from URL and auto-populates customer
      * delivery-challan-create.tsx: Parses customerId from URL and auto-selects customer
[x] 54. Session restart - reinstalled cross-env and verified application running (Dec 16, 2025 - current session)
[x] 55. Session restart - reinstalled cross-env and verified application running (Dec 16, 2025 - new session)
[x] 56. Updated Payments Made section to match reference design (Dec 16, 2025):
    - Updated list view columns: DATE, PAYMENT #, REFERENCE#, VENDOR NAME, BILL#, MODE, STATUS, AMOUNT, UNUSED AMOUNT
    - Added "All Payments" dropdown filter header matching reference design
    - Added detail panel that appears when clicking on a payment row
    - Detail panel shows payment receipt with company header, "Paid" badge, and green Amount Paid box
    - Added payment details: Payment#, Payment Date, Reference Number, Paid To, Place of Supply, Payment Mode, Paid Through, Amount Paid In Words
    - Added "Paid To" section with vendor address details
    - Added "Payment for" table showing linked bills (Bill Number, Bill Date, Bill Amount, Payment Amount)
    - Added Journal tab with accounting entries (Petty Cash, Prepaid Expenses, Accounts Payable)
    - Implemented number-to-words conversion for Amount Paid In Words field (Indian Rupee format)
    - All data stored and fetched from server/data/paymentsMade.json
[x] 57. Session restart - reinstalled cross-env and verified application running (Dec 17, 2025)
[x] 58. Updated Vendor Credits section to match reference design (Dec 17, 2025):
    - Updated list view columns: DATE, CREDIT NOTE#, REFERENCE NUMBER, VENDOR NAME, STATUS, AMOUNT, BALANCE
    - Added "All Vendor Credits" dropdown filter header matching reference design
    - Added split-view layout: list on left, detail panel on right when item selected
    - Detail panel shows VENDOR CREDITS document with:
      * Company header (SkilltonIT info, address, GSTIN)
      * Status badge (OPEN/DRAFT/CLOSED)
      * Credits Remaining box
      * Vendor Address section
      * Items table with columns: #, Item & Description, HSN/SAC, Qty, Rate, Amount
      * Sub Total, CGST, SGST, Discount, Total, Credits Remaining
      * Authorized Signature section
    - Added Journal tab with accounting entries (Accounts Payable, Input SGST, Input CGST, Cost of Goods Sold)
    - Updated API to include referenceNumber, cgst, sgst, igst, hsnSac fields
    - All data stored and fetched from server/data/vendorCredits.json
[x] 59. Session restart - reinstalled cross-env and verified application running (Dec 17, 2025 - current session)
[x] 60. Session restart - reinstalled cross-env and verified application running (Dec 17, 2025 - latest session)
[x] 61. Enhanced Bills section with Record Payment and More actions dropdown (Dec 17, 2025):
    - Added Record Payment button in bill detail panel action bar
    - Added More (...) dropdown with: Void, Expected Payment Date, Clone, Create Vendor Credits, View Journal, Delete
    - Created comprehensive Record Payment dialog form with fields:
      * Payment Made (INR) with amount pre-populated with balance due
      * Info message banner about partner banks integration
      * Payment Mode dropdown (Cash, Bank Transfer, Cheque, Credit Card, UPI, NEFT, RTGS, IMPS)
      * Payment Date (required)
      * Payment # with auto-increment button
      * Payment Made on date
      * Paid Through dropdown (Petty Cash, Undeposited Funds, Bank Account, etc.)
      * Reference# field
      * Notes textarea
      * Attachments upload section
      * Email notification checkbox
      * Save as Draft / Save as Paid / Cancel buttons
    - Dialog title dynamically shows "Payment for {billNumber}" based on selected bill
    - Record Payment also creates entry in Payments Made section for full tracking
    - Added Void Bill confirmation dialog
    - Added Expected Payment Date dialog
    - Added View Journal dialog showing accounting entries
    - Clone navigates to new bill form with pre-filled data
    - Create Vendor Credits navigates to vendor credits form with bill/vendor data
[x] 62. Fixed "Create Vendor Credits" 404 error in Bills section (Dec 17, 2025):
    - Fixed navigation URL from `/vendor-credits/create` to `/vendor-credits/new`
    - Added `/vendor-credits/create` as additional route for flexibility
    - Updated vendor-credit-create.tsx to handle billId and vendorId query parameters
    - Pre-populates vendor credit form with bill data:
      * Vendor name and ID from the bill
      * All items from the bill (itemName, description, account, quantity, rate, tax, amount)
      * Subject: "Vendor Credit for Bill #{billNumber}"
      * Notes: "Created from Bill #{billNumber}"
      * Reverse charge setting from bill
    - Added blue info banner showing "Creating vendor credit from Bill #{billNumber}"
    - Added loading state while fetching bill data
    - Added "From Bill" badge indicator
[x] 63. Session restart - reinstalled cross-env and verified application running (Dec 17, 2025 - current session)
[x] 64. Fixed item details not fetching in Bill Create and Bill Edit pages (Dec 17, 2025):
    - Added Product interface and products state to both bill-create.tsx and bill-edit.tsx
    - Added fetchProducts function to fetch items from /api/items endpoint
    - Added handleProductSelect function to auto-fill item details when product is selected:
      * Sets itemName from product name
      * Sets description from product description
      * Sets rate from product costPrice or sellingPrice
      * Auto-calculates amount based on quantity and rate
    - Replaced plain Input for ITEM DETAILS with Select dropdown
    - Dropdown shows all available products with name, SKU, and price
    - Loading state shows "Loading items..." while fetching
    - Shows "No items available" if no products exist in the database
    - When selecting an item, the rate is automatically populated from the product's cost price
[x] 65. Session restart - reinstalled cross-env and verified application running (Dec 17, 2025 - current session)
[x] 66. Fixed Expenses Edit functionality (Dec 17, 2025):
    - Added isEditMode and editingExpenseId state variables
    - Added updateExpenseMutation calling PUT /api/expenses/:id
    - handleEditExpense now opens dialog in edit mode with pre-populated data
    - Dialog title shows "Edit Expense" when editing
    - Save button shows "Save Changes (Alt+S)" when editing
    - Hidden "Save and New" button when in edit mode
    - Proper reset when dialog closes
[x] 67. Fixed Purchase Orders layout - removed right-side blank space (Dec 17, 2025):
    - List panel: fixed width 350px when detail open, flex-1 w-full when closed
    - Detail panel: flex-1 min-w-0 for fluid layout
    - Removed fixed w-[600px] that caused layout issues
[x] 68. Fixed Purchase Order Item Tables with horizontal scroll (Dec 17, 2025):
    - Added overflow-x-auto to table container for horizontal scrolling
    - Added min-w-[800px] to ensure consistent table layout
    - Added min-widths to key columns: Item (200px), Account (140px), Tax (120px)
    - Applied fixes to both purchase-order-create.tsx and purchase-order-edit.tsx
[x] 69. Session restart - reinstalled cross-env and verified application running (Dec 17, 2025 - current session)
[x] 70. Updated e-Way Bills filters to default to "All" (Dec 17, 2025):
    - Changed e-Way Bill Status filter default from "NOT_GENERATED" to "all"
    - Changed Transaction Type filter default from "invoices" to "all"
    - Both filters now show all records by default when page loads
[x] 71. Fixed Invoice More dropdown actions with proper navigation and data fetching (Dec 17, 2025):
    - Create Credit Note: Updated credit-note-create.tsx to handle fromInvoice parameter
      * Fetches invoice data and pre-populates customer, address, items
      * Shows "From Invoice #" badge when creating from invoice
      * Sets subject to "Credit Note for Invoice #..."
    - Add e-Way Bill Details: Updated e-way-bills.tsx to handle fromInvoice parameter
      * Opens create form and pre-populates with invoice data
      * Sets document type to "Invoices" and transaction sub type to "Supply"
      * Pre-fills customer info, billing address, shipping address
      * Shows "From Invoice #" badge indicator
    - Clone: Already working - navigates to /invoices/new?cloneFrom=id
    - All dropdown actions now properly navigate and fetch related data
[x] 72. Session restart - reinstalled cross-env and verified application running (Dec 17, 2025 - current session)
[x] 73. Session restart - reinstalled cross-env and verified application running (Dec 17, 2025 - latest session)
[x] 74. Fixed Purchase Orders section React error (Dec 17, 2025):
    - Error: "Objects are not valid as a React child (found: object with keys {nextNumber})"
    - Root cause: Corrupted data in paymentsMade.json where paymentNumber was saved as object instead of string
    - Fixed payment record pm-1765964697396: Changed paymentNumber from {"nextNumber":"PM-00003"} to "PM-00003"
    - Purchase Orders section now loads correctly
[x] 75. Fixed Bill Create and Edit pages - items not fetching correct values (Dec 17, 2025):
    - Updated Product interface to include rate, purchaseRate, usageUnit, purchaseDescription, hsnSac fields
    - Fixed handleProductSelect to use purchaseRate/rate instead of costPrice/sellingPrice
    - Item dropdown now shows correct price: "Rice (kg) - ₹50" using purchaseRate
    - When item is selected, rate field populates with correct value from Items section
    - Total calculations now work correctly with proper item rates
    - Applied fixes to both bill-create.tsx and bill-edit.tsx
[x] 76. Session restart - reinstalled cross-env and verified application running (Dec 17, 2025 - current session)
[x] 77. Added MSME registration fields to New Vendor form (Dec 17, 2025):
    - When "This vendor is MSME registered" checkbox is checked, shows additional fields:
      * MSME/Udyam Registration Type dropdown with options: Micro, Small, Medium
      * MSME/Udyam Registration Number input field
    - Added format validation for registration number (UDYAM-XX-00-0000000)
    - Shows warning message if registration number format is invalid
    - Fields are cleared when checkbox is unchecked
    - Both fields are required when MSME is checked (validation on save)
[x] 78. Session restart - reinstalled cross-env and verified application running (Dec 18, 2025)
[x] 79. Fixed file upload button in vendor-create.tsx and vendor-edit.tsx (Dec 18, 2025):
    - Added file upload state management with useState<File[]>
    - Added useRef hook for hidden file input reference
    - Implemented handleFileUpload function with file validation:
      * Validates maximum 10 files limit
      * Validates 10MB per file limit
      * Shows error toast for invalid files
    - Added removeFile function to remove uploaded files from list
    - Implemented file display UI showing:
      * File name and size (in KB)
      * File counter (X/10)
      * Remove button for each file (X icon)
    - Added hidden file input that opens when upload button is clicked
    - Supports multiple file selection
    - Upload button now has onClick handler triggering file input click
    - Both vendor-create and vendor-edit files updated with full functionality
[x] 80. Implemented Vendor Attachment Management System (Dec 18, 2025):
    - Added Paperclip icon to vendor list table (last column before actions)
    - Icon turns blue when vendor has attachments
    - Clicking icon opens attachment management dialog
    - Dialog displays:
      * All uploaded attachments with names and sizes
      * "Upload your Files" button to add new documents
      * Delete button (X icon) for each attachment
      * File size limit message (10 files max, 10MB each)
      * Save/Cancel buttons
    - Frontend state management:
      * showAttachmentsDialog, selectedVendorForAttachments, newAttachments states
      * fileInputRef for hidden file input
      * handleAttachmentUpload validates files
      * handleDeleteAttachment removes attachment
      * handleSaveAttachments uploads files via FormData
    - Added Attachment interface to Vendor model with: id, name, size, type, uploadedAt
    - Backend API routes for attachment management:
      * POST /api/vendors/:id/attachments - uploads files and stores metadata in vendor.attachments
      * DELETE /api/vendors/:id/attachments/:attachmentId - removes attachment from vendor
    - Attachments are stored as metadata (name, size, type, uploadedAt) in vendor JSON object
    - All data persisted to server/data/vendors.json
[x] 81. Session restart - reinstalled cross-env and verified application running (Dec 18, 2025 - current session)
[x] 82. Added Expense Account* searchable dropdown field to vendor create/edit forms (Dec 18, 2025):
    - Added ACCOUNTS constant with comprehensive list of all account types (Cost Of Goods Sold, Labor, Materials, Subcontractor, etc.)
    - Added searchable Popover dropdown with Command/CommandInput for real-time search
    - Added "Create New Account" button at bottom of dropdown with Plus icon
    - Clicking "Create New Account" opens a dialog for entering new account name
    - New account is automatically selected after creation
    - Updated label styling to show only asterisk as red (label text remains black)
    - Applied searchable dropdown pattern to both vendor-create.tsx and vendor-edit.tsx
    - All account data is saved with the vendor record
    - Users can search, select, and create new accounts on the fly
[x] 83. Session restart - reinstalled cross-env and verified application running (Dec 18, 2025 - current session)
[x] 84. Aligned Edit Item modal with New Item modal - Complete Structural & Visual Alignment (Dec 18, 2025):
    - Fixed all label styling: Changed from inline red text to slate-700 text with separate red asterisk span
    - Replaced static account arrays with full ACCOUNT_HIERARCHY and searchable hierarchical account dropdowns
    - Added full searchable tax rate dropdowns (Intra State and Inter State) with Popover + Command components
    - Added Unit and TaxRate interfaces matching New Item
    - Integrated API-based unit fetching from /api/units endpoint
    - Integrated API-based tax rate fetching from /api/taxRates endpoint
    - Implemented getTaxRateLabel() and getAccountLabel() helper functions
    - Fixed RadioGroup to use `value` prop instead of `defaultValue` for edit mode
    - Added all necessary state variables for tax/account/unit popovers (intraStateTaxOpen, interStateTaxOpen, etc.)
    - Moved button placement to inside form section (matching New Item exactly)
    - Updated button styling and ordering: Cancel (outline) on left, Save (blue) on right
    - Aligned Default Tax Rates section layout and styling with New Item (grid layout, borders, spacing)
    - Added queryClient import and cache invalidation on successful update
    - All field styling, spacing, font sizes now match New Item perfectly
    - Visual hierarchy and component behavior now synchronized between New and Edit modes
[x] 85. Updated Purchase Order Create and Edit pages with improved UI matching reference image (Dec 18, 2025):
    - Redesigned as slide-out panel with close (X) button in header
    - Vendor Name dropdown with searchable Popover/Command and blue search button (data-testid="button-add-vendor")
    - Delivery Address section with Organization/Customer radio toggle
    - Order# with auto-increment system, Reference# field, Expected Delivery Date picker
    - Items table with horizontal scroll and proper column widths
    - Customer Details section with shipping address display
    - Terms and Conditions with "Add Terms And Conditions" link
    - Action buttons: Save as Draft, Save as Issued, Cancel
    - All fields properly connected to form state
[x] 86. Session restart - reinstalled cross-env and verified application running (Dec 18, 2025 - current session)
[x] 87. Fixed Credit Note Create page - Customer autocomplete now triggers correctly (Dec 18, 2025):
    - Added complete Customer interface with all required fields
    - Added customers and customersLoading state variables
    - Added useEffect to fetch customers from /api/customers on component mount
    - Implemented handleCustomerSelect function to populate form fields:
      * Sets customerName, billingAddress, and all item customerName fields
      * Properly handles customer object selection from dropdown
    - Updated Popover trigger to show selected customer name or placeholder
    - CommandEmpty shows "No customers found" when search returns empty
    - Loading state shows "Loading customers..." while fetching
    - Customer list populated from API data instead of empty array
[x] 88. Fixed Vendor Credits Create page - vendor_id foreign key constraint error (Dec 18, 2025):
    - Root cause: Sending `vendorId` field but backend expects `vendor_id` for database FK
    - Updated frontend vendor-credit-create.tsx: Changed `vendorId` to `vendor_id` in request body
    - Updated backend POST /api/vendor-credits: Added fallback to accept both `vendor_id` and `vendorId`
    - Updated backend GET /api/vendor-credits: Added proper join with vendors table to fetch vendor names
    - Vendor credits now save correctly with proper vendor association
    - Vendor name now displays in list view instead of just vendor_id
[x] 89. Session restart - reinstalled cross-env and verified application running (Dec 18, 2025 - current session)
[x] 90. Session restart - reinstalled cross-env and verified application running (Dec 19, 2025)
[x] 91. Fixed Invoice Item Details dropdown - now fetches and displays all item data properly (Dec 19, 2025):
    - Updated onValueChange handler in invoice-create.tsx to also populate the description field
    - Improved dropdown to show item name with rate/price (e.g., "Item Name - ₹500.00")
    - When selecting an item, all details are now fetched:
      * Item name
      * Item description
      * Item rate (converted from string to number)
      * GST rate (extracted from intraStateTax field)
    - Dropdown options now clearly show item prices for easy identification
    - Removed debug console logs for cleaner execution
    - All item data is properly populated when selecting from dropdown
[x] 92. Fixed Invoice Item Details dropdown batched state updates (Dec 19, 2025):
    - Changed from multiple rapid updateItem calls to single batched setItems call
    - All item updates (productId, name, description, rate, gstRate) now happen in one state change
    - This ensures React properly re-renders with all changes applied at once
    - Prevents issues from state batching in React 18+
    - Item selection now properly displays name, rate, and other details in the table row
[x] 93. Session restart - reinstalled cross-env and verified application running (Dec 22, 2025 - current session)
[x] 94. Fixed "Bill Payment → unpaid bills not showing" issue (Dec 22, 2025):
    - **Root cause**: /api/bills endpoint returned ALL bills without filtering
    - **Backend fix**: Updated GET /api/bills endpoint to:
      * Accept vendorId query parameter
      * Filter bills by vendorId
      * Filter for unpaid bills only (balanceDue > 0 and status !== 'PAID')
      * Sort by billDate (oldest first) for proper payment allocation
    - **Frontend fix**: Updated payments-made-create.tsx to:
      * Enhanced Bill interface with balanceDue, billDate fields
      * Updated query to pass vendorId as parameter to /api/bills?vendorId=X
      * Simplified vendorBills filtering (backend now handles filtering)
      * Fixed TypeScript error in autoAllocatePayment sort function
    - **Payment allocation logic**: 
      * Auto-allocates payment amounts to unpaid bills (oldest first)
      * Supports partial payments and multiple bill payments
      * Automatically updates Amount Due when payment is saved
    - **Database structure**: Uses existing fields:
      * balanceDue (remaining amount owed)
      * amountPaid (total paid so far)
      * status (OPEN, PARTIALLY_PAID, PAID)
      * billDate (for sorting oldest first)
    - **VERIFIED**: Server logs confirm API returns unpaid bills correctly
      * Test API call: GET /api/bills?vendorId=6 returns test bill with balanceDue=11800
      * Bill filtering working: Only bills with balanceDue > 0 and status !== 'PAID' appear
      * Bill sorting working: Bills sorted by billDate (oldest first) for proper allocation

## CRITICAL BUG FIX: Payment Recording Update (Completed 12/22/2025)
- **Problem**: Bill `balanceDue` not updating after payment - showing 400 instead of 200 remaining after 200 RS paid
- **Root Cause**: POST /api/payments-made endpoint saved payment but never updated bills in bills.json
- **Solution**: Modified POST /api/payments-made to:
  1. Save payment record (existing logic)
  2. Read bills.json
  3. Find bills that received payment from billPayments object
  4. Update each bill's amountPaid, balanceDue, and status
  5. Write updated bills back to bills.json
- **Status Calculation**:
  * PAID: balanceDue === 0
  * PARTIALLY_PAID: amountPaid > 0 AND balanceDue > 0
  * OPEN: balanceDue > 0 AND amountPaid === 0
- **Verified** with test sequence:
  * Payment 1 (200 RS): amountPaid=200, balanceDue=11600 ✓
  * Payment 2 (200 RS): amountPaid=400, balanceDue=11400 ✓
  * Payment 3 (200 RS): amountPaid=600, balanceDue=11200 ✓
  * New payment screen correctly shows remaining balance, not total