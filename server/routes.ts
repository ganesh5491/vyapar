import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.join(import.meta.dirname, "data");
const ITEMS_FILE = path.join(DATA_DIR, "items.json");
const QUOTES_FILE = path.join(DATA_DIR, "quotes.json");
const CUSTOMERS_FILE = path.join(DATA_DIR, "customers.json");
const SALES_ORDERS_FILE = path.join(DATA_DIR, "salesOrders.json");
const INVOICES_FILE = path.join(DATA_DIR, "invoices.json");
const VENDORS_FILE = path.join(DATA_DIR, "vendors.json");
const DELIVERY_CHALLANS_FILE = path.join(DATA_DIR, "deliveryChallans.json");
const EXPENSES_FILE = path.join(DATA_DIR, "expenses.json");
const DASHBOARD_FILE = path.join(DATA_DIR, "dashboard.json");
const REPORTS_FILE = path.join(DATA_DIR, "reports.json");
const PURCHASE_ORDERS_FILE = path.join(DATA_DIR, "purchaseOrders.json");
const BILLS_FILE = path.join(DATA_DIR, "bills.json");
const SALESPERSONS_FILE = path.join(DATA_DIR, "salespersons.json");
const CREDIT_NOTES_FILE = path.join(DATA_DIR, "creditNotes.json");
const PAYMENTS_RECEIVED_FILE = path.join(DATA_DIR, "paymentsReceived.json");
const EWAY_BILLS_FILE = path.join(DATA_DIR, "ewayBills.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readItems() {
  ensureDataDir();
  if (!fs.existsSync(ITEMS_FILE)) {
    fs.writeFileSync(ITEMS_FILE, JSON.stringify({ items: [] }, null, 2));
    return [];
  }
  const data = JSON.parse(fs.readFileSync(ITEMS_FILE, "utf-8"));
  return data.items || [];
}

function writeItems(items: any[]) {
  ensureDataDir();
  fs.writeFileSync(ITEMS_FILE, JSON.stringify({ items }, null, 2));
}

function readQuotesData() {
  ensureDataDir();
  if (!fs.existsSync(QUOTES_FILE)) {
    const defaultData = { quotes: [], nextQuoteNumber: 1 };
    fs.writeFileSync(QUOTES_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(QUOTES_FILE, "utf-8"));
}

function writeQuotesData(data: any) {
  ensureDataDir();
  fs.writeFileSync(QUOTES_FILE, JSON.stringify(data, null, 2));
}

function readCustomersData() {
  ensureDataDir();
  if (!fs.existsSync(CUSTOMERS_FILE)) {
    const defaultData = { customers: [], nextCustomerId: 1 };
    fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(CUSTOMERS_FILE, "utf-8"));
}

function writeCustomersData(data: any) {
  ensureDataDir();
  fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(data, null, 2));
}

function generateQuoteNumber(num: number): string {
  return `QT-${String(num).padStart(6, '0')}`;
}

function readSalesOrdersData() {
  ensureDataDir();
  if (!fs.existsSync(SALES_ORDERS_FILE)) {
    const defaultData = { salesOrders: [], nextSalesOrderNumber: 1, nextInvoiceNumber: 1 };
    fs.writeFileSync(SALES_ORDERS_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(SALES_ORDERS_FILE, "utf-8"));
}

function writeSalesOrdersData(data: any) {
  ensureDataDir();
  fs.writeFileSync(SALES_ORDERS_FILE, JSON.stringify(data, null, 2));
}

function generateSalesOrderNumber(num: number): string {
  return `SO-${String(num).padStart(5, '0')}`;
}

function generateInvoiceNumber(num: number): string {
  return `INV-${String(num).padStart(5, '0')}`;
}

function readInvoicesData() {
  ensureDataDir();
  if (!fs.existsSync(INVOICES_FILE)) {
    const defaultData = { invoices: [], nextInvoiceNumber: 1 };
    fs.writeFileSync(INVOICES_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(INVOICES_FILE, "utf-8"));
}

function readSalespersonsData() {
  ensureDataDir();
  if (!fs.existsSync(SALESPERSONS_FILE)) {
    const defaultData = { salespersons: [], nextSalespersonId: 1 };
    fs.writeFileSync(SALESPERSONS_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(SALESPERSONS_FILE, "utf-8"));
}

function writeSalespersonsData(data: any) {
  ensureDataDir();
  fs.writeFileSync(SALESPERSONS_FILE, JSON.stringify(data, null, 2));
}

function readPaymentsReceivedData() {
  ensureDataDir();
  if (!fs.existsSync(PAYMENTS_RECEIVED_FILE)) {
    const defaultData = { paymentsReceived: [], nextPaymentNumber: 1 };
    fs.writeFileSync(PAYMENTS_RECEIVED_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(PAYMENTS_RECEIVED_FILE, "utf-8"));
}

function writePaymentsReceivedData(data: any) {
  ensureDataDir();
  fs.writeFileSync(PAYMENTS_RECEIVED_FILE, JSON.stringify(data, null, 2));
}

function generatePaymentNumber(num: number): string {
  return String(num);
}

function readEWayBillsData() {
  ensureDataDir();
  if (!fs.existsSync(EWAY_BILLS_FILE)) {
    const defaultData = { ewayBills: [], nextEWayBillNumber: 1 };
    fs.writeFileSync(EWAY_BILLS_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(EWAY_BILLS_FILE, "utf-8"));
}

function writeEWayBillsData(data: any) {
  ensureDataDir();
  fs.writeFileSync(EWAY_BILLS_FILE, JSON.stringify(data, null, 2));
}

function generateEWayBillNumber(num: number): string {
  return `EWB-${String(num).padStart(6, '0')}`;
}

function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';

  const convertLessThanThousand = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
  };

  const intPart = Math.floor(num);
  const rupees = intPart;
  
  if (rupees >= 10000000) {
    const crores = Math.floor(rupees / 10000000);
    const remaining = rupees % 10000000;
    let result = convertLessThanThousand(crores) + ' Crore';
    if (remaining > 0) result += ' ' + numberToWords(remaining).replace('Indian Rupee ', '').replace(' Only', '');
    return 'Indian Rupee ' + result + ' Only';
  }
  if (rupees >= 100000) {
    const lakhs = Math.floor(rupees / 100000);
    const remaining = rupees % 100000;
    let result = convertLessThanThousand(lakhs) + ' Lakh';
    if (remaining > 0) result += ' ' + numberToWords(remaining).replace('Indian Rupee ', '').replace(' Only', '');
    return 'Indian Rupee ' + result + ' Only';
  }
  if (rupees >= 1000) {
    const thousands = Math.floor(rupees / 1000);
    const remaining = rupees % 1000;
    let result = convertLessThanThousand(thousands) + ' Thousand';
    if (remaining > 0) result += ' ' + convertLessThanThousand(remaining);
    return 'Indian Rupee ' + result + ' Only';
  }
  return 'Indian Rupee ' + convertLessThanThousand(rupees) + ' Only';
}

function readCreditNotesData() {
  ensureDataDir();
  if (!fs.existsSync(CREDIT_NOTES_FILE)) {
    const defaultData = { creditNotes: [], nextCreditNoteNumber: 1 };
    fs.writeFileSync(CREDIT_NOTES_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(CREDIT_NOTES_FILE, "utf-8"));
}

function writeCreditNotesData(data: any) {
  ensureDataDir();
  fs.writeFileSync(CREDIT_NOTES_FILE, JSON.stringify(data, null, 2));
}

function generateCreditNoteNumber(num: number): string {
  return `CN-${String(num).padStart(5, '0')}`;
}


function writeInvoicesData(data: any) {
  ensureDataDir();
  fs.writeFileSync(INVOICES_FILE, JSON.stringify(data, null, 2));
}

function readVendorsData() {
  ensureDataDir();
  if (!fs.existsSync(VENDORS_FILE)) {
    const defaultData = { vendors: [], nextVendorId: 1 };
    fs.writeFileSync(VENDORS_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(VENDORS_FILE, "utf-8"));
}

function writeVendorsData(data: any) {
  ensureDataDir();
  fs.writeFileSync(VENDORS_FILE, JSON.stringify(data, null, 2));
}

function readDeliveryChallansData() {
  ensureDataDir();
  if (!fs.existsSync(DELIVERY_CHALLANS_FILE)) {
    const defaultData = { deliveryChallans: [], nextChallanNumber: 1 };
    fs.writeFileSync(DELIVERY_CHALLANS_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(DELIVERY_CHALLANS_FILE, "utf-8"));
}

function writeDeliveryChallansData(data: any) {
  ensureDataDir();
  fs.writeFileSync(DELIVERY_CHALLANS_FILE, JSON.stringify(data, null, 2));
}

function generateChallanNumber(num: number): string {
  return `DC-${String(num).padStart(5, '0')}`;
}

function readExpensesData() {
  ensureDataDir();
  if (!fs.existsSync(EXPENSES_FILE)) {
    const defaultData = {
      expenses: [],
      mileageRecords: [],
      mileageSettings: {
        associateEmployeesToExpenses: false,
        defaultMileageCategory: "Fuel/Mileage Expense",
        defaultUnit: "km",
        mileageRates: []
      },
      nextExpenseId: 1,
      nextMileageId: 1
    };
    fs.writeFileSync(EXPENSES_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(EXPENSES_FILE, "utf-8"));
}

function writeExpensesData(data: any) {
  ensureDataDir();
  fs.writeFileSync(EXPENSES_FILE, JSON.stringify(data, null, 2));
}

function generateExpenseNumber(num: number): string {
  return `EXP-${String(num).padStart(5, '0')}`;
}

function readDashboardData() {
  ensureDataDir();
  if (!fs.existsSync(DASHBOARD_FILE)) {
    const defaultData = {
      summary: { totalReceivables: { totalUnpaid: 0, current: 0, overdue: 0 }, totalPayables: { totalUnpaid: 0, current: 0, overdue: 0 } },
      cashFlow: [],
      incomeExpense: [],
      topExpenses: []
    };
    fs.writeFileSync(DASHBOARD_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(DASHBOARD_FILE, "utf-8"));
}

function writeDashboardData(data: any) {
  ensureDataDir();
  fs.writeFileSync(DASHBOARD_FILE, JSON.stringify(data, null, 2));
}

function readReportsData() {
  ensureDataDir();
  if (!fs.existsSync(REPORTS_FILE)) {
    const defaultData = {
      profitAndLoss: { totalIncome: 0, totalExpenses: 0, netProfit: 0, monthlyData: [] },
      salesByCustomer: [],
      expenseBreakdown: []
    };
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(REPORTS_FILE, "utf-8"));
}

function writeReportsData(data: any) {
  ensureDataDir();
  fs.writeFileSync(REPORTS_FILE, JSON.stringify(data, null, 2));
}

function readPurchaseOrdersData() {
  ensureDataDir();
  if (!fs.existsSync(PURCHASE_ORDERS_FILE)) {
    const defaultData = { purchaseOrders: [], nextPurchaseOrderNumber: 1 };
    fs.writeFileSync(PURCHASE_ORDERS_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(PURCHASE_ORDERS_FILE, "utf-8"));
}

function writePurchaseOrdersData(data: any) {
  ensureDataDir();
  fs.writeFileSync(PURCHASE_ORDERS_FILE, JSON.stringify(data, null, 2));
}

function generatePurchaseOrderNumber(num: number): string {
  return `PO-2025-${String(num).padStart(4, '0')}`;
}

function readBillsData() {
  ensureDataDir();
  if (!fs.existsSync(BILLS_FILE)) {
    const defaultData = {
      bills: [],
      nextBillNumber: 1,
      accounts: [
        { id: '1', name: 'Cost of Goods Sold', type: 'expense' },
        { id: '2', name: 'Office Supplies', type: 'expense' },
        { id: '3', name: 'Software', type: 'expense' },
        { id: '4', name: 'Professional Services', type: 'expense' },
        { id: '5', name: 'Utilities', type: 'expense' },
        { id: '6', name: 'Rent', type: 'expense' },
        { id: '7', name: 'Travel Expense', type: 'expense' },
        { id: '8', name: 'Marketing', type: 'expense' }
      ],
      taxes: [
        { id: '1', name: 'IGST18', rate: 18 },
        { id: '2', name: 'CGST9', rate: 9 },
        { id: '3', name: 'SGST9', rate: 9 },
        { id: '4', name: 'GST5', rate: 5 },
        { id: '5', name: 'GST12', rate: 12 },
        { id: '6', name: 'GST28', rate: 28 }
      ]
    };
    fs.writeFileSync(BILLS_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(BILLS_FILE, "utf-8"));
}

function writeBillsData(data: any) {
  ensureDataDir();
  fs.writeFileSync(BILLS_FILE, JSON.stringify(data, null, 2));
}

function generateBillNumber(num: number): string {
  return String(num);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Items API
  app.get("/api/items", (req: Request, res: Response) => {
    try {
      const items = readItems();
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 1000;
      const offset = (page - 1) * limit;

      const paginatedItems = items.slice(offset, offset + limit);

      res.json({
        success: true,
        data: paginatedItems,
        meta: {
          page,
          limit,
          total: items.length,
          totalPages: Math.ceil(items.length / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to read items" });
    }
  });

  app.get("/api/items/:id", (req: Request, res: Response) => {
    try {
      const items = readItems();
      const item = items.find((i: any) => i.id === req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to read item" });
    }
  });

  app.post("/api/items", (req: Request, res: Response) => {
    try {
      const items = readItems();
      const newItem = {
        id: Date.now().toString(),
        ...req.body,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      items.push(newItem);
      writeItems(items);
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to create item" });
    }
  });

  app.put("/api/items/:id", (req: Request, res: Response) => {
    try {
      const items = readItems();
      const index = items.findIndex((i: any) => i.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: "Item not found" });
      }
      items[index] = {
        ...items[index],
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      writeItems(items);
      res.json(items[index]);
    } catch (error) {
      res.status(500).json({ error: "Failed to update item" });
    }
  });

  app.delete("/api/items/:id", (req: Request, res: Response) => {
    try {
      const items = readItems();
      const index = items.findIndex((i: any) => i.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: "Item not found" });
      }
      items.splice(index, 1);
      writeItems(items);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete item" });
    }
  });

  // Clone an item
  app.post("/api/items/:id/clone", (req: Request, res: Response) => {
    try {
      const items = readItems();
      const item = items.find((i: any) => i.id === req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      const clonedItem = {
        ...item,
        id: Date.now().toString(),
        name: `${item.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      items.push(clonedItem);
      writeItems(items);
      res.status(201).json(clonedItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to clone item" });
    }
  });

  // Toggle item active status
  app.patch("/api/items/:id/status", (req: Request, res: Response) => {
    try {
      const items = readItems();
      const index = items.findIndex((i: any) => i.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: "Item not found" });
      }
      items[index] = {
        ...items[index],
        isActive: req.body.isActive,
        updatedAt: new Date().toISOString()
      };
      writeItems(items);
      res.json(items[index]);
    } catch (error) {
      res.status(500).json({ error: "Failed to update item status" });
    }
  });

  // Customers API
  app.get("/api/customers", (req: Request, res: Response) => {
    try {
      const data = readCustomersData();
      res.json({ success: true, data: data.customers });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch customers" });
    }
  });

  app.get("/api/customers/:id", (req: Request, res: Response) => {
    try {
      const data = readCustomersData();
      const customer = data.customers.find((c: any) => c.id === req.params.id);
      if (!customer) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }
      res.json({ success: true, data: customer });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch customer" });
    }
  });

  app.post("/api/customers", (req: Request, res: Response) => {
    try {
      const data = readCustomersData();
      const newCustomer = {
        id: String(data.nextCustomerId),
        ...req.body,
        status: req.body.status || "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.customers.push(newCustomer);
      data.nextCustomerId += 1;
      writeCustomersData(data);
      res.status(201).json({ success: true, data: newCustomer });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create customer" });
    }
  });

  app.put("/api/customers/:id", (req: Request, res: Response) => {
    try {
      const data = readCustomersData();
      const index = data.customers.findIndex((c: any) => c.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }
      data.customers[index] = {
        ...data.customers[index],
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      writeCustomersData(data);
      res.json({ success: true, data: data.customers[index] });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update customer" });
    }
  });

  app.delete("/api/customers/:id", (req: Request, res: Response) => {
    try {
      const data = readCustomersData();
      const index = data.customers.findIndex((c: any) => c.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }
      data.customers.splice(index, 1);
      writeCustomersData(data);
      res.json({ success: true, message: "Customer deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete customer" });
    }
  });

  app.post("/api/customers/:id/clone", (req: Request, res: Response) => {
    try {
      const data = readCustomersData();
      const customer = data.customers.find((c: any) => c.id === req.params.id);
      if (!customer) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }
      const clonedCustomer = {
        ...customer,
        id: String(data.nextCustomerId),
        name: `${customer.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.customers.push(clonedCustomer);
      data.nextCustomerId += 1;
      writeCustomersData(data);
      res.status(201).json({ success: true, data: clonedCustomer });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to clone customer" });
    }
  });

  app.patch("/api/customers/:id/status", (req: Request, res: Response) => {
    try {
      const data = readCustomersData();
      const index = data.customers.findIndex((c: any) => c.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }
      data.customers[index] = {
        ...data.customers[index],
        status: req.body.status,
        updatedAt: new Date().toISOString()
      };
      writeCustomersData(data);
      res.json({ success: true, data: data.customers[index] });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update customer status" });
    }
  });

  // Customer Comments API
  app.get("/api/customers/:id/comments", (req: Request, res: Response) => {
    try {
      const data = readCustomersData();
      const customer = data.customers.find((c: any) => c.id === req.params.id);
      if (!customer) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }
      res.json({ success: true, data: customer.comments || [] });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch comments" });
    }
  });

  app.post("/api/customers/:id/comments", (req: Request, res: Response) => {
    try {
      const data = readCustomersData();
      const index = data.customers.findIndex((c: any) => c.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }
      const newComment = {
        id: String(Date.now()),
        text: req.body.text,
        author: req.body.author || "Admin User",
        createdAt: new Date().toISOString()
      };
      if (!data.customers[index].comments) {
        data.customers[index].comments = [];
      }
      data.customers[index].comments.push(newComment);
      writeCustomersData(data);
      res.status(201).json({ success: true, data: newComment });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to add comment" });
    }
  });

  // Customer Transactions API
  app.get("/api/customers/:id/transactions", (req: Request, res: Response) => {
    try {
      const customerId = req.params.id;
      const invoicesData = readInvoicesData();
      const quotesData = readQuotesData();
      const salesOrdersData = readSalesOrdersData();
      
      const customerInvoices = (invoicesData.invoices || []).filter((inv: any) => inv.customerId === customerId);
      const customerQuotes = (quotesData.quotes || []).filter((q: any) => q.customerId === customerId);
      const customerSalesOrders = (salesOrdersData.salesOrders || []).filter((so: any) => so.customerId === customerId);
      
      res.json({
        success: true,
        data: {
          invoices: customerInvoices.map((inv: any) => ({
            id: inv.id,
            type: 'invoice',
            date: inv.date || inv.invoiceDate,
            number: inv.invoiceNumber,
            orderNumber: inv.salesOrderNumber || '',
            amount: inv.total || 0,
            balance: inv.balanceDue || inv.total || 0,
            status: inv.status || 'Draft'
          })),
          customerPayments: [],
          quotes: customerQuotes.map((q: any) => ({
            id: q.id,
            type: 'quote',
            date: q.date,
            number: q.quoteNumber,
            orderNumber: q.referenceNumber || '',
            amount: q.total || 0,
            balance: 0,
            status: q.status || 'Draft'
          })),
          salesOrders: customerSalesOrders.map((so: any) => ({
            id: so.id,
            type: 'salesOrder',
            date: so.date || so.salesOrderDate,
            number: so.salesOrderNumber,
            orderNumber: so.referenceNumber || '',
            amount: so.total || 0,
            balance: 0,
            status: so.status || 'Draft'
          })),
          deliveryChallans: [],
          recurringInvoices: [],
          expenses: [],
          projects: [],
          journals: [],
          bills: [],
          creditNotes: []
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch transactions" });
    }
  });

  // Customer Mails API
  app.get("/api/customers/:id/mails", (req: Request, res: Response) => {
    try {
      const data = readCustomersData();
      const customer = data.customers.find((c: any) => c.id === req.params.id);
      if (!customer) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }
      res.json({ success: true, data: customer.mails || [] });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch mails" });
    }
  });

  // Customer Activities API
  app.get("/api/customers/:id/activities", (req: Request, res: Response) => {
    try {
      const data = readCustomersData();
      const customer = data.customers.find((c: any) => c.id === req.params.id);
      if (!customer) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }
      res.json({ success: true, data: customer.activities || [] });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch activities" });
    }
  });

  // Quotes API
  app.get("/api/quotes/next-number", (req: Request, res: Response) => {
    try {
      const data = readQuotesData();
      const nextNumber = generateQuoteNumber(data.nextQuoteNumber);
      res.json({ success: true, data: { quoteNumber: nextNumber } });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get next quote number" });
    }
  });

  app.get("/api/quotes", (req: Request, res: Response) => {
    try {
      const data = readQuotesData();
      const quotes = data.quotes.map((quote: any) => ({
        id: quote.id,
        date: quote.date,
        quoteNumber: quote.quoteNumber,
        referenceNumber: quote.referenceNumber,
        customerName: quote.customerName,
        status: quote.status,
        convertedTo: quote.convertedTo,
        total: quote.total
      }));
      res.json({ success: true, data: quotes });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch quotes" });
    }
  });

  app.get("/api/quotes/:id", (req: Request, res: Response) => {
    try {
      const data = readQuotesData();
      const quote = data.quotes.find((q: any) => q.id === req.params.id);
      if (!quote) {
        return res.status(404).json({ success: false, message: "Quote not found" });
      }
      res.json({ success: true, data: quote });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch quote" });
    }
  });

  app.post("/api/quotes", (req: Request, res: Response) => {
    try {
      const data = readQuotesData();
      const quoteNumber = generateQuoteNumber(data.nextQuoteNumber);
      const now = new Date().toISOString();

      const newQuote = {
        id: String(Date.now()),
        quoteNumber,
        referenceNumber: req.body.referenceNumber || '',
        date: req.body.date || new Date().toISOString().split('T')[0],
        expiryDate: req.body.expiryDate || '',
        customerId: req.body.customerId || '',
        customerName: req.body.customerName || '',
        billingAddress: req.body.billingAddress || { street: '', city: '', state: '', country: 'India', pincode: '' },
        shippingAddress: req.body.shippingAddress || { street: '', city: '', state: '', country: 'India', pincode: '' },
        salesperson: req.body.salesperson || '',
        projectName: req.body.projectName || '',
        subject: req.body.subject || '',
        placeOfSupply: req.body.placeOfSupply || '',
        pdfTemplate: req.body.pdfTemplate || 'Standard Template',
        items: req.body.items || [],
        subTotal: req.body.subTotal || 0,
        shippingCharges: req.body.shippingCharges || 0,
        tdsType: req.body.tdsType || '',
        tdsAmount: req.body.tdsAmount || 0,
        cgst: req.body.cgst || 0,
        sgst: req.body.sgst || 0,
        igst: req.body.igst || 0,
        adjustment: req.body.adjustment || 0,
        total: req.body.total || 0,
        customerNotes: req.body.customerNotes || 'Looking forward for your business.',
        termsAndConditions: req.body.termsAndConditions || '',
        status: req.body.status || 'DRAFT',
        emailRecipients: req.body.emailRecipients || [],
        createdAt: now,
        updatedAt: now,
        createdBy: req.body.createdBy || 'Admin User',
        activityLogs: [
          {
            id: '1',
            timestamp: now,
            action: 'created',
            description: `Quote created for ₹${req.body.total?.toLocaleString('en-IN') || '0.00'}`,
            user: req.body.createdBy || 'Admin User'
          }
        ]
      };

      data.quotes.unshift(newQuote);
      data.nextQuoteNumber += 1;
      writeQuotesData(data);

      res.status(201).json({ success: true, data: newQuote });
    } catch (error) {
      console.error('Error creating quote:', error);
      res.status(500).json({ success: false, message: 'Failed to create quote' });
    }
  });

  app.put("/api/quotes/:id", (req: Request, res: Response) => {
    try {
      const data = readQuotesData();
      const quoteIndex = data.quotes.findIndex((q: any) => q.id === req.params.id);

      if (quoteIndex === -1) {
        return res.status(404).json({ success: false, message: 'Quote not found' });
      }

      const now = new Date().toISOString();
      const existingQuote = data.quotes[quoteIndex];

      const updatedQuote = {
        ...existingQuote,
        ...req.body,
        id: existingQuote.id,
        quoteNumber: existingQuote.quoteNumber,
        createdAt: existingQuote.createdAt,
        updatedAt: now,
        activityLogs: [
          ...existingQuote.activityLogs,
          {
            id: String(existingQuote.activityLogs.length + 1),
            timestamp: now,
            action: 'updated',
            description: 'Quote has been updated',
            user: req.body.updatedBy || 'Admin User'
          }
        ]
      };

      data.quotes[quoteIndex] = updatedQuote;
      writeQuotesData(data);

      res.json({ success: true, data: updatedQuote });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update quote' });
    }
  });

  app.patch("/api/quotes/:id/status", (req: Request, res: Response) => {
    try {
      const data = readQuotesData();
      const quoteIndex = data.quotes.findIndex((q: any) => q.id === req.params.id);

      if (quoteIndex === -1) {
        return res.status(404).json({ success: false, message: 'Quote not found' });
      }

      const now = new Date().toISOString();
      const existingQuote = data.quotes[quoteIndex];
      const newStatus = req.body.status;

      let actionDescription = '';
      switch (newStatus) {
        case 'SENT':
          actionDescription = 'Quote has been sent';
          break;
        case 'ACCEPTED':
          actionDescription = 'Quote marked as accepted';
          break;
        case 'DECLINED':
          actionDescription = 'Quote marked as declined';
          break;
        default:
          actionDescription = `Quote status changed to ${newStatus}`;
      }

      existingQuote.status = newStatus;
      existingQuote.updatedAt = now;
      existingQuote.activityLogs.push({
        id: String(existingQuote.activityLogs.length + 1),
        timestamp: now,
        action: newStatus.toLowerCase(),
        description: actionDescription,
        user: req.body.updatedBy || 'Admin User'
      });

      data.quotes[quoteIndex] = existingQuote;
      writeQuotesData(data);

      res.json({ success: true, data: existingQuote });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update quote status' });
    }
  });

  app.delete("/api/quotes/:id", (req: Request, res: Response) => {
    try {
      const data = readQuotesData();
      const quoteIndex = data.quotes.findIndex((q: any) => q.id === req.params.id);

      if (quoteIndex === -1) {
        return res.status(404).json({ success: false, message: 'Quote not found' });
      }

      data.quotes.splice(quoteIndex, 1);
      writeQuotesData(data);

      res.json({ success: true, message: 'Quote deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete quote' });
    }
  });

  // Sales Orders API
  app.get("/api/sales-orders/next-number", (req: Request, res: Response) => {
    try {
      const data = readSalesOrdersData();
      const nextNumber = generateSalesOrderNumber(data.nextSalesOrderNumber);
      res.json({ success: true, data: { salesOrderNumber: nextNumber } });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get next sales order number" });
    }
  });

  app.get("/api/sales-orders", (req: Request, res: Response) => {
    try {
      const data = readSalesOrdersData();
      const salesOrders = data.salesOrders.map((order: any) => ({
        id: order.id,
        date: order.date,
        salesOrderNumber: order.salesOrderNumber,
        referenceNumber: order.referenceNumber,
        customerName: order.customerName,
        orderStatus: order.orderStatus,
        invoiceStatus: order.invoiceStatus,
        paymentStatus: order.paymentStatus,
        total: order.total,
        expectedShipmentDate: order.expectedShipmentDate
      }));
      res.json({ success: true, data: salesOrders });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch sales orders" });
    }
  });

  app.get("/api/sales-orders/:id", (req: Request, res: Response) => {
    try {
      const data = readSalesOrdersData();
      const salesOrder = data.salesOrders.find((o: any) => o.id === req.params.id);
      if (!salesOrder) {
        return res.status(404).json({ success: false, message: "Sales order not found" });
      }
      res.json({ success: true, data: salesOrder });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch sales order" });
    }
  });

  app.post("/api/sales-orders", (req: Request, res: Response) => {
    try {
      const data = readSalesOrdersData();
      const salesOrderNumber = generateSalesOrderNumber(data.nextSalesOrderNumber);
      const now = new Date().toISOString();

      const newSalesOrder = {
        id: String(Date.now()),
        salesOrderNumber,
        referenceNumber: req.body.referenceNumber || '',
        date: req.body.date || new Date().toISOString().split('T')[0],
        expectedShipmentDate: req.body.expectedShipmentDate || '',
        customerId: req.body.customerId || '',
        customerName: req.body.customerName || '',
        billingAddress: req.body.billingAddress || { street: '', city: '', state: '', country: 'India', pincode: '' },
        shippingAddress: req.body.shippingAddress || { street: '', city: '', state: '', country: 'India', pincode: '' },
        paymentTerms: req.body.paymentTerms || 'Due on Receipt',
        deliveryMethod: req.body.deliveryMethod || '',
        salesperson: req.body.salesperson || '',
        placeOfSupply: req.body.placeOfSupply || '',
        items: req.body.items || [],
        subTotal: req.body.subTotal || 0,
        shippingCharges: req.body.shippingCharges || 0,
        tdsType: req.body.tdsType || '',
        tdsAmount: req.body.tdsAmount || 0,
        cgst: req.body.cgst || 0,
        sgst: req.body.sgst || 0,
        igst: req.body.igst || 0,
        adjustment: req.body.adjustment || 0,
        total: req.body.total || 0,
        customerNotes: req.body.customerNotes || 'Thanks for your business.',
        termsAndConditions: req.body.termsAndConditions || '',
        orderStatus: req.body.orderStatus || 'DRAFT',
        invoiceStatus: 'Not Invoiced',
        paymentStatus: 'Unpaid',
        shipmentStatus: 'Pending',
        invoices: [],
        pdfTemplate: req.body.pdfTemplate || 'Standard Template',
        createdAt: now,
        updatedAt: now,
        createdBy: req.body.createdBy || 'Admin User',
        activityLogs: [
          {
            id: '1',
            timestamp: now,
            action: 'created',
            description: `Sales Order created for ₹${req.body.total?.toLocaleString('en-IN') || '0.00'}`,
            user: req.body.createdBy || 'Admin User'
          }
        ]
      };

      data.salesOrders.unshift(newSalesOrder);
      data.nextSalesOrderNumber += 1;
      writeSalesOrdersData(data);

      res.status(201).json({ success: true, data: newSalesOrder });
    } catch (error) {
      console.error('Error creating sales order:', error);
      res.status(500).json({ success: false, message: 'Failed to create sales order' });
    }
  });

  app.put("/api/sales-orders/:id", (req: Request, res: Response) => {
    try {
      const data = readSalesOrdersData();
      const orderIndex = data.salesOrders.findIndex((o: any) => o.id === req.params.id);

      if (orderIndex === -1) {
        return res.status(404).json({ success: false, message: 'Sales order not found' });
      }

      const now = new Date().toISOString();
      const existingOrder = data.salesOrders[orderIndex];

      const updatedOrder = {
        ...existingOrder,
        ...req.body,
        id: existingOrder.id,
        salesOrderNumber: existingOrder.salesOrderNumber,
        createdAt: existingOrder.createdAt,
        updatedAt: now,
        activityLogs: [
          ...existingOrder.activityLogs,
          {
            id: String(existingOrder.activityLogs.length + 1),
            timestamp: now,
            action: 'updated',
            description: 'Sales Order has been updated',
            user: req.body.updatedBy || 'Admin User'
          }
        ]
      };

      data.salesOrders[orderIndex] = updatedOrder;
      writeSalesOrdersData(data);

      res.json({ success: true, data: updatedOrder });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update sales order' });
    }
  });

  app.patch("/api/sales-orders/:id/status", (req: Request, res: Response) => {
    try {
      const data = readSalesOrdersData();
      const orderIndex = data.salesOrders.findIndex((o: any) => o.id === req.params.id);

      if (orderIndex === -1) {
        return res.status(404).json({ success: false, message: 'Sales order not found' });
      }

      const now = new Date().toISOString();
      const existingOrder = data.salesOrders[orderIndex];
      const newStatus = req.body.orderStatus;

      let actionDescription = `Status changed to ${newStatus}`;

      existingOrder.orderStatus = newStatus;
      existingOrder.updatedAt = now;
      existingOrder.activityLogs.push({
        id: String(existingOrder.activityLogs.length + 1),
        timestamp: now,
        action: newStatus.toLowerCase(),
        description: actionDescription,
        user: req.body.updatedBy || 'Admin User'
      });

      data.salesOrders[orderIndex] = existingOrder;
      writeSalesOrdersData(data);

      res.json({ success: true, data: existingOrder });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update sales order status' });
    }
  });

  app.post("/api/sales-orders/:id/convert-to-invoice", (req: Request, res: Response) => {
    try {
      const data = readSalesOrdersData();
      const orderIndex = data.salesOrders.findIndex((o: any) => o.id === req.params.id);

      if (orderIndex === -1) {
        return res.status(404).json({ success: false, message: 'Sales order not found' });
      }

      const now = new Date().toISOString();
      const existingOrder = data.salesOrders[orderIndex];
      const invoiceNumber = generateInvoiceNumber(data.nextInvoiceNumber);

      const newInvoice = {
        id: invoiceNumber,
        invoiceNumber: invoiceNumber,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date().toISOString().split('T')[0],
        status: 'DRAFT',
        amount: existingOrder.total,
        balanceDue: existingOrder.total
      };

      existingOrder.invoices.push(newInvoice);
      existingOrder.invoiceStatus = 'Invoiced';
      existingOrder.orderStatus = 'CLOSED';
      existingOrder.updatedAt = now;

      existingOrder.items = existingOrder.items.map((item: any) => ({
        ...item,
        invoicedQty: item.quantity,
        invoiceStatus: 'Invoiced'
      }));

      existingOrder.activityLogs.push({
        id: String(existingOrder.activityLogs.length + 1),
        timestamp: now,
        action: 'invoiced',
        description: `Invoice ${invoiceNumber} created`,
        user: req.body.createdBy || 'Admin User'
      });

      data.salesOrders[orderIndex] = existingOrder;
      data.nextInvoiceNumber += 1;
      writeSalesOrdersData(data);

      res.json({ success: true, data: { salesOrder: existingOrder, invoice: newInvoice } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to convert to invoice' });
    }
  });

  app.delete("/api/sales-orders/:id", (req: Request, res: Response) => {
    try {
      const data = readSalesOrdersData();
      const orderIndex = data.salesOrders.findIndex((o: any) => o.id === req.params.id);

      if (orderIndex === -1) {
        return res.status(404).json({ success: false, message: 'Sales order not found' });
      }

      data.salesOrders.splice(orderIndex, 1);
      writeSalesOrdersData(data);

      res.json({ success: true, message: 'Sales order deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete sales order' });
    }
  });

  // Invoices API
  app.get("/api/invoices/next-number", (req: Request, res: Response) => {
    try {
      const data = readInvoicesData();
      const nextNumber = generateInvoiceNumber(data.nextInvoiceNumber);
      res.json({ success: true, data: { invoiceNumber: nextNumber } });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get next invoice number" });
    }
  });

  app.get("/api/invoices", (req: Request, res: Response) => {
    try {
      const data = readInvoicesData();
      const invoices = data.invoices.map((invoice: any) => ({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        customerName: invoice.customerName,
        customerId: invoice.customerId,
        date: invoice.date,
        dueDate: invoice.dueDate,
        amount: invoice.total,
        status: invoice.status,
        terms: invoice.paymentTerms,
        balanceDue: invoice.balanceDue
      }));
      res.json({ success: true, data: invoices });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch invoices" });
    }
  });

  app.get("/api/invoices/:id", (req: Request, res: Response) => {
    try {
      const data = readInvoicesData();
      const invoice = data.invoices.find((i: any) => i.id === req.params.id);
      if (!invoice) {
        return res.status(404).json({ success: false, message: "Invoice not found" });
      }
      res.json({ success: true, data: invoice });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch invoice" });
    }
  });

  app.post("/api/invoices", (req: Request, res: Response) => {
    try {
      const data = readInvoicesData();
      const invoiceNumber = generateInvoiceNumber(data.nextInvoiceNumber);
      const now = new Date().toISOString();

      const newInvoice = {
        id: String(Date.now()),
        invoiceNumber,
        referenceNumber: req.body.referenceNumber || '',
        date: req.body.date || new Date().toISOString().split('T')[0],
        dueDate: req.body.dueDate || new Date().toISOString().split('T')[0],
        customerId: req.body.customerId || '',
        customerName: req.body.customerName || '',
        billingAddress: req.body.billingAddress || { street: '', city: '', state: '', country: 'India', pincode: '' },
        shippingAddress: req.body.shippingAddress || { street: '', city: '', state: '', country: 'India', pincode: '' },
        salesperson: req.body.salesperson || '',
        placeOfSupply: req.body.placeOfSupply || '',
        paymentTerms: req.body.paymentTerms || 'Due on Receipt',
        items: req.body.items || [],
        subTotal: req.body.subTotal || 0,
        shippingCharges: req.body.shippingCharges || 0,
        cgst: req.body.cgst || 0,
        sgst: req.body.sgst || 0,
        igst: req.body.igst || 0,
        adjustment: req.body.adjustment || 0,
        total: req.body.total || 0,
        amountPaid: req.body.amountPaid || 0,
        balanceDue: req.body.total || 0,
        customerNotes: req.body.customerNotes || '',
        termsAndConditions: req.body.termsAndConditions || '',
        status: req.body.status || 'PENDING',
        sourceType: req.body.sourceType || null,
        sourceId: req.body.sourceId || null,
        sourceNumber: req.body.sourceNumber || null,
        pdfTemplate: req.body.pdfTemplate || 'Standard Template',
        createdAt: now,
        updatedAt: now,
        createdBy: req.body.createdBy || 'Admin User',
        payments: [],
        activityLogs: [
          {
            id: '1',
            timestamp: now,
            action: 'created',
            description: `Invoice created for ₹${req.body.total?.toLocaleString('en-IN') || '0.00'}`,
            user: req.body.createdBy || 'Admin User'
          }
        ]
      };

      data.invoices.unshift(newInvoice);
      data.nextInvoiceNumber += 1;
      writeInvoicesData(data);

      res.status(201).json({ success: true, data: newInvoice });
    } catch (error) {
      console.error('Error creating invoice:', error);
      res.status(500).json({ success: false, message: 'Failed to create invoice' });
    }
  });

  app.put("/api/invoices/:id", (req: Request, res: Response) => {
    try {
      const data = readInvoicesData();
      const invoiceIndex = data.invoices.findIndex((i: any) => i.id === req.params.id);

      if (invoiceIndex === -1) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
      }

      const now = new Date().toISOString();
      const existingInvoice = data.invoices[invoiceIndex];

      const updatedInvoice = {
        ...existingInvoice,
        ...req.body,
        id: existingInvoice.id,
        invoiceNumber: existingInvoice.invoiceNumber,
        createdAt: existingInvoice.createdAt,
        updatedAt: now,
        activityLogs: [
          ...existingInvoice.activityLogs,
          {
            id: String(existingInvoice.activityLogs.length + 1),
            timestamp: now,
            action: 'updated',
            description: 'Invoice has been updated',
            user: req.body.updatedBy || 'Admin User'
          }
        ]
      };

      data.invoices[invoiceIndex] = updatedInvoice;
      writeInvoicesData(data);

      res.json({ success: true, data: updatedInvoice });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update invoice' });
    }
  });

  app.patch("/api/invoices/:id/status", (req: Request, res: Response) => {
    try {
      const data = readInvoicesData();
      const invoiceIndex = data.invoices.findIndex((i: any) => i.id === req.params.id);

      if (invoiceIndex === -1) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
      }

      const now = new Date().toISOString();
      const existingInvoice = data.invoices[invoiceIndex];
      const newStatus = req.body.status;

      let actionDescription = `Status changed to ${newStatus}`;
      if (newStatus === 'SENT') actionDescription = 'Invoice has been sent';
      if (newStatus === 'PAID') actionDescription = 'Invoice marked as paid';

      existingInvoice.status = newStatus;
      existingInvoice.updatedAt = now;
      existingInvoice.activityLogs.push({
        id: String(existingInvoice.activityLogs.length + 1),
        timestamp: now,
        action: newStatus.toLowerCase(),
        description: actionDescription,
        user: req.body.updatedBy || 'Admin User'
      });

      data.invoices[invoiceIndex] = existingInvoice;
      writeInvoicesData(data);

      res.json({ success: true, data: existingInvoice });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update invoice status' });
    }
  });

  app.post("/api/invoices/:id/record-payment", (req: Request, res: Response) => {
    try {
      const data = readInvoicesData();
      const invoiceIndex = data.invoices.findIndex((i: any) => i.id === req.params.id);

      if (invoiceIndex === -1) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
      }

      const now = new Date().toISOString();
      const existingInvoice = data.invoices[invoiceIndex];
      const paymentAmount = req.body.amount || 0;
      const paymentDate = req.body.date || new Date().toISOString();

      const payment = {
        id: String(Date.now()),
        date: paymentDate,
        amount: paymentAmount,
        paymentMode: req.body.paymentMode || 'Cash',
        reference: req.body.reference || '',
        notes: req.body.notes || ''
      };

      existingInvoice.payments.push(payment);
      existingInvoice.amountPaid = (existingInvoice.amountPaid || 0) + paymentAmount;
      existingInvoice.balanceDue = existingInvoice.total - existingInvoice.amountPaid;

      if (existingInvoice.balanceDue <= 0) {
        existingInvoice.status = 'PAID';
        existingInvoice.balanceDue = 0;
      } else {
        existingInvoice.status = 'PARTIALLY_PAID';
      }

      existingInvoice.updatedAt = now;
      existingInvoice.activityLogs.push({
        id: String(existingInvoice.activityLogs.length + 1),
        timestamp: now,
        action: 'payment_recorded',
        description: `Payment of ₹${paymentAmount.toLocaleString('en-IN')} recorded`,
        user: req.body.recordedBy || 'Admin User'
      });

      data.invoices[invoiceIndex] = existingInvoice;
      writeInvoicesData(data);

      // Also create a record in Payments Received
      const paymentsData = readPaymentsReceivedData();
      const paymentNumber = generatePaymentNumber(paymentsData.nextPaymentNumber);
      
      const newPaymentReceived = {
        id: `pr-${Date.now()}`,
        paymentNumber,
        date: paymentDate.split('T')[0],
        referenceNumber: req.body.reference || '',
        customerId: existingInvoice.customerId || '',
        customerName: existingInvoice.customerName || '',
        customerEmail: existingInvoice.customerEmail || '',
        invoices: [{
          invoiceId: existingInvoice.id,
          invoiceNumber: existingInvoice.invoiceNumber,
          invoiceDate: existingInvoice.date,
          invoiceAmount: existingInvoice.total,
          amountDue: existingInvoice.balanceDue,
          paymentAmount: paymentAmount
        }],
        mode: req.body.paymentMode || 'Cash',
        depositTo: 'Petty Cash',
        amount: paymentAmount,
        unusedAmount: 0,
        bankCharges: 0,
        tax: '',
        taxAmount: 0,
        notes: req.body.notes || `Payment for ${existingInvoice.invoiceNumber}`,
        attachments: [],
        sendThankYou: false,
        status: 'PAID',
        paymentType: 'invoice_payment',
        placeOfSupply: existingInvoice.placeOfSupply || '',
        descriptionOfSupply: '',
        amountInWords: numberToWords(paymentAmount),
        journalEntries: [],
        createdAt: now
      };

      paymentsData.paymentsReceived.push(newPaymentReceived);
      paymentsData.nextPaymentNumber++;
      writePaymentsReceivedData(paymentsData);

      res.json({ success: true, data: existingInvoice, paymentReceived: newPaymentReceived });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to record payment' });
    }
  });

  app.delete("/api/invoices/:id", (req: Request, res: Response) => {
    try {
      const data = readInvoicesData();
      const invoiceIndex = data.invoices.findIndex((i: any) => i.id === req.params.id);

      if (invoiceIndex === -1) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
      }

      data.invoices.splice(invoiceIndex, 1);
      writeInvoicesData(data);

      res.json({ success: true, message: 'Invoice deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete invoice' });
    }
  });

  // Quote to Invoice/Sales Order conversion
  app.post("/api/quotes/:id/convert-to-invoice", (req: Request, res: Response) => {
    try {
      const quotesData = readQuotesData();
      const quoteIndex = quotesData.quotes.findIndex((q: any) => q.id === req.params.id);

      if (quoteIndex === -1) {
        return res.status(404).json({ success: false, message: 'Quote not found' });
      }

      const quote = quotesData.quotes[quoteIndex];
      const invoicesData = readInvoicesData();
      const now = new Date().toISOString();
      const invoiceNumber = generateInvoiceNumber(invoicesData.nextInvoiceNumber);

      const newInvoice = {
        id: String(Date.now()),
        invoiceNumber,
        referenceNumber: quote.referenceNumber || '',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        customerId: quote.customerId,
        customerName: quote.customerName,
        billingAddress: quote.billingAddress,
        shippingAddress: quote.shippingAddress,
        salesperson: quote.salesperson,
        placeOfSupply: quote.placeOfSupply,
        paymentTerms: 'Net 30',
        items: quote.items,
        subTotal: quote.subTotal,
        shippingCharges: quote.shippingCharges,
        cgst: quote.cgst,
        sgst: quote.sgst,
        igst: quote.igst,
        adjustment: quote.adjustment,
        total: quote.total,
        amountPaid: 0,
        balanceDue: quote.total,
        customerNotes: quote.customerNotes,
        termsAndConditions: quote.termsAndConditions,
        status: 'PENDING',
        sourceType: 'quote',
        sourceId: quote.id,
        sourceNumber: quote.quoteNumber,
        pdfTemplate: quote.pdfTemplate,
        createdAt: now,
        updatedAt: now,
        createdBy: req.body.createdBy || 'Admin User',
        payments: [],
        activityLogs: [
          {
            id: '1',
            timestamp: now,
            action: 'created',
            description: `Invoice created from Quote ${quote.quoteNumber}`,
            user: req.body.createdBy || 'Admin User'
          }
        ]
      };

      invoicesData.invoices.unshift(newInvoice);
      invoicesData.nextInvoiceNumber += 1;
      writeInvoicesData(invoicesData);

      // Update quote status
      quote.status = 'CONVERTED';
      quote.convertedTo = 'invoice';
      quote.updatedAt = now;
      quote.activityLogs.push({
        id: String(quote.activityLogs.length + 1),
        timestamp: now,
        action: 'converted',
        description: `Converted to Invoice ${invoiceNumber}`,
        user: req.body.createdBy || 'Admin User',
        link: `/invoices/${newInvoice.id}`
      });
      quotesData.quotes[quoteIndex] = quote;
      writeQuotesData(quotesData);

      res.status(201).json({ success: true, data: { quote, invoice: newInvoice } });
    } catch (error) {
      console.error('Error converting quote to invoice:', error);
      res.status(500).json({ success: false, message: 'Failed to convert quote to invoice' });
    }
  });

  app.post("/api/quotes/:id/convert-to-sales-order", (req: Request, res: Response) => {
    try {
      const quotesData = readQuotesData();
      const quoteIndex = quotesData.quotes.findIndex((q: any) => q.id === req.params.id);

      if (quoteIndex === -1) {
        return res.status(404).json({ success: false, message: 'Quote not found' });
      }

      const quote = quotesData.quotes[quoteIndex];
      const salesOrdersData = readSalesOrdersData();
      const now = new Date().toISOString();
      const salesOrderNumber = generateSalesOrderNumber(salesOrdersData.nextSalesOrderNumber);

      const newSalesOrder = {
        id: String(Date.now()),
        salesOrderNumber,
        referenceNumber: quote.referenceNumber || '',
        date: new Date().toISOString().split('T')[0],
        expectedShipmentDate: '',
        customerId: quote.customerId,
        customerName: quote.customerName,
        billingAddress: quote.billingAddress,
        shippingAddress: quote.shippingAddress,
        paymentTerms: 'Due on Receipt',
        deliveryMethod: '',
        salesperson: quote.salesperson,
        placeOfSupply: quote.placeOfSupply,
        items: quote.items.map((item: any) => ({
          ...item,
          invoicedQty: 0,
          invoiceStatus: 'Not Invoiced'
        })),
        subTotal: quote.subTotal,
        shippingCharges: quote.shippingCharges,
        cgst: quote.cgst,
        sgst: quote.sgst,
        igst: quote.igst,
        adjustment: quote.adjustment,
        total: quote.total,
        customerNotes: quote.customerNotes,
        termsAndConditions: quote.termsAndConditions,
        orderStatus: 'CONFIRMED',
        invoiceStatus: 'Not Invoiced',
        paymentStatus: 'Unpaid',
        shipmentStatus: 'Pending',
        invoices: [],
        sourceType: 'quote',
        sourceId: quote.id,
        sourceNumber: quote.quoteNumber,
        pdfTemplate: quote.pdfTemplate,
        createdAt: now,
        updatedAt: now,
        createdBy: req.body.createdBy || 'Admin User',
        activityLogs: [
          {
            id: '1',
            timestamp: now,
            action: 'created',
            description: `Sales Order created from Quote ${quote.quoteNumber}`,
            user: req.body.createdBy || 'Admin User'
          }
        ]
      };

      salesOrdersData.salesOrders.unshift(newSalesOrder);
      salesOrdersData.nextSalesOrderNumber += 1;
      writeSalesOrdersData(salesOrdersData);

      // Update quote status
      quote.status = 'CONVERTED';
      quote.convertedTo = 'sales-order';
      quote.updatedAt = now;
      quote.activityLogs.push({
        id: String(quote.activityLogs.length + 1),
        timestamp: now,
        action: 'converted',
        description: `Converted to Sales Order ${salesOrderNumber}`,
        user: req.body.createdBy || 'Admin User',
        link: `/sales-orders/${newSalesOrder.id}`
      });
      quotesData.quotes[quoteIndex] = quote;
      writeQuotesData(quotesData);

      res.status(201).json({ success: true, data: { quote, salesOrder: newSalesOrder } });
    } catch (error) {
      console.error('Error converting quote to sales order:', error);
      res.status(500).json({ success: false, message: 'Failed to convert quote to sales order' });
    }
  });

  app.patch("/api/quotes/:id/send", (req: Request, res: Response) => {
    try {
      const data = readQuotesData();
      const quoteIndex = data.quotes.findIndex((q: any) => q.id === req.params.id);

      if (quoteIndex === -1) {
        return res.status(404).json({ success: false, message: 'Quote not found' });
      }

      const now = new Date().toISOString();
      const quote = data.quotes[quoteIndex];

      quote.status = 'SENT';
      quote.updatedAt = now;
      quote.activityLogs.push({
        id: String(quote.activityLogs.length + 1),
        timestamp: now,
        action: 'sent',
        description: 'Quote has been sent to customer',
        user: req.body.sentBy || 'Admin User'
      });

      data.quotes[quoteIndex] = quote;
      writeQuotesData(data);

      res.json({ success: true, data: quote });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to send quote' });
    }
  });

  // Vendors API
  app.get("/api/vendors", (req: Request, res: Response) => {
    try {
      const data = readVendorsData();
      res.json({ success: true, data: data.vendors });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch vendors" });
    }
  });

  app.get("/api/vendors/:id", (req: Request, res: Response) => {
    try {
      const data = readVendorsData();
      const vendor = data.vendors.find((v: any) => v.id === req.params.id);
      if (!vendor) {
        return res.status(404).json({ success: false, message: "Vendor not found" });
      }
      res.json({ success: true, data: vendor });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch vendor" });
    }
  });

  app.post("/api/vendors", (req: Request, res: Response) => {
    try {
      const data = readVendorsData();
      const newVendor = {
        id: String(data.nextVendorId),
        ...req.body,
        status: req.body.status || "active",
        payables: 0,
        unusedCredits: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.vendors.push(newVendor);
      data.nextVendorId += 1;
      writeVendorsData(data);
      res.status(201).json({ success: true, data: newVendor });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create vendor" });
    }
  });

  app.put("/api/vendors/:id", (req: Request, res: Response) => {
    try {
      const data = readVendorsData();
      const index = data.vendors.findIndex((v: any) => v.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Vendor not found" });
      }
      data.vendors[index] = {
        ...data.vendors[index],
        ...req.body,
        updatedAt: new Date().toISOString()
      };
      writeVendorsData(data);
      res.json({ success: true, data: data.vendors[index] });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update vendor" });
    }
  });

  app.delete("/api/vendors/:id", (req: Request, res: Response) => {
    try {
      const data = readVendorsData();
      const index = data.vendors.findIndex((v: any) => v.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Vendor not found" });
      }
      data.vendors.splice(index, 1);
      writeVendorsData(data);
      res.json({ success: true, message: "Vendor deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete vendor" });
    }
  });

  app.post("/api/vendors/:id/clone", (req: Request, res: Response) => {
    try {
      const data = readVendorsData();
      const vendor = data.vendors.find((v: any) => v.id === req.params.id);
      if (!vendor) {
        return res.status(404).json({ success: false, message: "Vendor not found" });
      }
      const clonedVendor = {
        ...vendor,
        id: String(data.nextVendorId),
        displayName: `${vendor.displayName} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.vendors.push(clonedVendor);
      data.nextVendorId += 1;
      writeVendorsData(data);
      res.status(201).json({ success: true, data: clonedVendor });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to clone vendor" });
    }
  });

  app.patch("/api/vendors/:id/status", (req: Request, res: Response) => {
    try {
      const data = readVendorsData();
      const index = data.vendors.findIndex((v: any) => v.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Vendor not found" });
      }
      data.vendors[index] = {
        ...data.vendors[index],
        status: req.body.status,
        updatedAt: new Date().toISOString()
      };
      writeVendorsData(data);
      res.json({ success: true, data: data.vendors[index] });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update vendor status" });
    }
  });

  // Vendor Comments API
  app.get("/api/vendors/:id/comments", (req: Request, res: Response) => {
    try {
      const data = readVendorsData();
      const vendor = data.vendors.find((v: any) => v.id === req.params.id);
      if (!vendor) {
        return res.status(404).json({ success: false, message: "Vendor not found" });
      }
      res.json({ success: true, data: vendor.comments || [] });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch comments" });
    }
  });

  app.post("/api/vendors/:id/comments", (req: Request, res: Response) => {
    try {
      const data = readVendorsData();
      const index = data.vendors.findIndex((v: any) => v.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Vendor not found" });
      }
      const newComment = {
        id: String(Date.now()),
        text: req.body.text,
        author: req.body.author || "Admin User",
        createdAt: new Date().toISOString()
      };
      if (!data.vendors[index].comments) {
        data.vendors[index].comments = [];
      }
      data.vendors[index].comments.push(newComment);
      writeVendorsData(data);
      res.status(201).json({ success: true, data: newComment });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to add comment" });
    }
  });

  // Vendor Transactions API
  app.get("/api/vendors/:id/transactions", (req: Request, res: Response) => {
    try {
      const vendorId = req.params.id;
      const billsData = readBillsData();
      const purchaseOrdersData = readPurchaseOrdersData();
      const expensesData = readExpensesData();
      
      const vendorBills = (billsData.bills || []).filter((b: any) => b.vendorId === vendorId);
      const vendorPurchaseOrders = (purchaseOrdersData.purchaseOrders || []).filter((po: any) => po.vendorId === vendorId);
      const vendorExpenses = (expensesData.expenses || []).filter((e: any) => e.vendorId === vendorId);
      
      res.json({
        success: true,
        data: {
          bills: vendorBills.map((b: any) => ({
            id: b.id,
            type: 'bill',
            date: b.billDate || b.date,
            number: b.billNumber,
            orderNumber: b.orderNumber || '',
            vendor: b.vendorName || '',
            amount: b.total || 0,
            balance: b.balanceDue || b.total || 0,
            status: b.status || 'Draft'
          })),
          billPayments: [],
          expenses: vendorExpenses.map((e: any) => ({
            id: e.id,
            type: 'expense',
            date: e.date,
            number: e.expenseNumber || '',
            invoiceNumber: e.invoiceNumber || '',
            vendor: e.vendorName || '',
            paidThrough: e.paidThrough || '',
            customer: e.customerName || '',
            amount: e.amount || 0,
            balance: 0,
            status: e.status || 'Unbilled'
          })),
          purchaseOrders: vendorPurchaseOrders.map((po: any) => ({
            id: po.id,
            type: 'purchaseOrder',
            date: po.date || po.purchaseOrderDate,
            number: po.purchaseOrderNumber,
            referenceNumber: po.referenceNumber || '',
            deliveryDate: po.expectedDeliveryDate || '',
            amount: po.total || 0,
            balance: 0,
            status: po.status || 'Draft'
          })),
          vendorCredits: [],
          journals: []
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch transactions" });
    }
  });

  // Vendor Mails API
  app.get("/api/vendors/:id/mails", (req: Request, res: Response) => {
    try {
      const data = readVendorsData();
      const vendor = data.vendors.find((v: any) => v.id === req.params.id);
      if (!vendor) {
        return res.status(404).json({ success: false, message: "Vendor not found" });
      }
      res.json({ success: true, data: vendor.mails || [] });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch mails" });
    }
  });

  // Vendor Activities API
  app.get("/api/vendors/:id/activities", (req: Request, res: Response) => {
    try {
      const data = readVendorsData();
      const vendor = data.vendors.find((v: any) => v.id === req.params.id);
      if (!vendor) {
        return res.status(404).json({ success: false, message: "Vendor not found" });
      }
      res.json({ success: true, data: vendor.activities || [] });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch activities" });
    }
  });

  // Delivery Challans API
  app.get("/api/delivery-challans/next-number", (req: Request, res: Response) => {
    try {
      const data = readDeliveryChallansData();
      const nextNumber = generateChallanNumber(data.nextChallanNumber);
      res.json({ success: true, data: { challanNumber: nextNumber } });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get next challan number" });
    }
  });

  app.get("/api/delivery-challans", (req: Request, res: Response) => {
    try {
      const data = readDeliveryChallansData();
      const challans = data.deliveryChallans.map((challan: any) => ({
        id: challan.id,
        challanNumber: challan.challanNumber,
        referenceNumber: challan.referenceNumber,
        customerName: challan.customerName,
        customerId: challan.customerId,
        date: challan.date,
        amount: challan.total,
        status: challan.status,
        invoiceStatus: challan.invoiceStatus || '',
        challanType: challan.challanType
      }));
      res.json({ success: true, data: challans });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch delivery challans" });
    }
  });

  app.get("/api/delivery-challans/:id", (req: Request, res: Response) => {
    try {
      const data = readDeliveryChallansData();
      const challan = data.deliveryChallans.find((c: any) => c.id === req.params.id);
      if (!challan) {
        return res.status(404).json({ success: false, message: "Delivery challan not found" });
      }
      res.json({ success: true, data: challan });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch delivery challan" });
    }
  });

  app.post("/api/delivery-challans", (req: Request, res: Response) => {
    try {
      const data = readDeliveryChallansData();
      const challanNumber = generateChallanNumber(data.nextChallanNumber);
      const now = new Date().toISOString();

      const newChallan = {
        id: String(Date.now()),
        challanNumber,
        referenceNumber: req.body.referenceNumber || '',
        date: req.body.date,
        customerId: req.body.customerId,
        customerName: req.body.customerName,
        challanType: req.body.challanType,
        billingAddress: req.body.billingAddress || {},
        shippingAddress: req.body.shippingAddress || {},
        placeOfSupply: req.body.placeOfSupply || '',
        gstin: req.body.gstin || '',
        items: req.body.items || [],
        subTotal: req.body.subTotal || 0,
        cgst: req.body.cgst || 0,
        sgst: req.body.sgst || 0,
        igst: req.body.igst || 0,
        adjustment: req.body.adjustment || 0,
        total: req.body.total || 0,
        customerNotes: req.body.customerNotes || '',
        termsAndConditions: req.body.termsAndConditions || '',
        status: req.body.status || 'DRAFT',
        invoiceStatus: '',
        invoiceId: null,
        createdAt: now,
        updatedAt: now,
        activityLogs: [{
          id: '1',
          timestamp: now,
          action: 'created',
          description: `Delivery challan ${challanNumber} created`,
          user: req.body.createdBy || 'Admin User'
        }]
      };

      data.deliveryChallans.push(newChallan);
      data.nextChallanNumber += 1;
      writeDeliveryChallansData(data);

      res.status(201).json({ success: true, data: newChallan });
    } catch (error) {
      console.error('Error creating delivery challan:', error);
      res.status(500).json({ success: false, message: "Failed to create delivery challan" });
    }
  });

  app.put("/api/delivery-challans/:id", (req: Request, res: Response) => {
    try {
      const data = readDeliveryChallansData();
      const index = data.deliveryChallans.findIndex((c: any) => c.id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ success: false, message: "Delivery challan not found" });
      }

      const existingChallan = data.deliveryChallans[index];
      const now = new Date().toISOString();

      const updatedChallan = {
        ...existingChallan,
        ...req.body,
        id: existingChallan.id,
        challanNumber: existingChallan.challanNumber,
        updatedAt: now,
        activityLogs: [
          ...existingChallan.activityLogs,
          {
            id: String(existingChallan.activityLogs.length + 1),
            timestamp: now,
            action: 'updated',
            description: 'Delivery challan updated',
            user: req.body.updatedBy || 'Admin User'
          }
        ]
      };

      data.deliveryChallans[index] = updatedChallan;
      writeDeliveryChallansData(data);

      res.json({ success: true, data: updatedChallan });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update delivery challan" });
    }
  });

  app.delete("/api/delivery-challans/:id", (req: Request, res: Response) => {
    try {
      const data = readDeliveryChallansData();
      const index = data.deliveryChallans.findIndex((c: any) => c.id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ success: false, message: "Delivery challan not found" });
      }

      data.deliveryChallans.splice(index, 1);
      writeDeliveryChallansData(data);

      res.json({ success: true, message: "Delivery challan deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete delivery challan" });
    }
  });

  app.post("/api/delivery-challans/:id/convert-to-invoice", (req: Request, res: Response) => {
    try {
      const challansData = readDeliveryChallansData();
      const challanIndex = challansData.deliveryChallans.findIndex((c: any) => c.id === req.params.id);

      if (challanIndex === -1) {
        return res.status(404).json({ success: false, message: "Delivery challan not found" });
      }

      const challan = challansData.deliveryChallans[challanIndex];
      const invoicesData = readInvoicesData();
      const invoiceNumber = generateInvoiceNumber(invoicesData.nextInvoiceNumber);
      const now = new Date().toISOString();

      const newInvoice = {
        id: String(Date.now()),
        invoiceNumber,
        referenceNumber: challan.challanNumber,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        customerId: challan.customerId,
        customerName: challan.customerName,
        billingAddress: challan.billingAddress,
        shippingAddress: challan.shippingAddress,
        salesperson: '',
        placeOfSupply: challan.placeOfSupply,
        paymentTerms: 'Net 30',
        items: challan.items,
        subTotal: challan.subTotal,
        shippingCharges: 0,
        cgst: challan.cgst,
        sgst: challan.sgst,
        igst: challan.igst,
        adjustment: challan.adjustment,
        total: challan.total,
        amountPaid: 0,
        balanceDue: challan.total,
        customerNotes: challan.customerNotes,
        termsAndConditions: challan.termsAndConditions,
        status: 'PENDING',
        sourceType: 'delivery_challan',
        sourceId: challan.id,
        sourceNumber: challan.challanNumber,
        createdAt: now,
        updatedAt: now,
        activityLogs: [{
          id: '1',
          timestamp: now,
          action: 'created',
          description: `Invoice ${invoiceNumber} created from delivery challan ${challan.challanNumber}`,
          user: req.body.createdBy || 'Admin User'
        }]
      };

      invoicesData.invoices.push(newInvoice);
      invoicesData.nextInvoiceNumber += 1;
      writeInvoicesData(invoicesData);

      challan.invoiceStatus = 'INVOICED';
      challan.invoiceId = newInvoice.id;
      challan.updatedAt = now;
      challan.activityLogs.push({
        id: String(challan.activityLogs.length + 1),
        timestamp: now,
        action: 'converted',
        description: `Converted to invoice ${invoiceNumber}`,
        user: req.body.createdBy || 'Admin User'
      });

      challansData.deliveryChallans[challanIndex] = challan;
      writeDeliveryChallansData(challansData);

      res.json({ success: true, data: { challan, invoice: newInvoice } });
    } catch (error) {
      console.error('Error converting to invoice:', error);
      res.status(500).json({ success: false, message: "Failed to convert to invoice" });
    }
  });

  app.patch("/api/delivery-challans/:id/status", (req: Request, res: Response) => {
    try {
      const challansData = readDeliveryChallansData();
      const challanIndex = challansData.deliveryChallans.findIndex((c: any) => c.id === req.params.id);
      
      if (challanIndex === -1) {
        return res.status(404).json({ success: false, message: "Delivery challan not found" });
      }

      const challan = challansData.deliveryChallans[challanIndex];
      const now = new Date().toISOString();
      
      challan.status = req.body.status;
      challan.updatedAt = now;
      
      if (!challan.activityLogs) challan.activityLogs = [];
      challan.activityLogs.push({
        id: String(challan.activityLogs.length + 1),
        timestamp: now,
        action: 'status_changed',
        description: `Status changed to ${req.body.status}`,
        user: req.body.user || 'Admin User'
      });

      challansData.deliveryChallans[challanIndex] = challan;
      writeDeliveryChallansData(challansData);

      res.json({ success: true, data: challan });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update status" });
    }
  });

  app.post("/api/delivery-challans/:id/clone", (req: Request, res: Response) => {
    try {
      const challansData = readDeliveryChallansData();
      const originalChallan = challansData.deliveryChallans.find((c: any) => c.id === req.params.id);
      
      if (!originalChallan) {
        return res.status(404).json({ success: false, message: "Delivery challan not found" });
      }

      const now = new Date().toISOString();
      const newChallanNumber = generateChallanNumber(challansData.nextChallanNumber);
      
      const clonedChallan = {
        ...originalChallan,
        id: String(Date.now()),
        challanNumber: newChallanNumber,
        status: 'DRAFT',
        invoiceStatus: null,
        invoiceId: null,
        createdAt: now,
        updatedAt: now,
        activityLogs: [{
          id: '1',
          timestamp: now,
          action: 'created',
          description: `Cloned from ${originalChallan.challanNumber}`,
          user: req.body.user || 'Admin User'
        }]
      };

      challansData.deliveryChallans.push(clonedChallan);
      challansData.nextChallanNumber += 1;
      writeDeliveryChallansData(challansData);

      res.json({ success: true, data: clonedChallan });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to clone delivery challan" });
    }
  });

  // Expenses API
  app.get("/api/expenses", (req: Request, res: Response) => {
    try {
      const data = readExpensesData();
      const sortBy = req.query.sortBy as string || 'createdTime';
      const sortOrder = req.query.sortOrder as string || 'desc';

      let expenses = [...data.expenses];

      expenses.sort((a: any, b: any) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        if (sortBy === 'amount') {
          aVal = parseFloat(aVal) || 0;
          bVal = parseFloat(bVal) || 0;
        }
        if (sortOrder === 'desc') {
          return aVal > bVal ? -1 : 1;
        }
        return aVal > bVal ? 1 : -1;
      });

      res.json({ success: true, data: expenses });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch expenses" });
    }
  });

  app.get("/api/expenses/:id", (req: Request, res: Response) => {
    try {
      const data = readExpensesData();
      const expense = data.expenses.find((e: any) => e.id === req.params.id);
      if (!expense) {
        return res.status(404).json({ success: false, message: "Expense not found" });
      }
      res.json({ success: true, data: expense });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch expense" });
    }
  });

  app.post("/api/expenses", (req: Request, res: Response) => {
    try {
      const data = readExpensesData();
      const now = new Date().toISOString();
      const expenseNumber = generateExpenseNumber(data.nextExpenseId);

      const newExpense = {
        id: String(data.nextExpenseId),
        expenseNumber,
        date: req.body.date || new Date().toISOString().split('T')[0],
        expenseAccount: req.body.expenseAccount || '',
        amount: req.body.amount || 0,
        currency: req.body.currency || 'INR',
        paidThrough: req.body.paidThrough || '',
        expenseType: req.body.expenseType || 'services',
        sac: req.body.sac || '',
        vendorId: req.body.vendorId || '',
        vendorName: req.body.vendorName || '',
        gstTreatment: req.body.gstTreatment || '',
        sourceOfSupply: req.body.sourceOfSupply || '',
        destinationOfSupply: req.body.destinationOfSupply || '',
        reverseCharge: req.body.reverseCharge || false,
        tax: req.body.tax || '',
        taxAmount: req.body.taxAmount || 0,
        amountIs: req.body.amountIs || 'tax_exclusive',
        invoiceNumber: req.body.invoiceNumber || '',
        notes: req.body.notes || '',
        customerId: req.body.customerId || '',
        customerName: req.body.customerName || '',
        reportingTags: req.body.reportingTags || [],
        isBillable: req.body.isBillable || false,
        status: req.body.status || 'recorded',
        attachments: req.body.attachments || [],
        createdAt: now,
        updatedAt: now,
        createdTime: now
      };

      data.expenses.unshift(newExpense);
      data.nextExpenseId += 1;
      writeExpensesData(data);

      res.status(201).json({ success: true, data: newExpense });
    } catch (error) {
      console.error('Error creating expense:', error);
      res.status(500).json({ success: false, message: "Failed to create expense" });
    }
  });

  app.put("/api/expenses/:id", (req: Request, res: Response) => {
    try {
      const data = readExpensesData();
      const index = data.expenses.findIndex((e: any) => e.id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ success: false, message: "Expense not found" });
      }

      data.expenses[index] = {
        ...data.expenses[index],
        ...req.body,
        id: data.expenses[index].id,
        expenseNumber: data.expenses[index].expenseNumber,
        createdAt: data.expenses[index].createdAt,
        updatedAt: new Date().toISOString()
      };

      writeExpensesData(data);
      res.json({ success: true, data: data.expenses[index] });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update expense" });
    }
  });

  app.delete("/api/expenses/:id", (req: Request, res: Response) => {
    try {
      const data = readExpensesData();
      const index = data.expenses.findIndex((e: any) => e.id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ success: false, message: "Expense not found" });
      }

      data.expenses.splice(index, 1);
      writeExpensesData(data);

      res.json({ success: true, message: "Expense deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete expense" });
    }
  });

  // Mileage API
  app.get("/api/mileage", (req: Request, res: Response) => {
    try {
      const data = readExpensesData();
      res.json({ success: true, data: data.mileageRecords });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch mileage records" });
    }
  });

  app.post("/api/mileage", (req: Request, res: Response) => {
    try {
      const data = readExpensesData();
      const now = new Date().toISOString();

      const newMileage = {
        id: String(data.nextMileageId),
        date: req.body.date || new Date().toISOString().split('T')[0],
        employee: req.body.employee || '',
        calculationMethod: req.body.calculationMethod || 'distance_travelled',
        distance: req.body.distance || 0,
        unit: req.body.unit || 'km',
        startOdometer: req.body.startOdometer || 0,
        endOdometer: req.body.endOdometer || 0,
        amount: req.body.amount || 0,
        currency: req.body.currency || 'INR',
        paidThrough: req.body.paidThrough || '',
        vendorId: req.body.vendorId || '',
        vendorName: req.body.vendorName || '',
        invoiceNumber: req.body.invoiceNumber || '',
        notes: req.body.notes || '',
        customerId: req.body.customerId || '',
        customerName: req.body.customerName || '',
        reportingTags: req.body.reportingTags || [],
        status: 'recorded',
        createdAt: now,
        updatedAt: now
      };

      data.mileageRecords.unshift(newMileage);
      data.nextMileageId += 1;
      writeExpensesData(data);

      res.status(201).json({ success: true, data: newMileage });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create mileage record" });
    }
  });

  app.delete("/api/mileage/:id", (req: Request, res: Response) => {
    try {
      const data = readExpensesData();
      const index = data.mileageRecords.findIndex((m: any) => m.id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ success: false, message: "Mileage record not found" });
      }

      data.mileageRecords.splice(index, 1);
      writeExpensesData(data);

      res.json({ success: true, message: "Mileage record deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete mileage record" });
    }
  });

  // Mileage Settings API
  app.get("/api/mileage-settings", (req: Request, res: Response) => {
    try {
      const data = readExpensesData();
      res.json({ success: true, data: data.mileageSettings });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch mileage settings" });
    }
  });

  app.put("/api/mileage-settings", (req: Request, res: Response) => {
    try {
      const data = readExpensesData();
      data.mileageSettings = {
        ...data.mileageSettings,
        ...req.body
      };
      writeExpensesData(data);
      res.json({ success: true, data: data.mileageSettings });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update mileage settings" });
    }
  });

  app.post("/api/mileage-settings/rates", (req: Request, res: Response) => {
    try {
      const data = readExpensesData();
      const newRate = {
        id: String(Date.now()),
        startDate: req.body.startDate,
        rate: req.body.rate,
        currency: req.body.currency || 'INR'
      };
      data.mileageSettings.mileageRates.push(newRate);
      writeExpensesData(data);
      res.status(201).json({ success: true, data: newRate });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to add mileage rate" });
    }
  });

  app.delete("/api/mileage-settings/rates/:id", (req: Request, res: Response) => {
    try {
      const data = readExpensesData();
      const index = data.mileageSettings.mileageRates.findIndex((r: any) => r.id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ success: false, message: "Mileage rate not found" });
      }

      data.mileageSettings.mileageRates.splice(index, 1);
      writeExpensesData(data);

      res.json({ success: true, message: "Mileage rate deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete mileage rate" });
    }
  });

  // Bulk import expenses
  app.post("/api/expenses/import", (req: Request, res: Response) => {
    try {
      const data = readExpensesData();
      const importedExpenses = req.body.expenses || [];
      const now = new Date().toISOString();

      const newExpenses = importedExpenses.map((expense: any, index: number) => ({
        id: String(data.nextExpenseId + index),
        expenseNumber: generateExpenseNumber(data.nextExpenseId + index),
        ...expense,
        status: 'recorded',
        createdAt: now,
        updatedAt: now,
        createdTime: now
      }));

      data.expenses = [...newExpenses, ...data.expenses];
      data.nextExpenseId += importedExpenses.length;
      writeExpensesData(data);

      res.status(201).json({ success: true, data: newExpenses, message: `${newExpenses.length} expenses imported successfully` });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to import expenses" });
    }
  });

  // Dashboard API
  app.get("/api/dashboard", (req: Request, res: Response) => {
    try {
      const data = readDashboardData();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch dashboard data" });
    }
  });

  app.get("/api/dashboard/summary", (req: Request, res: Response) => {
    try {
      const data = readDashboardData();
      res.json({ success: true, data: data.summary });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch summary" });
    }
  });

  app.get("/api/dashboard/cash-flow", (req: Request, res: Response) => {
    try {
      const data = readDashboardData();
      res.json({ success: true, data: data.cashFlow });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch cash flow" });
    }
  });

  app.get("/api/dashboard/income-expense", (req: Request, res: Response) => {
    try {
      const data = readDashboardData();
      res.json({ success: true, data: data.incomeExpense });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch income expense" });
    }
  });

  app.get("/api/dashboard/top-expenses", (req: Request, res: Response) => {
    try {
      const data = readDashboardData();
      res.json({ success: true, data: data.topExpenses });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch top expenses" });
    }
  });

  app.put("/api/dashboard", (req: Request, res: Response) => {
    try {
      const data = req.body;
      writeDashboardData(data);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update dashboard data" });
    }
  });

  // Reports API
  app.get("/api/reports", (req: Request, res: Response) => {
    try {
      const data = readReportsData();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch reports data" });
    }
  });

  app.get("/api/reports/profit-loss", (req: Request, res: Response) => {
    try {
      const data = readReportsData();
      res.json({ success: true, data: data.profitAndLoss });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch profit and loss" });
    }
  });

  app.get("/api/reports/sales-by-customer", (req: Request, res: Response) => {
    try {
      const data = readReportsData();
      res.json({ success: true, data: data.salesByCustomer });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch sales by customer" });
    }
  });

  app.get("/api/reports/expense-breakdown", (req: Request, res: Response) => {
    try {
      const data = readReportsData();
      res.json({ success: true, data: data.expenseBreakdown });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch expense breakdown" });
    }
  });

  app.get("/api/reports/tax-summary", (req: Request, res: Response) => {
    try {
      const data = readReportsData();
      res.json({ success: true, data: data.taxSummary });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch tax summary" });
    }
  });

  app.get("/api/reports/receivables-aging", (req: Request, res: Response) => {
    try {
      const data = readReportsData();
      res.json({ success: true, data: data.receivablesAging });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch receivables aging" });
    }
  });

  app.get("/api/reports/payables-aging", (req: Request, res: Response) => {
    try {
      const data = readReportsData();
      res.json({ success: true, data: data.payablesAging });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch payables aging" });
    }
  });

  app.put("/api/reports", (req: Request, res: Response) => {
    try {
      const data = req.body;
      writeReportsData(data);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update reports data" });
    }
  });

  // Purchase Orders API
  app.get("/api/purchase-orders/next-number", (req: Request, res: Response) => {
    try {
      const data = readPurchaseOrdersData();
      const nextNumber = generatePurchaseOrderNumber(data.nextPurchaseOrderNumber);
      res.json({ success: true, data: { purchaseOrderNumber: nextNumber } });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get next purchase order number" });
    }
  });

  app.get("/api/purchase-orders", (req: Request, res: Response) => {
    try {
      const data = readPurchaseOrdersData();
      res.json({ success: true, data: data.purchaseOrders });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch purchase orders" });
    }
  });

  app.get("/api/purchase-orders/:id", (req: Request, res: Response) => {
    try {
      const data = readPurchaseOrdersData();
      const purchaseOrder = data.purchaseOrders.find((po: any) => po.id === req.params.id);
      if (!purchaseOrder) {
        return res.status(404).json({ success: false, message: "Purchase order not found" });
      }
      res.json({ success: true, data: purchaseOrder });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch purchase order" });
    }
  });

  app.post("/api/purchase-orders", (req: Request, res: Response) => {
    try {
      const data = readPurchaseOrdersData();
      const purchaseOrderNumber = generatePurchaseOrderNumber(data.nextPurchaseOrderNumber);
      const now = new Date().toISOString();

      const newPurchaseOrder = {
        id: String(Date.now()),
        purchaseOrderNumber,
        referenceNumber: req.body.referenceNumber || '',
        date: req.body.date || new Date().toISOString().split('T')[0],
        deliveryDate: req.body.deliveryDate || '',
        vendorId: req.body.vendorId || '',
        vendorName: req.body.vendorName || '',
        vendorAddress: req.body.vendorAddress || {},
        deliveryAddress: req.body.deliveryAddress || {},
        deliveryAddressType: req.body.deliveryAddressType || 'organization',
        paymentTerms: req.body.paymentTerms || 'Due on Receipt',
        shipmentPreference: req.body.shipmentPreference || '',
        reverseCharge: req.body.reverseCharge || false,
        items: req.body.items || [],
        subTotal: req.body.subTotal || 0,
        discountType: req.body.discountType || 'percent',
        discountValue: req.body.discountValue || 0,
        discountAmount: req.body.discountAmount || 0,
        taxType: req.body.taxType || 'TDS',
        taxCategory: req.body.taxCategory || '',
        taxAmount: req.body.taxAmount || 0,
        adjustment: req.body.adjustment || 0,
        adjustmentDescription: req.body.adjustmentDescription || '',
        total: req.body.total || 0,
        notes: req.body.notes || '',
        termsAndConditions: req.body.termsAndConditions || '',
        attachments: req.body.attachments || [],
        status: req.body.status || 'ISSUED',
        receiveStatus: req.body.receiveStatus || 'YET TO BE RECEIVED',
        billedStatus: req.body.billedStatus || 'YET TO BE BILLED',
        pdfTemplate: req.body.pdfTemplate || 'Standard Template',
        createdAt: now,
        updatedAt: now,
        createdBy: req.body.createdBy || 'Admin User',
        activityLogs: [
          {
            id: '1',
            timestamp: now,
            action: 'created',
            description: `Purchase Order created for ₹${req.body.total?.toLocaleString('en-IN') || '0.00'}`,
            user: req.body.createdBy || 'Admin User'
          }
        ]
      };

      data.purchaseOrders.unshift(newPurchaseOrder);
      data.nextPurchaseOrderNumber += 1;
      writePurchaseOrdersData(data);

      res.status(201).json({ success: true, data: newPurchaseOrder });
    } catch (error) {
      console.error('Error creating purchase order:', error);
      res.status(500).json({ success: false, message: 'Failed to create purchase order' });
    }
  });

  app.put("/api/purchase-orders/:id", (req: Request, res: Response) => {
    try {
      const data = readPurchaseOrdersData();
      const poIndex = data.purchaseOrders.findIndex((po: any) => po.id === req.params.id);

      if (poIndex === -1) {
        return res.status(404).json({ success: false, message: 'Purchase order not found' });
      }

      const now = new Date().toISOString();
      const existingPO = data.purchaseOrders[poIndex];

      const updatedPO = {
        ...existingPO,
        ...req.body,
        id: existingPO.id,
        purchaseOrderNumber: existingPO.purchaseOrderNumber,
        createdAt: existingPO.createdAt,
        updatedAt: now,
        activityLogs: [
          ...existingPO.activityLogs,
          {
            id: String(existingPO.activityLogs.length + 1),
            timestamp: now,
            action: 'updated',
            description: 'Purchase Order has been updated',
            user: req.body.updatedBy || 'Admin User'
          }
        ]
      };

      data.purchaseOrders[poIndex] = updatedPO;
      writePurchaseOrdersData(data);

      res.json({ success: true, data: updatedPO });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update purchase order' });
    }
  });

  app.patch("/api/purchase-orders/:id/status", (req: Request, res: Response) => {
    try {
      const data = readPurchaseOrdersData();
      const poIndex = data.purchaseOrders.findIndex((po: any) => po.id === req.params.id);

      if (poIndex === -1) {
        return res.status(404).json({ success: false, message: 'Purchase order not found' });
      }

      const now = new Date().toISOString();
      const existingPO = data.purchaseOrders[poIndex];
      const newStatus = req.body.status;

      let actionDescription = `Status changed to ${newStatus}`;
      if (newStatus === 'ISSUED') actionDescription = 'Purchase Order has been issued';
      if (newStatus === 'CLOSED') actionDescription = 'Purchase Order has been closed';
      if (newStatus === 'CANCELLED') actionDescription = 'Purchase Order has been cancelled';

      existingPO.status = newStatus;
      existingPO.updatedAt = now;
      existingPO.activityLogs.push({
        id: String(existingPO.activityLogs.length + 1),
        timestamp: now,
        action: newStatus.toLowerCase(),
        description: actionDescription,
        user: req.body.updatedBy || 'Admin User'
      });

      data.purchaseOrders[poIndex] = existingPO;
      writePurchaseOrdersData(data);

      res.json({ success: true, data: existingPO });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update purchase order status' });
    }
  });

  app.post("/api/purchase-orders/:id/convert-to-bill", (req: Request, res: Response) => {
    try {
      const data = readPurchaseOrdersData();
      const poIndex = data.purchaseOrders.findIndex((po: any) => po.id === req.params.id);

      if (poIndex === -1) {
        return res.status(404).json({ success: false, message: 'Purchase order not found' });
      }

      const now = new Date().toISOString();
      const purchaseOrder = data.purchaseOrders[poIndex];

      purchaseOrder.billedStatus = 'BILLED';
      purchaseOrder.updatedAt = now;
      purchaseOrder.activityLogs.push({
        id: String(purchaseOrder.activityLogs.length + 1),
        timestamp: now,
        action: 'converted_to_bill',
        description: 'Purchase Order converted to Bill',
        user: req.body.convertedBy || 'Admin User'
      });

      data.purchaseOrders[poIndex] = purchaseOrder;
      writePurchaseOrdersData(data);

      res.json({ success: true, data: purchaseOrder, message: 'Purchase Order converted to Bill' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to convert to bill' });
    }
  });

  app.delete("/api/purchase-orders/:id", (req: Request, res: Response) => {
    try {
      const data = readPurchaseOrdersData();
      const poIndex = data.purchaseOrders.findIndex((po: any) => po.id === req.params.id);

      if (poIndex === -1) {
        return res.status(404).json({ success: false, message: 'Purchase order not found' });
      }

      data.purchaseOrders.splice(poIndex, 1);
      writePurchaseOrdersData(data);

      res.json({ success: true, message: 'Purchase order deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete purchase order' });
    }
  });

  // Bills API
  app.get("/api/bills/next-number", (req: Request, res: Response) => {
    try {
      const data = readBillsData();
      const nextNumber = generateBillNumber(data.nextBillNumber);
      res.json({ success: true, data: { billNumber: nextNumber } });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get next bill number" });
    }
  });

  app.get("/api/bills/accounts", (req: Request, res: Response) => {
    try {
      const data = readBillsData();
      res.json({ success: true, data: data.accounts || [] });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch accounts" });
    }
  });

  app.get("/api/bills/taxes", (req: Request, res: Response) => {
    try {
      const data = readBillsData();
      res.json({ success: true, data: data.taxes || [] });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch taxes" });
    }
  });

  app.get("/api/bills", (req: Request, res: Response) => {
    try {
      const data = readBillsData();
      res.json({ success: true, data: data.bills });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch bills" });
    }
  });

  app.get("/api/bills/:id", (req: Request, res: Response) => {
    try {
      const data = readBillsData();
      const bill = data.bills.find((b: any) => b.id === req.params.id);
      if (!bill) {
        return res.status(404).json({ success: false, message: "Bill not found" });
      }
      res.json({ success: true, data: bill });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch bill" });
    }
  });

  app.post("/api/bills", (req: Request, res: Response) => {
    try {
      const data = readBillsData();
      const billNumber = req.body.billNumber || generateBillNumber(data.nextBillNumber);
      const now = new Date().toISOString();

      const newBill = {
        id: String(Date.now()),
        billNumber,
        orderNumber: req.body.orderNumber || '',
        vendorId: req.body.vendorId || '',
        vendorName: req.body.vendorName || '',
        vendorAddress: req.body.vendorAddress || {
          street1: '',
          street2: '',
          city: '',
          state: '',
          pinCode: '',
          country: 'India',
          gstin: ''
        },
        billDate: req.body.billDate || new Date().toISOString().split('T')[0],
        dueDate: req.body.dueDate || new Date().toISOString().split('T')[0],
        paymentTerms: req.body.paymentTerms || 'Due on Receipt',
        reverseCharge: req.body.reverseCharge || false,
        subject: req.body.subject || '',
        items: req.body.items || [],
        subTotal: req.body.subTotal || 0,
        discountType: req.body.discountType || 'percent',
        discountValue: req.body.discountValue || 0,
        discountAmount: req.body.discountAmount || 0,
        taxType: req.body.taxType || 'TDS',
        taxCategory: req.body.taxCategory || '',
        taxAmount: req.body.taxAmount || 0,
        adjustment: req.body.adjustment || 0,
        adjustmentDescription: req.body.adjustmentDescription || '',
        total: req.body.total || 0,
        amountPaid: req.body.amountPaid || 0,
        balanceDue: req.body.balanceDue || req.body.total || 0,
        notes: req.body.notes || '',
        attachments: req.body.attachments || [],
        status: req.body.status || 'OPEN',
        pdfTemplate: req.body.pdfTemplate || 'Standard Template',
        journalEntries: req.body.journalEntries || [],
        createdAt: now,
        updatedAt: now,
        createdBy: req.body.createdBy || 'Admin User',
        activityLogs: [
          {
            id: '1',
            timestamp: now,
            action: 'created',
            description: `Bill created for ₹${req.body.total?.toLocaleString('en-IN') || '0.00'}`,
            user: req.body.createdBy || 'Admin User'
          }
        ]
      };

      data.bills.unshift(newBill);
      data.nextBillNumber += 1;
      writeBillsData(data);

      res.status(201).json({ success: true, data: newBill });
    } catch (error) {
      console.error('Error creating bill:', error);
      res.status(500).json({ success: false, message: 'Failed to create bill' });
    }
  });

  app.put("/api/bills/:id", (req: Request, res: Response) => {
    try {
      const data = readBillsData();
      const billIndex = data.bills.findIndex((b: any) => b.id === req.params.id);

      if (billIndex === -1) {
        return res.status(404).json({ success: false, message: 'Bill not found' });
      }

      const now = new Date().toISOString();
      const existingBill = data.bills[billIndex];

      const updatedBill = {
        ...existingBill,
        ...req.body,
        id: existingBill.id,
        billNumber: existingBill.billNumber,
        createdAt: existingBill.createdAt,
        updatedAt: now,
        activityLogs: [
          ...(existingBill.activityLogs || []),
          {
            id: String((existingBill.activityLogs?.length || 0) + 1),
            timestamp: now,
            action: 'updated',
            description: 'Bill has been updated',
            user: req.body.updatedBy || 'Admin User'
          }
        ]
      };

      data.bills[billIndex] = updatedBill;
      writeBillsData(data);

      res.json({ success: true, data: updatedBill });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update bill' });
    }
  });

  app.patch("/api/bills/:id/status", (req: Request, res: Response) => {
    try {
      const data = readBillsData();
      const billIndex = data.bills.findIndex((b: any) => b.id === req.params.id);

      if (billIndex === -1) {
        return res.status(404).json({ success: false, message: 'Bill not found' });
      }

      const now = new Date().toISOString();
      const existingBill = data.bills[billIndex];
      const newStatus = req.body.status;

      let actionDescription = `Status changed to ${newStatus}`;
      if (newStatus === 'PAID') actionDescription = 'Bill has been paid';
      if (newStatus === 'OVERDUE') actionDescription = 'Bill is overdue';
      if (newStatus === 'VOID') actionDescription = 'Bill has been voided';

      existingBill.status = newStatus;
      existingBill.updatedAt = now;
      if (newStatus === 'PAID') {
        existingBill.amountPaid = existingBill.total;
        existingBill.balanceDue = 0;
      }
      existingBill.activityLogs = existingBill.activityLogs || [];
      existingBill.activityLogs.push({
        id: String(existingBill.activityLogs.length + 1),
        timestamp: now,
        action: newStatus.toLowerCase(),
        description: actionDescription,
        user: req.body.updatedBy || 'Admin User'
      });

      data.bills[billIndex] = existingBill;
      writeBillsData(data);

      res.json({ success: true, data: existingBill });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update bill status' });
    }
  });

  app.post("/api/bills/:id/record-payment", (req: Request, res: Response) => {
    try {
      const data = readBillsData();
      const billIndex = data.bills.findIndex((b: any) => b.id === req.params.id);

      if (billIndex === -1) {
        return res.status(404).json({ success: false, message: 'Bill not found' });
      }

      const now = new Date().toISOString();
      const bill = data.bills[billIndex];
      const paymentAmount = req.body.amount || 0;

      bill.amountPaid = (bill.amountPaid || 0) + paymentAmount;
      bill.balanceDue = bill.total - bill.amountPaid;
      bill.status = bill.balanceDue <= 0 ? 'PAID' : 'PARTIALLY_PAID';
      bill.updatedAt = now;
      bill.activityLogs = bill.activityLogs || [];
      bill.activityLogs.push({
        id: String(bill.activityLogs.length + 1),
        timestamp: now,
        action: 'payment',
        description: `Payment of ₹${paymentAmount.toLocaleString('en-IN')} recorded`,
        user: req.body.recordedBy || 'Admin User'
      });

      data.bills[billIndex] = bill;
      writeBillsData(data);

      res.json({ success: true, data: bill });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to record payment' });
    }
  });

  app.delete("/api/bills/:id", (req: Request, res: Response) => {
    try {
      const data = readBillsData();
      const billIndex = data.bills.findIndex((b: any) => b.id === req.params.id);

      if (billIndex === -1) {
        return res.status(404).json({ success: false, message: 'Bill not found' });
      }

      data.bills.splice(billIndex, 1);
      writeBillsData(data);

      res.json({ success: true, message: 'Bill deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete bill' });
    }
  });

  // Credit Notes API
  app.get("/api/credit-notes", (_req: Request, res: Response) => {
    try {
      const data = readCreditNotesData();
      res.json({ success: true, data: data.creditNotes });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch credit notes" });
    }
  });

  app.get("/api/credit-notes/next-number", (_req: Request, res: Response) => {
    try {
      const data = readCreditNotesData();
      const nextNumber = generateCreditNoteNumber(data.nextCreditNoteNumber || 1);
      res.json({ success: true, data: nextNumber });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get next credit note number" });
    }
  });

  app.get("/api/credit-notes/:id", (req: Request, res: Response) => {
    try {
      const data = readCreditNotesData();
      const creditNote = data.creditNotes.find((cn: any) => cn.id === req.params.id);
      if (!creditNote) {
        return res.status(404).json({ success: false, message: "Credit note not found" });
      }
      res.json({ success: true, data: creditNote });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch credit note" });
    }
  });

  app.post("/api/credit-notes", (req: Request, res: Response) => {
    try {
      const data = readCreditNotesData();
      const now = new Date().toISOString();
      const creditNoteNumber = generateCreditNoteNumber(data.nextCreditNoteNumber || 1);

      const newCreditNote = {
        id: String(Date.now()),
        creditNoteNumber,
        referenceNumber: req.body.referenceNumber || "",
        date: req.body.date || new Date().toISOString().split('T')[0],
        customerId: req.body.customerId || "",
        customerName: req.body.customerName || "",
        invoiceId: req.body.invoiceId || "",
        invoiceNumber: req.body.invoiceNumber || "",
        reason: req.body.reason || "",
        salesperson: req.body.salesperson || "",
        subject: req.body.subject || "",
        billingAddress: req.body.billingAddress || { street: "", city: "", state: "", country: "India", pincode: "" },
        gstin: req.body.gstin || "",
        placeOfSupply: req.body.placeOfSupply || "",
        items: req.body.items || [],
        subTotal: req.body.subTotal || 0,
        shippingCharges: req.body.shippingCharges || 0,
        tdsType: req.body.tdsType || "",
        tdsAmount: req.body.tdsAmount || 0,
        cgst: req.body.cgst || 0,
        sgst: req.body.sgst || 0,
        igst: req.body.igst || 0,
        adjustment: req.body.adjustment || 0,
        total: req.body.total || 0,
        creditsRemaining: req.body.total || 0,
        customerNotes: req.body.customerNotes || "",
        termsAndConditions: req.body.termsAndConditions || "",
        status: req.body.status || "OPEN",
        pdfTemplate: req.body.pdfTemplate || "Standard Template",
        createdAt: now,
        updatedAt: now,
        createdBy: req.body.createdBy || "Admin User",
        activityLogs: [
          {
            id: "1",
            timestamp: now,
            action: "created",
            description: `Credit Note created for ₹${(req.body.total || 0).toLocaleString('en-IN')}`,
            user: req.body.createdBy || "Admin User"
          }
        ]
      };

      data.creditNotes.unshift(newCreditNote);
      data.nextCreditNoteNumber = (data.nextCreditNoteNumber || 1) + 1;
      writeCreditNotesData(data);

      res.json({ success: true, data: newCreditNote });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create credit note" });
    }
  });

  app.put("/api/credit-notes/:id", (req: Request, res: Response) => {
    try {
      const data = readCreditNotesData();
      const index = data.creditNotes.findIndex((cn: any) => cn.id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ success: false, message: "Credit note not found" });
      }

      const now = new Date().toISOString();
      const existingCreditNote = data.creditNotes[index];

      const updatedCreditNote = {
        ...existingCreditNote,
        ...req.body,
        id: existingCreditNote.id,
        creditNoteNumber: existingCreditNote.creditNoteNumber,
        createdAt: existingCreditNote.createdAt,
        updatedAt: now
      };

      updatedCreditNote.activityLogs = existingCreditNote.activityLogs || [];
      updatedCreditNote.activityLogs.push({
        id: String(updatedCreditNote.activityLogs.length + 1),
        timestamp: now,
        action: "updated",
        description: "Credit Note has been updated",
        user: req.body.updatedBy || "Admin User"
      });

      data.creditNotes[index] = updatedCreditNote;
      writeCreditNotesData(data);

      res.json({ success: true, data: updatedCreditNote });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update credit note" });
    }
  });

  app.patch("/api/credit-notes/:id/status", (req: Request, res: Response) => {
    try {
      const data = readCreditNotesData();
      const index = data.creditNotes.findIndex((cn: any) => cn.id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ success: false, message: "Credit note not found" });
      }

      const now = new Date().toISOString();
      const creditNote = data.creditNotes[index];
      const newStatus = req.body.status;

      let actionDescription = `Status changed to ${newStatus}`;
      if (newStatus === 'CLOSED') actionDescription = 'Credit Note has been closed';
      if (newStatus === 'VOID') actionDescription = 'Credit Note has been voided';

      creditNote.status = newStatus;
      creditNote.updatedAt = now;
      creditNote.activityLogs = creditNote.activityLogs || [];
      creditNote.activityLogs.push({
        id: String(creditNote.activityLogs.length + 1),
        timestamp: now,
        action: newStatus.toLowerCase(),
        description: actionDescription,
        user: req.body.updatedBy || "Admin User"
      });

      data.creditNotes[index] = creditNote;
      writeCreditNotesData(data);

      res.json({ success: true, data: creditNote });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update credit note status" });
    }
  });

  app.delete("/api/credit-notes/:id", (req: Request, res: Response) => {
    try {
      const data = readCreditNotesData();
      const index = data.creditNotes.findIndex((cn: any) => cn.id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ success: false, message: "Credit note not found" });
      }

      data.creditNotes.splice(index, 1);
      writeCreditNotesData(data);

      res.json({ success: true, message: "Credit note deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete credit note" });
    }
  });

  // Salespersons API
  app.get("/api/salespersons", (_req, res) => {
    try {
      const data = readSalespersonsData();
      res.json({ success: true, data: data.salespersons });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch salespersons" });
    }
  });

  app.post("/api/salespersons", (req, res) => {
    try {
      const data = readSalespersonsData();
      const newSalesperson = {
        id: String(data.nextSalespersonId++),
        ...req.body,
        createdAt: new Date().toISOString()
      };

      data.salespersons.push(newSalesperson);
      writeSalespersonsData(data);

      res.json({ success: true, data: newSalesperson });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create salesperson" });
    }
  });

  app.delete("/api/salespersons/:id", (req, res) => {
    try {
      const data = readSalespersonsData();
      const index = data.salespersons.findIndex((s: any) => s.id === req.params.id);

      if (index !== -1) {
        data.salespersons.splice(index, 1);
        writeSalespersonsData(data);
        res.json({ success: true, message: "Salesperson deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Salesperson not found" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete salesperson" });
    }
  });

  // Payments Received API
  app.get("/api/payments-received", (_req: Request, res: Response) => {
    try {
      const data = readPaymentsReceivedData();
      res.json({ success: true, data: data.paymentsReceived });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch payments received" });
    }
  });

  app.get("/api/payments-received/:id", (req: Request, res: Response) => {
    try {
      const data = readPaymentsReceivedData();
      const payment = data.paymentsReceived.find((p: any) => p.id === req.params.id);
      
      if (!payment) {
        return res.status(404).json({ success: false, message: "Payment not found" });
      }
      
      res.json({ success: true, data: payment });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch payment" });
    }
  });

  app.post("/api/payments-received", (req: Request, res: Response) => {
    try {
      const data = readPaymentsReceivedData();
      const now = new Date().toISOString();
      const paymentNumber = generatePaymentNumber(data.nextPaymentNumber);
      
      const newPayment = {
        id: `pr-${Date.now()}`,
        paymentNumber,
        ...req.body,
        amountInWords: numberToWords(req.body.amount || 0),
        createdAt: now,
        status: req.body.status || 'PAID'
      };

      data.paymentsReceived.push(newPayment);
      data.nextPaymentNumber++;
      writePaymentsReceivedData(data);

      res.json({ success: true, data: newPayment });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create payment" });
    }
  });

  app.put("/api/payments-received/:id", (req: Request, res: Response) => {
    try {
      const data = readPaymentsReceivedData();
      const index = data.paymentsReceived.findIndex((p: any) => p.id === req.params.id);
      
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Payment not found" });
      }

      const updatedPayment = {
        ...data.paymentsReceived[index],
        ...req.body,
        amountInWords: numberToWords(req.body.amount || data.paymentsReceived[index].amount),
        updatedAt: new Date().toISOString()
      };

      data.paymentsReceived[index] = updatedPayment;
      writePaymentsReceivedData(data);

      res.json({ success: true, data: updatedPayment });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update payment" });
    }
  });

  app.delete("/api/payments-received/:id", (req: Request, res: Response) => {
    try {
      const data = readPaymentsReceivedData();
      const index = data.paymentsReceived.findIndex((p: any) => p.id === req.params.id);
      
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Payment not found" });
      }

      data.paymentsReceived.splice(index, 1);
      writePaymentsReceivedData(data);

      res.json({ success: true, message: "Payment deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete payment" });
    }
  });

  app.patch("/api/payments-received/:id/refund", (req: Request, res: Response) => {
    try {
      const data = readPaymentsReceivedData();
      const index = data.paymentsReceived.findIndex((p: any) => p.id === req.params.id);
      
      if (index === -1) {
        return res.status(404).json({ success: false, message: "Payment not found" });
      }

      const payment = data.paymentsReceived[index];
      const refundAmount = req.body.refundAmount || payment.amount;
      const now = new Date().toISOString();
      
      payment.status = 'REFUNDED';
      payment.refundedAt = now;
      payment.refundAmount = refundAmount;
      
      data.paymentsReceived[index] = payment;
      writePaymentsReceivedData(data);

      // Also update linked invoices if any
      if (payment.invoices && payment.invoices.length > 0) {
        const invoicesData = readInvoicesData();
        
        payment.invoices.forEach((paymentInvoice: any) => {
          const invoiceIndex = invoicesData.invoices.findIndex((inv: any) => inv.id === paymentInvoice.invoiceId);
          if (invoiceIndex !== -1) {
            const invoice = invoicesData.invoices[invoiceIndex];
            
            // Initialize refunds array if not exists
            if (!invoice.refunds) {
              invoice.refunds = [];
            }
            
            // Add refund record
            invoice.refunds.push({
              id: `ref-${Date.now()}`,
              paymentId: payment.id,
              paymentNumber: payment.paymentNumber,
              amount: paymentInvoice.paymentAmount || refundAmount,
              date: now,
              reason: req.body.reason || 'Payment refunded'
            });
            
            // Update amounts
            invoice.amountRefunded = (invoice.amountRefunded || 0) + (paymentInvoice.paymentAmount || refundAmount);
            invoice.amountPaid = Math.max(0, (invoice.amountPaid || 0) - (paymentInvoice.paymentAmount || refundAmount));
            invoice.balanceDue = invoice.total - invoice.amountPaid;
            
            // Update status
            if (invoice.balanceDue >= invoice.total) {
              invoice.status = 'SENT';
            } else if (invoice.balanceDue > 0) {
              invoice.status = 'PARTIALLY_PAID';
            }
            
            invoice.updatedAt = now;
            invoice.activityLogs = invoice.activityLogs || [];
            invoice.activityLogs.push({
              id: String(invoice.activityLogs.length + 1),
              timestamp: now,
              action: 'refund_recorded',
              description: `Refund of ₹${(paymentInvoice.paymentAmount || refundAmount).toLocaleString('en-IN')} recorded from Payment #${payment.paymentNumber}`,
              user: req.body.refundedBy || 'Admin User'
            });
            
            invoicesData.invoices[invoiceIndex] = invoice;
          }
        });
        
        writeInvoicesData(invoicesData);
      }

      res.json({ success: true, data: payment });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to refund payment" });
    }
  });

  // Refund from invoice - creates refund record and updates payment
  app.post("/api/invoices/:id/refund", (req: Request, res: Response) => {
    try {
      const invoicesData = readInvoicesData();
      const invoiceIndex = invoicesData.invoices.findIndex((i: any) => i.id === req.params.id);

      if (invoiceIndex === -1) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
      }

      const invoice = invoicesData.invoices[invoiceIndex];
      const refundAmount = req.body.amount || 0;
      const now = new Date().toISOString();

      // Validate refund amount
      if (refundAmount <= 0) {
        return res.status(400).json({ success: false, message: 'Refund amount must be greater than 0' });
      }

      if (refundAmount > (invoice.amountPaid || 0)) {
        return res.status(400).json({ success: false, message: 'Refund amount cannot exceed amount paid' });
      }

      // Initialize refunds array if not exists
      if (!invoice.refunds) {
        invoice.refunds = [];
      }

      // Add refund record
      const refundId = `ref-${Date.now()}`;
      invoice.refunds.push({
        id: refundId,
        paymentId: req.body.paymentId || null,
        paymentNumber: req.body.paymentNumber || null,
        amount: refundAmount,
        date: now,
        reason: req.body.reason || 'Refund processed',
        mode: req.body.mode || 'Cash'
      });

      // Update amounts
      invoice.amountRefunded = (invoice.amountRefunded || 0) + refundAmount;
      invoice.amountPaid = Math.max(0, (invoice.amountPaid || 0) - refundAmount);
      invoice.balanceDue = invoice.total - invoice.amountPaid;

      // Update status
      if (invoice.balanceDue >= invoice.total) {
        invoice.status = 'SENT';
      } else if (invoice.balanceDue > 0) {
        invoice.status = 'PARTIALLY_PAID';
      }

      invoice.updatedAt = now;
      invoice.activityLogs = invoice.activityLogs || [];
      invoice.activityLogs.push({
        id: String(invoice.activityLogs.length + 1),
        timestamp: now,
        action: 'refund_recorded',
        description: `Refund of ₹${refundAmount.toLocaleString('en-IN')} processed`,
        user: req.body.refundedBy || 'Admin User'
      });

      invoicesData.invoices[invoiceIndex] = invoice;
      writeInvoicesData(invoicesData);

      // Also update linked payment if paymentId is provided
      if (req.body.paymentId) {
        const paymentsData = readPaymentsReceivedData();
        const paymentIndex = paymentsData.paymentsReceived.findIndex((p: any) => p.id === req.body.paymentId);
        
        if (paymentIndex !== -1) {
          const payment = paymentsData.paymentsReceived[paymentIndex];
          payment.status = 'REFUNDED';
          payment.refundedAt = now;
          payment.refundAmount = (payment.refundAmount || 0) + refundAmount;
          
          paymentsData.paymentsReceived[paymentIndex] = payment;
          writePaymentsReceivedData(paymentsData);
        }
      }

      // Create a new payment record for the refund in Payments Received
      const paymentsData = readPaymentsReceivedData();
      const refundPayment = {
        id: `pr-ref-${Date.now()}`,
        paymentNumber: `REF-${generatePaymentNumber(paymentsData.nextPaymentNumber)}`,
        date: now.split('T')[0],
        referenceNumber: '',
        customerId: invoice.customerId || '',
        customerName: invoice.customerName || '',
        customerEmail: invoice.customerEmail || '',
        invoices: [{
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          invoiceDate: invoice.date,
          invoiceAmount: invoice.total,
          refundAmount: refundAmount
        }],
        mode: req.body.mode || 'Cash',
        depositTo: 'Petty Cash',
        amount: -refundAmount,
        unusedAmount: 0,
        bankCharges: 0,
        tax: '',
        taxAmount: 0,
        notes: req.body.reason || `Refund for ${invoice.invoiceNumber}`,
        attachments: [],
        sendThankYou: false,
        status: 'REFUNDED',
        paymentType: 'refund',
        placeOfSupply: invoice.placeOfSupply || '',
        descriptionOfSupply: '',
        amountInWords: `Refund: ${numberToWords(refundAmount)}`,
        journalEntries: [],
        createdAt: now,
        isRefund: true,
        originalInvoiceId: invoice.id
      };

      paymentsData.paymentsReceived.push(refundPayment);
      paymentsData.nextPaymentNumber++;
      writePaymentsReceivedData(paymentsData);

      res.json({ success: true, data: invoice, refundPayment });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to process refund' });
    }
  });

  // Get unpaid invoices for a customer
  app.get("/api/customers/:customerId/unpaid-invoices", (req: Request, res: Response) => {
    try {
      const invoicesData = readInvoicesData();
      const unpaidInvoices = invoicesData.invoices.filter((inv: any) => 
        inv.customerId === req.params.customerId && 
        inv.status !== 'PAID' && 
        inv.balanceDue > 0
      );
      
      res.json({ success: true, data: unpaidInvoices });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch unpaid invoices" });
    }
  });

  // E-Way Bills Routes
  app.get("/api/eway-bills", (req: Request, res: Response) => {
    try {
      const data = readEWayBillsData();
      const { transactionType, status, period } = req.query;
      
      let filteredBills = data.ewayBills || [];
      
      if (transactionType && transactionType !== 'all') {
        filteredBills = filteredBills.filter((bill: any) => bill.documentType === transactionType);
      }
      
      if (status && status !== 'all') {
        filteredBills = filteredBills.filter((bill: any) => bill.status === status);
      }
      
      if (period && period !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
        switch (period) {
          case 'this_month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'last_month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            break;
          case 'this_year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
        }
        
        filteredBills = filteredBills.filter((bill: any) => 
          new Date(bill.date) >= startDate
        );
      }
      
      res.json({ success: true, data: filteredBills });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch e-way bills" });
    }
  });

  app.get("/api/eway-bills/next-number", (_req: Request, res: Response) => {
    try {
      const data = readEWayBillsData();
      const nextNumber = generateEWayBillNumber(data.nextEWayBillNumber);
      res.json({ success: true, data: { nextNumber } });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get next e-way bill number" });
    }
  });

  app.get("/api/eway-bills/:id", (req: Request, res: Response) => {
    try {
      const data = readEWayBillsData();
      const ewayBill = data.ewayBills.find((b: any) => b.id === req.params.id);
      
      if (!ewayBill) {
        return res.status(404).json({ success: false, message: "E-Way Bill not found" });
      }
      
      res.json({ success: true, data: ewayBill });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch e-way bill" });
    }
  });

  app.post("/api/eway-bills", (req: Request, res: Response) => {
    try {
      const data = readEWayBillsData();
      const now = new Date().toISOString();
      const ewayBillNumber = generateEWayBillNumber(data.nextEWayBillNumber);
      
      // Calculate expiry date (15 days from now for most cases)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 15);
      
      const newEWayBill = {
        id: `ewb-${Date.now()}`,
        ewayBillNumber,
        documentType: req.body.documentType || 'invoices',
        transactionSubType: req.body.transactionSubType || 'supply',
        customerId: req.body.customerId,
        customerName: req.body.customerName,
        customerGstin: req.body.customerGstin || '',
        documentNumber: req.body.documentNumber,
        documentId: req.body.documentId,
        date: req.body.date || now.split('T')[0],
        expiryDate: expiryDate.toISOString().split('T')[0],
        transactionType: req.body.transactionType || 'regular',
        dispatchFrom: req.body.dispatchFrom || {},
        billFrom: req.body.billFrom || {},
        billTo: req.body.billTo || {},
        shipTo: req.body.shipTo || {},
        placeOfDelivery: req.body.placeOfDelivery || '',
        transporter: req.body.transporter || '',
        distance: req.body.distance || 0,
        modeOfTransportation: req.body.modeOfTransportation || 'road',
        vehicleType: req.body.vehicleType || 'regular',
        vehicleNo: req.body.vehicleNo || '',
        transporterDocNo: req.body.transporterDocNo || '',
        transporterDocDate: req.body.transporterDocDate || '',
        items: req.body.items || [],
        total: req.body.total || 0,
        status: req.body.status || 'NOT_GENERATED',
        createdAt: now,
        updatedAt: now
      };

      data.ewayBills.push(newEWayBill);
      data.nextEWayBillNumber++;
      writeEWayBillsData(data);

      res.json({ success: true, data: newEWayBill });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create e-way bill" });
    }
  });

  app.put("/api/eway-bills/:id", (req: Request, res: Response) => {
    try {
      const data = readEWayBillsData();
      const index = data.ewayBills.findIndex((b: any) => b.id === req.params.id);
      
      if (index === -1) {
        return res.status(404).json({ success: false, message: "E-Way Bill not found" });
      }

      const updatedEWayBill = {
        ...data.ewayBills[index],
        ...req.body,
        updatedAt: new Date().toISOString()
      };

      data.ewayBills[index] = updatedEWayBill;
      writeEWayBillsData(data);

      res.json({ success: true, data: updatedEWayBill });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update e-way bill" });
    }
  });

  app.patch("/api/eway-bills/:id/generate", (req: Request, res: Response) => {
    try {
      const data = readEWayBillsData();
      const index = data.ewayBills.findIndex((b: any) => b.id === req.params.id);
      
      if (index === -1) {
        return res.status(404).json({ success: false, message: "E-Way Bill not found" });
      }

      const ewayBill = data.ewayBills[index];
      ewayBill.status = 'GENERATED';
      ewayBill.generatedAt = new Date().toISOString();
      
      // Set expiry date to 15 days from now
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 15);
      ewayBill.expiryDate = expiryDate.toISOString().split('T')[0];
      
      data.ewayBills[index] = ewayBill;
      writeEWayBillsData(data);

      res.json({ success: true, data: ewayBill });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to generate e-way bill" });
    }
  });

  app.patch("/api/eway-bills/:id/cancel", (req: Request, res: Response) => {
    try {
      const data = readEWayBillsData();
      const index = data.ewayBills.findIndex((b: any) => b.id === req.params.id);
      
      if (index === -1) {
        return res.status(404).json({ success: false, message: "E-Way Bill not found" });
      }

      const ewayBill = data.ewayBills[index];
      ewayBill.status = 'CANCELLED';
      ewayBill.cancelledAt = new Date().toISOString();
      ewayBill.cancelReason = req.body.reason || '';
      
      data.ewayBills[index] = ewayBill;
      writeEWayBillsData(data);

      res.json({ success: true, data: ewayBill });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to cancel e-way bill" });
    }
  });

  app.delete("/api/eway-bills/:id", (req: Request, res: Response) => {
    try {
      const data = readEWayBillsData();
      const index = data.ewayBills.findIndex((b: any) => b.id === req.params.id);
      
      if (index === -1) {
        return res.status(404).json({ success: false, message: "E-Way Bill not found" });
      }

      data.ewayBills.splice(index, 1);
      writeEWayBillsData(data);

      res.json({ success: true, message: "E-Way Bill deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete e-way bill" });
    }
  });

  // Get pending invoices for e-way bill generation
  app.get("/api/eway-bills/pending-invoices", (_req: Request, res: Response) => {
    try {
      const invoicesData = readInvoicesData();
      const ewayBillsData = readEWayBillsData();
      
      // Get invoice IDs that already have e-way bills
      const invoicesWithEWayBills = new Set(
        ewayBillsData.ewayBills
          .filter((b: any) => b.documentType === 'invoices')
          .map((b: any) => b.documentId)
      );
      
      // Filter invoices that don't have e-way bills yet
      const pendingInvoices = invoicesData.invoices.filter((inv: any) => 
        !invoicesWithEWayBills.has(inv.id) && 
        inv.status !== 'DRAFT' &&
        inv.status !== 'CANCELLED'
      );
      
      res.json({ success: true, data: pendingInvoices });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch pending invoices" });
    }
  });

  // Get pending credit notes for e-way bill generation
  app.get("/api/eway-bills/pending-credit-notes", (_req: Request, res: Response) => {
    try {
      const creditNotesData = readCreditNotesData();
      const ewayBillsData = readEWayBillsData();
      
      // Get credit note IDs that already have e-way bills
      const creditNotesWithEWayBills = new Set(
        ewayBillsData.ewayBills
          .filter((b: any) => b.documentType === 'credit_notes')
          .map((b: any) => b.documentId)
      );
      
      // Filter credit notes that don't have e-way bills yet
      const pendingCreditNotes = creditNotesData.creditNotes.filter((cn: any) => 
        !creditNotesWithEWayBills.has(cn.id) && 
        cn.status !== 'DRAFT' &&
        cn.status !== 'CANCELLED'
      );
      
      res.json({ success: true, data: pendingCreditNotes });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch pending credit notes" });
    }
  });

  // Get pending delivery challans for e-way bill generation
  app.get("/api/eway-bills/pending-delivery-challans", (_req: Request, res: Response) => {
    try {
      const deliveryChallansData = readDeliveryChallansData();
      const ewayBillsData = readEWayBillsData();
      
      // Get delivery challan IDs that already have e-way bills
      const challansWithEWayBills = new Set(
        ewayBillsData.ewayBills
          .filter((b: any) => b.documentType === 'delivery_challans')
          .map((b: any) => b.documentId)
      );
      
      // Filter delivery challans that don't have e-way bills yet
      const pendingChallans = deliveryChallansData.deliveryChallans.filter((dc: any) => 
        !challansWithEWayBills.has(dc.id) && 
        dc.status !== 'DRAFT' &&
        dc.status !== 'CANCELLED'
      );
      
      res.json({ success: true, data: pendingChallans });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch pending delivery challans" });
    }
  });

  return httpServer;
}
