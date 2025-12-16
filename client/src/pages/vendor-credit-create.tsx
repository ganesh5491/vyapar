import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, RefreshCw, Upload, Plus, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const TDS_TCS_OPTIONS = [
  { value: "commission_brokerage_2", label: "Commission or Brokerage [2%]" },
  { value: "professional_fees_10", label: "Professional Fees [10%]" },
  { value: "rent_10", label: "Rent [10%]" },
  { value: "contractor_1", label: "Payment to Contractor [1%]" },
  { value: "contractor_2", label: "Payment to Contractor [2%]" },
];

const ACCOUNT_OPTIONS = [
  { value: "cost_of_goods_sold", label: "Cost of Goods Sold" },
  { value: "inventory", label: "Inventory" },
  { value: "purchase_returns", label: "Purchase Returns" },
  { value: "other_expense", label: "Other Expense" },
];

const TAX_OPTIONS = [
  { value: "gst_5", label: "GST [5%]" },
  { value: "gst_12", label: "GST [12%]" },
  { value: "gst_18", label: "GST [18%]" },
  { value: "gst_28", label: "GST [28%]" },
  { value: "igst_5", label: "IGST [5%]" },
  { value: "igst_12", label: "IGST [12%]" },
  { value: "igst_18", label: "IGST [18%]" },
  { value: "igst_28", label: "IGST [28%]" },
  { value: "exempt", label: "Exempt" },
  { value: "nil", label: "Nil Rated" },
];

interface Vendor {
  id: string;
  displayName: string;
  companyName?: string;
}

interface Item {
  id: string;
  name: string;
  rate: number;
  description?: string;
  type?: string;
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
  amount: number;
}

export default function VendorCreditCreate() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    vendorId: "",
    vendorName: "",
    creditNoteNumber: "",
    orderNumber: "",
    vendorCreditDate: new Date().toISOString().split('T')[0],
    subject: "",
    reverseCharge: false,
    taxType: "tds" as "tds" | "tcs",
    tdsTcs: "",
    discountType: "percentage" as "percentage" | "amount",
    discountValue: "",
    adjustment: "",
    notes: "",
    attachments: [] as File[],
  });

  const [items, setItems] = useState<LineItem[]>([]);

  const { data: vendorsData, isLoading: vendorsLoading } = useQuery<{ success: boolean; data: Vendor[] }>({
    queryKey: ['/api/vendors'],
  });

  const { data: productsData, isLoading: productsLoading } = useQuery<{ success: boolean; data: Item[] }>({
    queryKey: ['/api/items'],
  });

  const { data: nextNumberData } = useQuery<{ success: boolean; data: { nextNumber: string } }>({
    queryKey: ['/api/vendor-credits/next-number'],
  });

  useEffect(() => {
    if (nextNumberData?.data?.nextNumber) {
      setFormData(prev => ({ ...prev, creditNoteNumber: nextNumberData.data.nextNumber }));
    }
  }, [nextNumberData]);

  const vendors = vendorsData?.data || [];
  const products = productsData?.data || [];

  const handleVendorChange = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (vendor) {
      setFormData(prev => ({
        ...prev,
        vendorId: vendor.id,
        vendorName: vendor.displayName,
      }));
    }
  };

  const addItem = () => {
    setItems(prev => [...prev, {
      id: `item-${Date.now()}`,
      itemId: "",
      itemName: "",
      description: "",
      account: "cost_of_goods_sold",
      quantity: 1,
      rate: 0,
      tax: "",
      amount: 0,
    }]);
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateItem = (itemId: string, field: string, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: value };
        if (field === 'itemId') {
          const product = products.find(p => p.id === value);
          if (product) {
            updated.itemName = product.name;
            updated.description = product.description || '';
            updated.rate = product.rate;
            updated.amount = updated.quantity * product.rate;
          }
        }
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    }));
  };

  const calculateSubTotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateDiscount = () => {
    const subTotal = calculateSubTotal();
    if (formData.discountType === 'percentage') {
      return subTotal * (parseFloat(formData.discountValue) || 0) / 100;
    }
    return parseFloat(formData.discountValue) || 0;
  };

  const calculateTdsTcs = () => {
    if (!formData.tdsTcs) return 0;
    const subTotal = calculateSubTotal() - calculateDiscount();
    const percentMatch = formData.tdsTcs.match(/(\d+)/);
    if (percentMatch) {
      const percent = parseFloat(percentMatch[1]);
      return subTotal * percent / 100;
    }
    return 0;
  };

  const calculateTotal = () => {
    const subTotal = calculateSubTotal();
    const discount = calculateDiscount();
    const tdsTcs = calculateTdsTcs();
    const adjustment = parseFloat(formData.adjustment) || 0;
    
    if (formData.taxType === 'tds') {
      return subTotal - discount - tdsTcs + adjustment;
    }
    return subTotal - discount + tdsTcs + adjustment;
  };

  const handleSubmit = async (status: 'DRAFT' | 'OPEN') => {
    if (!formData.vendorId) {
      toast({ title: "Please select a vendor", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        items,
        subTotal: calculateSubTotal(),
        discountAmount: calculateDiscount(),
        tdsTcsAmount: calculateTdsTcs(),
        adjustment: parseFloat(formData.adjustment) || 0,
        total: calculateTotal(),
        status,
      };

      const response = await fetch('/api/vendor-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({ title: `Vendor credit ${status === 'DRAFT' ? 'saved as draft' : 'created'} successfully` });
        setLocation('/vendor-credits');
      } else {
        const error = await response.json();
        toast({ title: error.message || "Failed to save vendor credit", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Failed to save vendor credit", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation("/vendor-credits")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">New Vendor Credits</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2">
            <Label className="text-red-500">Vendor Name*</Label>
            <div className="flex gap-2">
              <Select 
                value={formData.vendorId} 
                onValueChange={handleVendorChange}
              >
                <SelectTrigger className="flex-1" data-testid="select-vendor">
                  <SelectValue placeholder="Select a Vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendorsLoading ? (
                    <SelectItem value="_loading" disabled>Loading...</SelectItem>
                  ) : vendors.length === 0 ? (
                    <SelectItem value="_empty" disabled>No vendors found</SelectItem>
                  ) : (
                    vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.displayName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-red-500">Credit Note#*</Label>
            <div className="relative">
              <Input 
                value={formData.creditNoteNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, creditNoteNumber: e.target.value }))}
                data-testid="input-credit-note-number"
              />
              <RefreshCw className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 cursor-pointer" />
            </div>
          </div>

          <div>
            <Label>Order Number</Label>
            <Input 
              value={formData.orderNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, orderNumber: e.target.value }))}
              data-testid="input-order-number"
            />
          </div>

          <div>
            <Label>Vendor Credit Date</Label>
            <Input 
              type="date"
              value={formData.vendorCreditDate}
              onChange={(e) => setFormData(prev => ({ ...prev, vendorCreditDate: e.target.value }))}
              data-testid="input-vendor-credit-date"
            />
          </div>
        </div>

        <div>
          <Label>Subject</Label>
          <Input 
            placeholder="Enter a subject within 250 characters"
            maxLength={250}
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            data-testid="input-subject"
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox 
            checked={formData.reverseCharge}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, reverseCharge: !!checked }))}
            data-testid="checkbox-reverse-charge"
          />
          <span className="text-sm text-slate-600">This transaction is applicable for reverse charge</span>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-600">At Transaction Level</span>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b">
              <h3 className="font-medium">Item Table</h3>
              <Button variant="link" size="sm" className="text-blue-600">
                <RefreshCw className="h-4 w-4 mr-1" />
                Bulk Actions
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-slate-600 uppercase text-xs w-8"></th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600 uppercase text-xs">Item Details</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600 uppercase text-xs">Account</th>
                    <th className="px-4 py-3 text-center font-medium text-slate-600 uppercase text-xs">Quantity</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-600 uppercase text-xs">Rate</th>
                    <th className="px-4 py-3 text-left font-medium text-slate-600 uppercase text-xs">Tax</th>
                    <th className="px-4 py-3 text-right font-medium text-slate-600 uppercase text-xs">Amount</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                        <p>No items added yet. Click "Add New Row" to add items.</p>
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr key={item.id} className="border-b last:border-b-0">
                        <td className="px-4 py-3 text-center">
                          <span className="text-slate-400">⋮⋮</span>
                        </td>
                        <td className="px-4 py-3">
                          <Select 
                            value={item.itemId} 
                            onValueChange={(v) => updateItem(item.id, 'itemId', v)}
                          >
                            <SelectTrigger data-testid={`select-item-${index}`}>
                              <SelectValue placeholder="Type or click to select an item." />
                            </SelectTrigger>
                            <SelectContent>
                              {productsLoading ? (
                                <SelectItem value="_loading" disabled>Loading...</SelectItem>
                              ) : products.length === 0 ? (
                                <SelectItem value="_empty" disabled>No items found</SelectItem>
                              ) : (
                                products.map((product) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3">
                          <Select 
                            value={item.account} 
                            onValueChange={(v) => updateItem(item.id, 'account', v)}
                          >
                            <SelectTrigger data-testid={`select-account-${index}`}>
                              <SelectValue placeholder="Select an account" />
                            </SelectTrigger>
                            <SelectContent>
                              {ACCOUNT_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3">
                          <Input 
                            type="number"
                            step="0.01"
                            className="w-20 text-center"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            data-testid={`input-quantity-${index}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input 
                            type="number"
                            step="0.01"
                            className="w-24 text-right"
                            value={item.rate}
                            onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                            data-testid={`input-rate-${index}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Select 
                            value={item.tax} 
                            onValueChange={(v) => updateItem(item.id, 'tax', v)}
                          >
                            <SelectTrigger data-testid={`select-tax-${index}`}>
                              <SelectValue placeholder="Select a Tax" />
                            </SelectTrigger>
                            <SelectContent>
                              {TAX_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {item.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 h-8 w-8"
                            data-testid={`button-remove-item-${index}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <Button 
              variant="link" 
              className="text-blue-600 gap-1"
              onClick={addItem}
              data-testid="button-add-row"
            >
              <Plus className="h-4 w-4" />
              Add New Row
            </Button>
            <Button variant="link" className="text-blue-600 gap-1">
              <Plus className="h-4 w-4" />
              Add Items in Bulk
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-80 space-y-3 bg-slate-50 p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Sub Total</span>
              <span className="font-medium">{calculateSubTotal().toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 flex-shrink-0">Discount</span>
              <Input 
                type="number"
                step="0.01"
                className="w-20 h-8"
                value={formData.discountValue}
                onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                data-testid="input-discount"
              />
              <Select 
                value={formData.discountType} 
                onValueChange={(v: "percentage" | "amount") => setFormData(prev => ({ ...prev, discountType: v }))}
              >
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">%</SelectItem>
                  <SelectItem value="amount">₹</SelectItem>
                </SelectContent>
              </Select>
              <span className="ml-auto font-medium">{calculateDiscount().toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                <label className="flex items-center gap-1 text-sm">
                  <input 
                    type="radio" 
                    name="taxType" 
                    checked={formData.taxType === 'tds'}
                    onChange={() => setFormData(prev => ({ ...prev, taxType: 'tds' }))}
                  />
                  TDS
                </label>
                <label className="flex items-center gap-1 text-sm">
                  <input 
                    type="radio" 
                    name="taxType" 
                    checked={formData.taxType === 'tcs'}
                    onChange={() => setFormData(prev => ({ ...prev, taxType: 'tcs' }))}
                  />
                  TCS
                </label>
              </div>
              <Select 
                value={formData.tdsTcs} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, tdsTcs: v }))}
              >
                <SelectTrigger className="flex-1 h-8" data-testid="select-tds-tcs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {TDS_TCS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="font-medium text-sm">- {calculateTdsTcs().toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs h-8">
                Adjustment
              </Button>
              <Input 
                type="number"
                step="0.01"
                className="w-24 h-8"
                value={formData.adjustment}
                onChange={(e) => setFormData(prev => ({ ...prev, adjustment: e.target.value }))}
                data-testid="input-adjustment"
              />
              <span className="ml-auto font-medium">{(parseFloat(formData.adjustment) || 0).toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg border-t pt-3">
              <span>Total ( ₹ )</span>
              <span>{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <Label>Notes</Label>
            <Textarea 
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="resize-none"
              data-testid="input-notes"
            />
          </div>

          <div>
            <Label>Attach File(s) to Vendor Credits</Label>
            <div className="flex items-center gap-2 mt-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload File
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">You can upload a maximum of 5 files, 10MB each</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white px-6 py-4 sticky bottom-0">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => handleSubmit('DRAFT')}
            disabled={saving}
            data-testid="button-save-draft"
          >
            {saving ? 'Saving...' : 'Save as Draft'}
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => handleSubmit('OPEN')}
            disabled={saving}
            data-testid="button-save-open"
          >
            {saving ? 'Saving...' : 'Save as Open'}
          </Button>
          <Button 
            variant="ghost"
            onClick={() => setLocation('/vendor-credits')}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
