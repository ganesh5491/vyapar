import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Plus, X, Search, Upload } from "lucide-react";
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
}

interface Item {
  id: string;
  name: string;
  description?: string;
  sellingPrice?: number;
  purchasePrice?: number;
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

export default function PurchaseOrderEdit() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
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

  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, [params.id]);

  const fetchInitialData = async () => {
    try {
      const [vendorsRes, itemsRes, poRes] = await Promise.all([
        fetch('/api/vendors'),
        fetch('/api/items'),
        fetch(`/api/purchase-orders/${params.id}`)
      ]);

      let vendorsList: Vendor[] = [];
      if (vendorsRes.ok) {
        const data = await vendorsRes.json();
        vendorsList = data.data || [];
        setVendors(vendorsList);
      }

      if (itemsRes.ok) {
        const data = await itemsRes.json();
        setItems(data.data || []);
      }

      if (poRes.ok) {
        const data = await poRes.json();
        const po = data.data;
        
        setPurchaseOrderNumber(po.purchaseOrderNumber);
        setFormData({
          vendorId: po.vendorId || "",
          vendorName: po.vendorName || "",
          deliveryAddressType: po.deliveryAddressType || "organization",
          deliveryAddress: po.deliveryAddress || {},
          referenceNumber: po.referenceNumber || "",
          date: po.date || new Date().toISOString().split('T')[0],
          deliveryDate: po.deliveryDate || "",
          paymentTerms: po.paymentTerms || "Due on Receipt",
          shipmentPreference: po.shipmentPreference || "",
          reverseCharge: po.reverseCharge || false,
          notes: po.notes || "",
          termsAndConditions: po.termsAndConditions || "",
          discountType: po.discountType || "percent",
          discountValue: po.discountValue || 0,
          taxType: po.taxType || "TDS",
          taxCategory: po.taxCategory || "",
          adjustment: po.adjustment || 0,
          adjustmentDescription: po.adjustmentDescription || ""
        });
        
        setLineItems(po.items?.length > 0 ? po.items : [{
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
        }]);

        const vendor = vendorsList.find((v: Vendor) => v.id === po.vendorId);
        if (vendor) setSelectedVendor(vendor);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast({ title: "Failed to load purchase order", variant: "destructive" });
    } finally {
      setLoadingData(false);
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

  const handleSubmit = async () => {
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
      const response = await fetch(`/api/purchase-orders/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: validItems,
          subTotal: calculateSubTotal(),
          discountAmount: calculateDiscount(),
          taxAmount: calculateTaxTotal(),
          total: calculateTotal()
        })
      });

      if (response.ok) {
        toast({ title: "Purchase order updated successfully" });
        setLocation('/purchase-orders');
      } else {
        toast({ title: "Failed to update purchase order", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Failed to update purchase order", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500">Loading purchase order...</p>
      </div>
    );
  }

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
            <h1 className="text-xl font-semibold">Edit Purchase Order - {purchaseOrderNumber}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
              data-testid="button-save"
            >
              {loading ? "Saving..." : "Save Changes"}
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
                    <Button variant="outline" size="icon">
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
                              <SelectTrigger className="border-0 shadow-none p-0 h-auto">
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
                            <SelectTrigger className="border-0 shadow-none">
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
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            className="text-right"
                          />
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={item.tax} 
                            onValueChange={(value) => updateLineItem(item.id, 'tax', value)}
                          >
                            <SelectTrigger className="border-0 shadow-none">
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
                placeholder="Enter the terms and conditions of your business"
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

              <div className="flex items-center gap-2">
                <span className="text-slate-600 w-20">Adjustment</span>
                <Input 
                  type="number"
                  value={formData.adjustment}
                  onChange={(e) => setFormData({...formData, adjustment: parseFloat(e.target.value) || 0})}
                  className="w-20 text-right"
                />
              </div>

              <div className="border-t pt-4 flex items-center justify-between">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-semibold text-lg">{calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
