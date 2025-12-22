# Billing Accounting Application

## Overview
A full-stack accounting application designed for comprehensive financial management, including invoices, customers, products, vendors, and expenses. It aims to provide an enterprise-grade solution for businesses, leveraging a modern tech stack and modular architecture to ensure scalability and maintainability.

## User Preferences
I want iterative development. Ask before making major changes. I prefer detailed explanations. Do not make changes to the folder `Z`. Do not make changes to the file `Y`.

## System Architecture

### UI/UX Decisions
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **UI Components**: Radix UI components with Tailwind CSS for a modern and consistent design.
- **Routing**: Wouter with lazy loading for efficient navigation.
- **State Management**: Zustand for global state and TanStack Query for server state.
- **Forms**: React Hook Form with Zod validation for robust form handling.

### Technical Implementations
- **Backend Server**: Express 4
- **Database**: PostgreSQL (Neon) managed with Drizzle ORM.
- **API Versioning**: All API routes are prefixed with `/api/v1`.
- **Authentication**: JWT-based authentication (prepared for implementation).
- **Validation**: Zod schemas used for both frontend and backend validation.
- **Deployment**: Designed for stateless web application deployment with `npm run build` and `npm start`.

### Feature Specifications
- **Core Modules**: Dashboard, Invoice, Customer, Product & Services, Estimates, Vendor, Expense, Purchase Order, Bill, Payment, Time Tracking, Banking, Filing & Compliance, Accountant Collaboration, Document Management, Reports, and Settings.
- **Frontend Structure**: Enterprise modular structure (`client/src/modules/`) where each feature is a module with its own components, pages, hooks, API, types, and services. Global elements like API client, config, constants, layouts, routes, and shared utilities are managed centrally.
- **Backend Structure**: Clean Architecture / Modular Monolith (`server/src/modules/`) with each module containing its own controller, service, model, routes, validators, and repository. Middleware for authentication, error handling, logging, and validation is centrally managed.

### System Design Choices
- **Development Mode**: Express server with Vite middleware for Hot Module Replacement (HMR).
- **Production Mode**: Express serves pre-built static files from `dist/public`.
- **API Pattern**: All modules expose their functionalities through versioned API endpoints, following a consistent `/{module}/{resource}` pattern.
- **Module Architecture**: Frontend modules export pages, types, API functions, services, and hooks. Backend modules adhere to Clean Architecture principles with distinct layers for controllers, services, repositories, models, and validators.

## Recent Changes (December 2025)

### Vendor Credit and Purchase Order Improvements
- **Vendor Credit Edit Page**: Added `/vendor-credits/:id/edit` route with full edit functionality
  - Fetches existing vendor credit data and pre-populates form
  - PUT request to `/api/vendor-credits/:id` for saving changes
  - Proper tax amount recalculation when quantity/rate changes

- **Vendor Credit Tax Calculation**:
  - Added `taxAmount` field to LineItem interface
  - `calculateItemTaxAmount` uses stored taxAmount first, falls back to calculation
  - `updateItem` recalculates taxAmount when quantity, rate, or tax code changes
  - Tax amounts properly included in total calculations and payloads

- **Bill Creation from Purchase Orders**:
  - Navigate to `/bills/new?purchaseOrderId=X` to create bill from PO
  - Pre-populates vendor, items, and totals from purchase order data
  - Refreshes PO list after conversion to reflect updated status

- **Vendor Credit Creation from Bills**:
  - Navigate to `/vendor-credits/new?billId=X` to create credit from bill
  - Pre-populates vendor, items with taxAmount calculations
  - Shows info banner indicating creation from bill

### Sales Entry Point Flow Implementation
- **Transaction Bootstrap Hooks**: Centralized customer auto-population for all transaction create pages
  - `useTransactionBootstrap`: Main hook for transaction pages - reads customerId from URL, manages customer snapshot
  - `useCustomerSnapshot`: Fetches and caches customer data as immutable snapshot
  - `customer-snapshot.ts`: Utility functions for tax regime determination and address formatting

- **Tax Calculation Logic**:
  - Automatic CGST+SGST calculation for intra-state transactions (same state as company)
  - Automatic IGST calculation for inter-state transactions (different state)
  - Tax-exempt handling for customers with tax_exempt preference

- **Customer Snapshot Architecture**:
  - Immutable customer data preserved at transaction creation time
  - Prevents retroactive changes when customer details are updated later
  - Includes: billing address, shipping address, GSTIN, tax preference, payment terms, place of supply

### Updated Create Pages
All transaction create pages now integrate with transaction bootstrap hooks:
- Invoice Create (`/invoices/create`)
- Quote Create (`/quotes/create`)
- Sales Order Create (`/sales-orders/create`)
- Delivery Challan Create (`/delivery-challans/create`)
- Credit Note Create (`/credit-notes/create`)
- Payments Received Create (`/payments-received/create`)

## External Dependencies
- **Database**: PostgreSQL (via Neon)
- **ORM**: Drizzle ORM
- **Frontend Libraries**: React, Vite, Radix UI, Tailwind CSS, Wouter, Zustand, TanStack Query, React Hook Form, Zod.
- **Backend Libraries**: Express, Zod.