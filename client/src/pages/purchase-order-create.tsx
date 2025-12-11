import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Plus, X, Search, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Vendor {
  id: string;
  displayName: string;
  companyName?: string;
  billingAddress?: {
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    countryRegion?: string;
  };
  gstin?: string;
}

interface Item {
  id: string;
  name: string;
  description?: string;
  sellingPrice?: number;
  purchasePrice?: number;
  hsn?: string;
  sku?: string;
  unit?: string;
  tax?: number;
}

interface LineItem {
  id: string;
  itemId: string;
  itemName: string;
  description: string;
  account: string;
  quantity: number;
  rate: number;
  tax: string;
  taxAmount: number;
  amount: number;
}

const PAYMENT_TERMS = [
  "Due on Receipt",
  "Net 15",
  "Net 30",
  "Net 45",
  "Net 60",
  "Due end of the month",
  "Due end of next month"
];

const SHIPMENT_PREFERENCES = [
  "Standard Shipping",
  "Express Shipping",
  "Overnight Shipping",
  "Local Pickup",
  "Freight Shipping"
];

const TAX_OPTIONS = [
  { value: "none", label: "Select a Tax" },
  { value: "gst5", label: "GST 5%" },
  { value: "gst12", label: "GST 12%" },
  { value: "gst18", label: "GST 18%" },
  { value: "gst28", label: "GST 28%" },
  { value: "igst5", label: "IGST 5%" },
  { value: "igst12", label: "IGST 12%" },
  { value: "igst18", label: "IGST 18%" },
  { value: "igst28", label: "IGST 28%" }
];

const ACCOUNTS = [
  "Cost of Goods Sold",
  "Inventory Asset",
  "Purchase",
  "Raw Materials"
];

export default function PurchaseOrderCreate() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState("");

  const [formData, setFormData] = useState({
    vendorId: "",
    vendorName: "",
    deliveryAddressType: "organization",
    deliveryAddress: {
      attention: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      pinCode: "",
      countryRegion: "India"
    },
    referenceNumber: "",
    date: new Date().toISOString().split('T')[0],
    deliveryDate: "",
    paymentTerms: "Due on Receipt",
    shipmentPreference: "",
    reverseCharge: false,
    notes: "",
    termsAndConditions: "",
    discountType: "percent",
    discountValue: 0,
    taxType: "TDS",
    taxCategory: "",
    adjustment: 0,
    adjustmentDescription: ""
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: "1",
      itemId: "",
      itemName: "",
      description: "",
      account: "",
      quantity: 1,
      rate: 0,
      tax: "none",
      taxAmount: 0,
      amount: 0
    }
  ]);

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [vendorsRes, itemsRes, nextNumberRes] = await Promise.all([
        fetch('/api/vendors'),
        fetch('/api/items'),
        fetch('/api/purchase-orders/next-number')
      ]);

      if (vendorsRes.ok) {
        const data = await vendorsRes.json();
        setVendors(data.data || []);
      }

      if (itemsRes.ok) {
        const data = await itemsRes.json();
        setItems(data.data || []);
      }

      if (nextNumberRes.ok) {
        const data = await nextNumberRes.json();
        setPurchaseOrderNumber(data.data.purchaseOrderNumber);
      }
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    }
  };

  const handleVendorChange = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (vendor) {
      setSelectedVendor(vendor);
      setFormData({
        ...formData,
        vendorId: vendor.id,
        vendorName: vendor.displayName
      });
    }
  };

  const calculateLineItemAmount = (item: LineItem): number => {
    const baseAmount = item.quantity * item.rate;
    let taxAmount = 0;
    
    if (item.tax && item.tax !== 'none') {
      const taxRate = parseInt(item.tax.replace(/\D/g, '')) || 0;
      taxAmount = (baseAmount * taxRate) / 100;
    }
    
    return baseAmount + taxAmount;
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        if (field === 'quantity' || field === 'rate' || field === 'tax') {
          const baseAmount = updated.quantity * updated.rate;
          let taxRate = 0;
          if (updated.tax && updated.tax !== 'none') {
            taxRate = parseInt(updated.tax.replace(/\D/g, '')) || 0;
          }
          updated.taxAmount = (baseAmount * taxRate) / 100;
          updated.amount = baseAmount + updated.taxAmount;
        }
        
        return updated;
      }
      return item;
    }));
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: String(Date.now()),
        itemId: "",
        itemName: "",
        description: "",
        account: "",
        quantity: 1,
        rate: 0,
        tax: "none",
        taxAmount: 0,
        amount: 0
      }
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const selectItem = (lineItemId: string, itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      updateLineItem(lineItemId, 'itemId', item.id);
      updateLineItem(lineItemId, 'itemName', item.name);
      updateLineItem(lineItemId, 'description', item.description || '');
      updateLineItem(lineItemId, 'rate', item.purchasePrice || item.sellingPrice || 0);
    }
  };

  const calculateSubTotal = (): number => {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateDiscount = (): number => {
    const subTotal = calculateSubTotal();
    if (formData.discountType === 'percent') {
      return (subTotal * formData.discountValue) / 100;
    }
    return formData.discountValue;
  };

  const calculateTaxTotal = (): number => {
    return lineItems.reduce((sum, item) => sum + item.taxAmount, 0);
  };

  const calculateTotal = (): number => {
    const subTotal = calculateSubTotal();
    const discount = calculateDiscount();
    const taxTotal = calculateTaxTotal();
    return subTotal - discount + taxTotal + formData.adjustment;
  };

  const handleSubmit = async (saveAsDraft: boolean = false) => {
    if (!formData.vendorId) {
      toast({ title: "Please select a vendor", variant: "destructive" });
      return;
    }

    const validItems = lineItems.filter(item => item.itemName && item.quantity > 0);
    if (validItems.length === 0) {
      toast({ title: "Please add at least one item", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: validItems,
          subTotal: calculateSubTotal(),
          discountAmount: calculateDiscount(),
          taxAmount: calculateTaxTotal(),
          total: calculateTotal(),
          status: saveAsDraft ? 'DRAFT' : 'ISSUED'
        })
      });

      if (response.ok) {
        toast({ title: saveAsDraft ? "Draft saved successfully" : "Purchase order created successfully" });
        setLocation('/purchase-orders');
      } else {
        toast({ title: "Failed to create purchase order", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Failed to create purchase order", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setLocation('/purchase-orders')}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">New Purchase Order</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleSubmit(true)}
              disabled={loading}
              data-testid="button-save-draft"
            >
              Save as Draft
            </Button>
            <Button 
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
              data-testid="button-save-send"
            >
              {loading ? "Saving..." : "Save and Send"}
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/purchase-orders')}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-blue-600">Vendor Name*</Label>
                  <div className="flex gap-2">
                    <Select value={formData.vendorId} onValueChange={handleVendorChange}>
                      <SelectTrigger data-testid="select-vendor">
                        <SelectValue placeholder="Select a Vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map(vendor => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            {vendor.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={() => setLocation('/vendors/new')}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-blue-600">Delivery Address*</Label>
                  <RadioGroup 
                    value={formData.deliveryAddressType} 
                    onValueChange={(value) => setFormData({...formData, deliveryAddressType: value})}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="organization" id="org" />
                      <Label htmlFor="org">Organization</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="customer" id="customer" />
                      <Label htmlFor="customer">Customer</Label>
                    </div>
                  </RadioGroup>
                  
                  {selectedVendor?.billingAddress && (
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
                      {selectedVendor.billingAddress.street1 && <p>{selectedVendor.billingAddress.street1}</p>}
                      {selectedVendor.billingAddress.city && (
                        <p>{selectedVendor.billingAddress.city}, {selectedVendor.billingAddress.state} {selectedVendor.billingAddress.pinCode}</p>
                      )}
                      {selectedVendor.billingAddress.countryRegion && <p>{selectedVendor.billingAddress.countryRegion}</p>}
                    </div>
                  )}
                  <button className="text-blue-600 text-sm hover:underline">
                    Change destination to deliver
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-blue-600">Purchase Order#*</Label>
                    <Input 
                      value={purchaseOrderNumber} 
                      readOnly 
                      className="bg-slate-50"
                      data-testid="input-po-number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Reference#</Label>
                    <Input 
                      value={formData.referenceNumber}
                      onChange={(e) => setFormData({...formData, referenceNumber: e.target.value})}
                      data-testid="input-reference"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      data-testid="input-date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Delivery Date</Label>
                    <Input 
                      type="date" 
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                      data-testid="input-delivery-date"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Shipment Preference</Label>
                    <Select 
                      value={formData.shipmentPreference} 
                      onValueChange={(value) => setFormData({...formData, shipmentPreference: value})}
                    >
                      <SelectTrigger data-testid="select-shipment">
                        <SelectValue placeholder="Choose the shipment preference" />
                      </SelectTrigger>
                      <SelectContent>
                        {SHIPMENT_PREFERENCES.map(pref => (
                          <SelectItem key={pref} value={pref}>{pref}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Terms</Label>
                    <Select 
                      value={formData.paymentTerms} 
                      onValueChange={(value) => setFormData({...formData, paymentTerms: value})}
                    >
                      <SelectTrigger data-testid="select-payment-terms">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_TERMS.map(term => (
                          <SelectItem key={term} value={term}>{term}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="reverseCharge"
                    checked={formData.reverseCharge}
                    onCheckedChange={(checked) => setFormData({...formData, reverseCharge: checked as boolean})}
                  />
                  <Label htmlFor="reverseCharge" className="text-sm">
                    This transaction is applicable for reverse charge
                  </Label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <RadioGroup defaultValue="item" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="item" id="item-level" />
                      <Label htmlFor="item-level">At Item Level</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="transaction" id="transaction-level" />
                      <Label htmlFor="transaction-level">At Transaction Level</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button variant="link" className="text-blue-600">
                  Bulk Actions
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-blue-600">
                    <TableRow>
                      <TableHead className="text-white font-medium w-8">#</TableHead>
                      <TableHead className="text-white font-medium">Item & Description</TableHead>
                      <TableHead className="text-white font-medium">Account</TableHead>
                      <TableHead className="text-white font-medium text-center w-24">Quantity</TableHead>
                      <TableHead className="text-white font-medium text-right w-24">Rate</TableHead>
                      <TableHead className="text-white font-medium w-32">Tax</TableHead>
                      <TableHead className="text-white font-medium text-right w-28">Amount</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Select 
                              value={item.itemId} 
                              onValueChange={(value) => selectItem(item.id, value)}
                            >
                              <SelectTrigger className="border-0 shadow-none p-0 h-auto" data-testid={`select-item-${index}`}>
                                <SelectValue placeholder="Type or click to select an item." />
                              </SelectTrigger>
                              <SelectContent>
                                {items.map(i => (
                                  <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input 
                              placeholder="Description"
                              value={item.description}
                              onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                              className="border-0 text-sm text-slate-500 p-0 h-auto focus-visible:ring-0"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={item.account} 
                            onValueChange={(value) => updateLineItem(item.id, 'account', value)}
                          >
                            <SelectTrigger className="border-0 shadow-none" data-testid={`select-account-${index}`}>
                              <SelectValue placeholder="Select an account" />
                            </SelectTrigger>
                            <SelectContent>
                              {ACCOUNTS.map(acc => (
                                <SelectItem key={acc} value={acc}>{acc}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="text-center"
                            data-testid={`input-quantity-${index}`}
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            className="text-right"
                            data-testid={`input-rate-${index}`}
                          />
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={item.tax} 
                            onValueChange={(value) => updateLineItem(item.id, 'tax', value)}
                          >
                            <SelectTrigger className="border-0 shadow-none" data-testid={`select-tax-${index}`}>
                              <SelectValue placeholder="Select a Tax" />
                            </SelectTrigger>
                            <SelectContent>
                              {TAX_OPTIONS.map(tax => (
                                <SelectItem key={tax.value} value={tax.value}>{tax.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500 h-8 w-8"
                            onClick={() => removeLineItem(item.id)}
                            data-testid={`button-remove-item-${index}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={addLineItem}
                  data-testid="button-add-row"
                >
                  <Plus className="h-4 w-4" /> Add New Row
                </Button>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" /> Add Items in Bulk
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea 
                  placeholder="Will be displayed on purchase order"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  data-testid="input-notes"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <Label className="font-semibold">Terms & Conditions</Label>
              <Textarea 
                placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
                value={formData.termsAndConditions}
                onChange={(e) => setFormData({...formData, termsAndConditions: e.target.value})}
                className="min-h-24"
                data-testid="input-terms"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Sub Total</span>
                <span className="font-medium">{calculateSubTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 w-20">Discount</span>
                <Input 
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({...formData, discountValue: parseFloat(e.target.value) || 0})}
                  className="w-20 text-right"
                  data-testid="input-discount"
                />
                <Select 
                  value={formData.discountType} 
                  onValueChange={(value) => setFormData({...formData, discountType: value})}
                >
                  <SelectTrigger className="w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">%</SelectItem>
                    <SelectItem value="flat">Rs.</SelectItem>
                  </SelectContent>
                </Select>
                <span className="ml-auto font-medium text-red-500">
                  -{calculateDiscount().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <RadioGroup 
                  value={formData.taxType} 
                  onValueChange={(value) => setFormData({...formData, taxType: value})}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="TDS" id="tds" />
                    <Label htmlFor="tds">TDS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="TCS" id="tcs" />
                    <Label htmlFor="tcs">TCS</Label>
                  </div>
                </RadioGroup>
                <Select 
                  value={formData.taxCategory} 
                  onValueChange={(value) => setFormData({...formData, taxCategory: value})}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a Tax" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Tax</SelectItem>
                    <SelectItem value="tds194c">194C - 1%</SelectItem>
                    <SelectItem value="tds194j">194J - 10%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 w-20">Adjustment</span>
                <Input 
                  type="number"
                  value={formData.adjustment}
                  onChange={(e) => setFormData({...formData, adjustment: parseFloat(e.target.value) || 0})}
                  className="w-20 text-right"
                  data-testid="input-adjustment"
                />
                <Input 
                  placeholder="Description"
                  value={formData.adjustmentDescription}
                  onChange={(e) => setFormData({...formData, adjustmentDescription: e.target.value})}
                  className="flex-1"
                />
              </div>

              <div className="border-t pt-4 flex items-center justify-between">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-semibold text-lg">{calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <Label className="font-semibold">Attach File(s) to Purchase Order</Label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" /> Upload File
                </Button>
                <p className="text-xs text-slate-500 mt-2">
                  You can upload a maximum of 10 files, 10MB each
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-500">
          Additional Fields: Start adding custom fields for your purchase orders by going to Settings - Purchases - Purchase Orders.
        </div>

        <div className="text-right text-sm text-slate-500">
          PDF Template: <span className="text-blue-600">Standard Template</span> <button className="text-blue-600 ml-2">Change</button>
        </div>
      </div>
    </div>
  );
}
