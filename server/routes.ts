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

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Items API
  app.get("/api/items", (req: Request, res: Response) => {
    try {
      const items = readItems();
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const paginatedItems = items.slice(offset, offset + limit);

      res.json({
        data: paginatedItems,
        meta: {
          page,
          limit,
          total: items.length,
          totalPages: Math.ceil(items.length / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to read items" });
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

      const payment = {
        id: String(Date.now()),
        date: req.body.date || new Date().toISOString().split('T')[0],
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

      res.json({ success: true, data: existingInvoice });
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

  return httpServer;
}
