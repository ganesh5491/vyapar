import { lazy, Suspense } from 'react';
import { Route, Switch } from 'wouter';
import { Spinner } from '@/components/ui/spinner';

const Dashboard = lazy(() => import('@/modules/dashboard/pages/DashboardPage'));
const Items = lazy(() => import('@/modules/items/pages/ItemsPage'));
const ItemCreate = lazy(() => import('@/modules/items/pages/ItemCreatePage'));
const Invoices = lazy(() => import('@/modules/sales/pages/InvoicesPage'));
const InvoiceCreate = lazy(() => import('@/modules/sales/pages/InvoiceCreatePage'));
const Estimates = lazy(() => import('@/modules/sales/pages/EstimatesPage'));
const Quotes = lazy(() => import('@/modules/sales/pages/QuotesPage'));
const QuoteCreate = lazy(() => import('@/modules/sales/pages/QuoteCreatePage'));
const Customers = lazy(() => import('@/modules/customers/pages/CustomersPage'));
const CustomerCreate = lazy(() => import('@/modules/customers/pages/CustomerCreatePage'));
const Vendors = lazy(() => import('@/modules/vendors/pages/VendorsPage'));
const PurchaseOrders = lazy(() => import('@/modules/purchases/pages/PurchaseOrdersPage'));
const Bills = lazy(() => import('@/modules/purchases/pages/BillsPage'));
const PaymentsMade = lazy(() => import('@/modules/purchases/pages/PaymentsMadePage'));
const VendorCredits = lazy(() => import('@/modules/purchases/pages/VendorCreditsPage'));
const Expenses = lazy(() => import('@/modules/expenses/pages/ExpensesPage'));
const Banking = lazy(() => import('@/modules/banking/pages/BankingPage'));
const Reports = lazy(() => import('@/modules/reports/pages/ReportsPage'));
const Documents = lazy(() => import('@/modules/documents/pages/DocumentsPage'));
const TimeTracking = lazy(() => import('@/modules/accounting/pages/TimeTrackingPage'));
const FilingCompliance = lazy(() => import('@/modules/accounting/pages/FilingCompliancePage'));
const Accountant = lazy(() => import('@/modules/accounting/pages/AccountantPage'));
const Settings = lazy(() => import('@/modules/settings/pages/SettingsPage'));
const Support = lazy(() => import('@/modules/settings/pages/SupportPage'));
const NotFound = lazy(() => import('@/pages/not-found'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spinner className="w-8 h-8" />
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        
        {/* Items Module */}
        <Route path="/items" component={Items} />
        <Route path="/items/create" component={ItemCreate} />
        
        {/* Sales Module */}
        <Route path="/invoices" component={Invoices} />
        <Route path="/invoices/create" component={InvoiceCreate} />
        <Route path="/estimates" component={Quotes} />
        <Route path="/quotes" component={Quotes} />
        <Route path="/quotes/create" component={QuoteCreate} />
        
        {/* Customers Module */}
        <Route path="/customers" component={Customers} />
        <Route path="/customers/create" component={CustomerCreate} />
        
        {/* Vendors Module */}
        <Route path="/vendors" component={Vendors} />
        
        {/* Purchases Module */}
        <Route path="/purchase-orders" component={PurchaseOrders} />
        <Route path="/bills" component={Bills} />
        <Route path="/payments-made" component={PaymentsMade} />
        <Route path="/vendor-credits" component={VendorCredits} />
        
        {/* Expenses Module */}
        <Route path="/expenses" component={Expenses} />
        
        {/* Banking Module */}
        <Route path="/banking" component={Banking} />
        
        {/* Reports Module */}
        <Route path="/reports" component={Reports} />
        
        {/* Documents Module */}
        <Route path="/documents" component={Documents} />
        
        {/* Accounting Module */}
        <Route path="/time-tracking" component={TimeTracking} />
        <Route path="/filing-compliance" component={FilingCompliance} />
        <Route path="/accountant" component={Accountant} />
        
        {/* Settings Module */}
        <Route path="/settings" component={Settings} />
        <Route path="/support" component={Support} />
        
        {/* 404 */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
};

export default AppRoutes;
