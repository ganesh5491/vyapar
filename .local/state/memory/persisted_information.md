# Task Progress - December 15, 2025

## Completed Tasks
1. [x] Tax and percent conversion in create/edit quotes - DONE
2. [x] Clone/duplicate functionality - Fixed route from /quotes/new to /quotes/create
3. [x] Invoice Edit page - Fixed with proper tax preservation:
   - Removed unsupported fields (orderNumber, subject) from API payload and UI
   - Added originalTaxName and taxModified tracking to preserve stored tax metadata
   - calculateLineItem now returns stored values for unmodified items
   - handleSave uses originalTaxName when tax wasn't modified
   - Custom tax names are preserved even if not in preset list
4. [x] Ensure clone/duplicate works properly across all sections

## Pending Tasks
- Task 2: Fix file attachment functionality in quotes
- Task 3: Update status text from 'Converted' to specific conversion type

## Key Files Modified This Session
- client/src/pages/invoice-edit.tsx - Complete fix for tax preservation

## Notes
- The invoice-edit page now properly preserves stored tax amounts and custom taxName strings
- Items are only recalculated when user actually modifies relevant fields (quantity, rate, discount, tax)
- Architect reviewed and approved the invoice-edit fixes
