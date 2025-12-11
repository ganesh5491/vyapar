import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Plus,
  Trash2,
  Save,
  Send,
  ArrowLeft,
  Printer,
  Share2,
  Search,
  Settings,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addDays, endOfMonth, addMonths, format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ManageSalespersonsDialog } from "@/components/ManageSalespersonsDialog";

interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  rate: number;
  discount: number;
  amount: number;
}

const TERMS_OPTIONS = [
  { value: "Due on Receipt", label: "Due on Receipt", days: 0 },
  { value: "Net 15", label: "Net 15", days: 15 },
  { value: "Net 30", label: "Net 30", days: 30 },
  { value: "Net 45", label: "Net 45", days: 45 },
  { value: "Net 60", label: "Net 60", days: 60 },
];

export default function InvoiceEdit() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [customerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("Net 30");
  const [billingAddress, setBillingAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [shippingCharges, setShippingCharges] = useState(0);
  const [adjustment, setAdjustment] = useState(0);
  const [selectedSalesperson, setSelectedSalesperson] = useState("");
  const [showManageSalespersons, setShowManageSalespersons] = useState(false);
  const [salespersons, setSalespersons] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchInvoice();
    fetchSalespersons();
  }, [params.id]);

  const fetchSalespersons = async () => {
    try {
      const response = await fetch('/api/salespersons');
      if (response.ok) {
        const data = await response.json();
        setSalespersons(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch salespersons:', error);
    }
  };

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        const invoice = data.data;
        
        setInvoiceNumber(invoice.invoiceNumber);
        setDate(new Date(invoice.date));
        setDueDate(new Date(invoice.dueDate));
        setCustomerName(invoice.customerName);
        setCustomerId(invoice.customerId);
        setPaymentTerms(invoice.paymentTerms);
        setBillingAddress(invoice.billingAddress?.street || '');
        setCustomerNotes(invoice.customerNotes || '');
        setTermsAndConditions(invoice.termsAndConditions || '');
        setItems(invoice.items.map((item: any, index: number) => ({
          id: item.id || String(index + 1),
          name: item.name,
          description: item.description || '',
          quantity: item.quantity,
          rate: item.rate,
          discount: item.discount || 0,
          amount: item.amount
        })));
        setShippingCharges(invoice.shippingCharges || 0);
        setAdjustment(invoice.adjustment || 0);
        setSelectedSalesperson(invoice.salesperson || "");
      }
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      toast({
        title: "Error",
        description: "Failed to load invoice",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateLineItem = (item: InvoiceItem) => {
    const baseAmount = item.quantity * item.rate;
    const discountAmount = item.discount || 0;
    const taxableAmount = baseAmount - discountAmount;
    const taxAmount = taxableAmount * 0.18;
    return {
      baseAmount,
      discountAmount,
      taxableAmount,
      taxAmount,
      total: taxableAmount + taxAmount
    };
  };

  const totals = items.reduce((acc, item) => {
    const line = calculateLineItem(item);
    return {
      subtotal: acc.subtotal + line.taxableAmount,
      totalTax: acc.totalTax + line.taxAmount,
      grandTotal: acc.grandTotal + line.total
    };
  }, { subtotal: 0, totalTax: 0, grandTotal: 0 });

  const finalTotal = totals.grandTotal + shippingCharges + adjustment;

  const handleUpdateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    if (field === 'quantity' || field === 'rate' || field === 'discount') {
      const calc = calculateLineItem(newItems[index]);
      newItems[index].amount = calc.total;
    }
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, {
      id: String(Date.now()),
      name: '',
      description: '',
      quantity: 1,
      rate: 0,
      discount: 0,
      amount: 0
    }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const invoiceItems = items.map(item => {
        const lineCalc = calculateLineItem(item);
        return {
          id: item.id,
          itemId: item.id,
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          unit: 'pcs',
          rate: item.rate,
          discount: item.discount,
          discountType: 'flat',
          tax: lineCalc.taxAmount,
          taxName: 'GST18',
          amount: lineCalc.total
        };
      });

      const invoiceData = {
        date: format(date, 'yyyy-MM-dd'),
        dueDate: format(dueDate, 'yyyy-MM-dd'),
        customerId,
        customerName,
        billingAddress: {
          street: billingAddress,
          city: '',
          state: '',
          country: 'India',
          pincode: ''
        },
        shippingAddress: {
          street: '',
          city: '',
          state: '',
          country: 'India',
          pincode: ''
        },
        paymentTerms,
        salesperson: selectedSalesperson,
        items: invoiceItems,
        subTotal: totals.subtotal,
        shippingCharges,
        cgst: totals.totalTax / 2,
        sgst: totals.totalTax / 2,
        igst: 0,
        adjustment,
        total: finalTotal,
        customerNotes,
        termsAndConditions,
        balanceDue: finalTotal
      };

      const response = await fetch(`/api/invoices/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });

      if (response.ok) {
        toast({
          title: "Invoice Updated",
          description: `Invoice ${invoiceNumber} has been updated successfully.`,
        });
        setLocation("/invoices");
      } else {
        throw new Error('Failed to update invoice');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update invoice. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Loading invoice...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/invoices')} data-testid="button-back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Edit Invoice</h1>
            <p className="text-sm text-slate-500">{invoiceNumber}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Invoice Number</Label>
                <Input value={invoiceNumber} disabled className="bg-slate-50" data-testid="input-invoice-number" />
              </div>
              <div className="space-y-2">
                <Label>Customer</Label>
                <Input value={customerName} disabled className="bg-slate-50" data-testid="input-customer-name" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Invoice Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      data-testid="button-invoice-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Payment Terms</Label>
                <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                  <SelectTrigger data-testid="select-payment-terms">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TERMS_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                      data-testid="button-due-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "dd/MM/yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dueDate} onSelect={(d) => d && setDueDate(d)} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Salesperson</Label>
              <Select value={selectedSalesperson} onValueChange={(val) => {
                if (val === "manage_salespersons") {
                  setShowManageSalespersons(true);
                } else {
                  setSelectedSalesperson(val);
                }
              }}>
                <SelectTrigger data-testid="select-salesperson">
                  <SelectValue placeholder="Select salesperson" />
                </SelectTrigger>
                <SelectContent>
                  <div className="relative mb-2">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      className="w-full pl-8 pr-2 py-1.5 text-sm border-b bg-transparent outline-none"
                      placeholder="Search"
                    />
                  </div>
                  {salespersons.map((sp) => (
                    <SelectItem key={sp.id} value={sp.id}>{sp.name}</SelectItem>
                  ))}
                  <div
                    className="flex items-center gap-2 px-2 py-1.5 text-sm text-blue-600 cursor-pointer hover:bg-slate-100"
                    onClick={() => {
                      setShowManageSalespersons(true);
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    Manage Salespersons
                  </div>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Billing Address</Label>
              <Textarea 
                value={billingAddress} 
                onChange={(e) => setBillingAddress(e.target.value)}
                placeholder="Enter billing address"
                rows={3}
                data-testid="textarea-billing-address"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tax (18%)</span>
                <span>{formatCurrency(totals.totalTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Shipping</span>
                <span>{formatCurrency(shippingCharges)}</span>
              </div>
              {adjustment !== 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Adjustment</span>
                  <span>{formatCurrency(adjustment)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-blue-600" data-testid="text-total">{formatCurrency(finalTotal)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Line Items</CardTitle>
          <Button variant="outline" size="sm" onClick={handleAddItem} data-testid="button-add-item">
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="w-24">Qty</TableHead>
                <TableHead className="w-28">Rate</TableHead>
                <TableHead className="w-28">Discount</TableHead>
                <TableHead className="w-28 text-right">Amount</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Input
                      value={item.name}
                      onChange={(e) => handleUpdateItem(index, 'name', e.target.value)}
                      placeholder="Item name"
                      data-testid={`input-item-name-${index}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      data-testid={`input-item-qty-${index}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleUpdateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                      data-testid={`input-item-rate-${index}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.discount}
                      onChange={(e) => handleUpdateItem(index, 'discount', parseFloat(e.target.value) || 0)}
                      data-testid={`input-item-discount-${index}`}
                    />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(calculateLineItem(item).total)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)} data-testid={`button-remove-item-${index}`}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              value={customerNotes} 
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="Notes to customer..."
              rows={4}
              data-testid="textarea-customer-notes"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea 
              value={termsAndConditions} 
              onChange={(e) => setTermsAndConditions(e.target.value)}
              placeholder="Terms and conditions..."
              rows={4}
              data-testid="textarea-terms"
            />
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-card/80 backdrop-blur-md border-t border-border/60 p-4 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Button variant="ghost" onClick={() => setLocation("/invoices")} data-testid="button-cancel">
            Cancel
          </Button>
          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={saving} className="gap-2" data-testid="button-save">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
      <ManageSalespersonsDialog
        open={showManageSalespersons}
        onOpenChange={setShowManageSalespersons}
        onSalespersonChange={fetchSalespersons}
      />
    </div>
  );
}
