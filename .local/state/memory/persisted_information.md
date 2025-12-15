# Persisted State - December 15, 2025

## Task COMPLETED
Updated Invoice detail view with dropdown menu containing all these actions - ALL WORKING:
- Mark As Sent - PATCH to /api/invoices/{id}/status
- Make Recurring - Opens recurring dialog
- Create Credit Note - Navigates to /credit-notes/create (fixed from /credit-notes/new)
- Add e-Way Bill Details - Navigates to /e-way-bills (fixed from /e-way-bills/new)
- Clone - Navigates to /invoices/new?cloneFrom={id}
- Void - PATCH to /api/invoices/{id}/status with status: 'VOID'
- View Journal - Opens journal dialog showing accounting entries
- Delete - DELETE to /api/invoices/{id}
- Invoice Preferences - Opens preferences dialog

## Files Modified
- `client/src/pages/invoices.tsx` - Added all menu items, handlers, dialogs

## Verified Working
- Credit Notes page loads without 404
- All navigation paths corrected
- All dialogs implemented

## Session Info
- cross-env package installed
- Workflow "Start application" running on port 5000
