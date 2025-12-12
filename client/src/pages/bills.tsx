import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Plus, Search, ChevronDown, MoreHorizontal, Pencil, Trash2, 
  X, Mail, FileText, Printer, Filter, Download,
  Eye, Check, List, Grid3X3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BillItem {
  id: string;
  itemName: string;
  description?: string;
  account: string;
  quantity: number;
  rate: number;
  tax?: string;
  taxAmount?: number;
  customerDetails?: string;
  amount: number;
}

interface JournalEntry {
  account: string;
  debit: number;
  credit: number;
}

interface Bill {
  id: string;
  billNumber: string;
  orderNumber?: string;
  vendorId: string;
  vendorName: string;
  vendorAddress?: {
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    country?: string;
    gstin?: string;
  };
  billDate: string;
  dueDate: string;
  paymentTerms: string;
  reverseCharge?: boolean;
  subject?: string;
  items: BillItem[];
  subTotal: number;
  discountType?: string;
  discountValue?: number;
  discountAmount?: number;
  taxType?: string;
  taxCategory?: string;
  taxAmount?: number;
  adjustment?: number;
  adjustmentDescription?: string;
  total: number;
  amountPaid: number;
  balanceDue: number;
  notes?: string;
  attachments?: string[];
  status: string;
  pdfTemplate?: string;
  journalEntries?: JournalEntry[];
  createdAt?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
}

function formatDate(dateString: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function BillPDFView({ bill }: { bill: Bill }) {
  const companyInfo = {
    name: "SKILLTONIT",
    address: "Hinjawadi - Wakad road",
    city: "Hinjawadi",
    state: "Pune Maharashtra 411057",
    country: "India",
    gstin: "27AZCPA5145K1ZH",
    email: "Sales.SkilltonIT@skilltonit.com",
    website: "www.skilltonit.com"
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm max-w-3xl mx-auto">
      <div className="relative">
        <div className="absolute top-4 left-4">
          <Badge className="bg-green-500 text-white border-0 px-3 py-1 text-xs font-semibold rotate-[-5deg]">
            Paid
          </Badge>
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-lg font-bold text-green-600">{companyInfo.name}</span>
              </div>
              <div className="text-sm text-slate-600 space-y-0.5">
                <p>{companyInfo.address}</p>
                <p>{companyInfo.city}</p>
                <p>{companyInfo.state}</p>
                <p>{companyInfo.country}</p>
                <p>GSTIN {companyInfo.gstin}</p>
                <p className="text-blue-600">{companyInfo.email}</p>
                <p className="text-blue-600">{companyInfo.website}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-slate-800 mb-1">BILL</h2>
              <p className="text-slate-600">Bill# <span className="font-medium">{bill.billNumber}</span></p>
              <div className="mt-2 text-sm">
                <p className="text-slate-500">Balance Due</p>
                <p className="text-xl font-bold">{formatCurrency(bill.balanceDue)}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-500 mb-2">Bill From</h4>
            <p className="font-semibold text-blue-600">{bill.vendorName}</p>
            {bill.vendorAddress && (
              <div className="text-sm text-slate-600">
                {bill.vendorAddress.street1 && <p>{bill.vendorAddress.street1}</p>}
                {bill.vendorAddress.city && (
                  <p>{bill.vendorAddress.city}, {bill.vendorAddress.state}</p>
                )}
                {bill.vendorAddress.pinCode && <p>{bill.vendorAddress.pinCode}</p>}
                {bill.vendorAddress.country && <p>{bill.vendorAddress.country}</p>}
                {bill.vendorAddress.gstin && <p>GSTIN {bill.vendorAddress.gstin}</p>}
              </div>
            )}
          </div>

          <div className="flex justify-end mb-4 text-sm">
            <div className="space-y-1 text-right">
              <p><span className="text-slate-500">Bill Date :</span> {formatDate(bill.billDate)}</p>
              <p><span className="text-slate-500">Due Date :</span> {formatDate(bill.dueDate)}</p>
              <p><span className="text-slate-500">Terms :</span> {bill.paymentTerms}</p>
            </div>
          </div>

          <table className="w-full mb-6">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-3 py-2 text-left text-sm font-medium">#</th>
                <th className="px-3 py-2 text-left text-sm font-medium">Item & Description</th>
                <th className="px-3 py-2 text-center text-sm font-medium">Qty</th>
                <th className="px-3 py-2 text-right text-sm font-medium">Rate</th>
                <th className="px-3 py-2 text-right text-sm font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bill.items.map((item, index) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-3 py-3 text-sm">{index + 1}</td>
                  <td className="px-3 py-3">
                    <p className="font-medium text-sm">{item.itemName}</p>
                    {item.description && <p className="text-xs text-slate-500">{item.description}</p>}
                  </td>
                  <td className="px-3 py-3 text-center text-sm">{item.quantity.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="px-3 py-3 text-right text-sm">{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="px-3 py-3 text-right text-sm font-medium">{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-6">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Sub Total</span>
                <span>{bill.subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              {bill.taxAmount && bill.taxAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">IGST18 (18%)</span>
                  <span>{bill.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>{formatCurrency(bill.total)}</span>
              </div>
              <div className="flex justify-between bg-blue-50 p-2 rounded font-semibold">
                <span>Balance Due</span>
                <span>{formatCurrency(bill.balanceDue)}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t pt-4">
            <p className="text-sm text-slate-600">Authorized Signature ____________________</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillDetailView({ bill }: { bill: Bill }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">BILL</h2>
          <p className="text-slate-600">Bill# <span className="font-semibold">{bill.billNumber}</span></p>
          <Badge 
            className={`mt-2 ${
              bill.status === 'PAID' ? 'bg-green-500 text-white' : 
              bill.status === 'OVERDUE' ? 'bg-red-500 text-white' : 
              'bg-amber-500 text-white'
            }`}
          >
            {bill.status}
          </Badge>
        </div>
        <div className="text-right">
          <h4 className="text-sm text-slate-500">VENDOR ADDRESS</h4>
          <p className="font-semibold text-blue-600">{bill.vendorName}</p>
          {bill.vendorAddress && (
            <div className="text-sm text-slate-600 mt-1">
              {bill.vendorAddress.street1 && <p>{bill.vendorAddress.street1}</p>}
              <p>{bill.vendorAddress.city}, {bill.vendorAddress.state}</p>
              <p>{bill.vendorAddress.country} - {bill.vendorAddress.pinCode}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm border-t border-b py-4">
        <div>
          <span className="text-slate-500 uppercase text-xs">Bill Date</span>
          <p className="font-medium">{formatDate(bill.billDate)}</p>
        </div>
        <div>
          <span className="text-slate-500 uppercase text-xs">Due Date</span>
          <p className="font-medium">{formatDate(bill.dueDate)}</p>
        </div>
        <div>
          <span className="text-slate-500 uppercase text-xs">Payment Terms</span>
          <p className="font-medium">{bill.paymentTerms}</p>
        </div>
        <div className="col-span-3">
          <span className="text-slate-500 uppercase text-xs">Total</span>
          <p className="font-bold text-lg">{formatCurrency(bill.total)}</p>
        </div>
      </div>

      <div>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="text-xs">ITEMS & DESCRIPTION</TableHead>
              <TableHead className="text-xs">ACCOUNT</TableHead>
              <TableHead className="text-xs text-center">QUANTITY</TableHead>
              <TableHead className="text-xs text-right">RATE</TableHead>
              <TableHead className="text-xs text-right">AMOUNT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bill.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-blue-600">{item.itemName}</TableCell>
                <TableCell>{item.account}</TableCell>
                <TableCell className="text-center">{item.quantity}</TableCell>
                <TableCell className="text-right">{item.rate.toFixed(2)}</TableCell>
                <TableCell className="text-right">{item.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <div className="w-72 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Sub Total</span>
            <span>{formatCurrency(bill.subTotal)}</span>
          </div>
          {bill.discountAmount && bill.discountAmount > 0 && (
            <div className="flex justify-between text-sm text-pink-600">
              <span>Discount</span>
              <span>(-){formatCurrency(bill.discountAmount)}</span>
            </div>
          )}
          {bill.taxAmount && bill.taxAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">IGST18 (18%)</span>
              <span>{formatCurrency(bill.taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total</span>
            <span>{formatCurrency(bill.total)}</span>
          </div>
        </div>
      </div>

      {bill.journalEntries && bill.journalEntries.length > 0 && (
        <div className="border-t pt-4">
          <Tabs defaultValue="journal">
            <TabsList>
              <TabsTrigger value="journal">Journal</TabsTrigger>
            </TabsList>
            <TabsContent value="journal">
              <p className="text-xs text-slate-500 mb-2">
                Amount is displayed in your base currency <Badge variant="outline" className="text-xs">INR</Badge>
              </p>
              <h4 className="font-semibold mb-2">Bill</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">ACCOUNT</TableHead>
                    <TableHead className="text-xs text-right">DEBIT</TableHead>
                    <TableHead className="text-xs text-right">CREDIT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bill.journalEntries.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.account}</TableCell>
                      <TableCell className="text-right">{entry.debit.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{entry.credit.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

function BillDetailPanel({ 
  bill, 
  onClose, 
  onEdit, 
  onDelete,
  onMarkPaid
}: { 
  bill: Bill; 
  onClose: () => void; 
  onEdit: () => void;
  onDelete: () => void;
  onMarkPaid: () => void;
}) {
  const [showPdfView, setShowPdfView] = useState(false);

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-900" data-testid="text-bill-number">{bill.billNumber}</h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} data-testid="button-close-panel">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200 overflow-x-auto bg-white">
        <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={onEdit} data-testid="button-edit-bill">
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              PDF/Print
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Printer className="mr-2 h-4 w-4" /> Print
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5" data-testid="button-more-actions">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {bill.status !== 'PAID' && (
              <DropdownMenuItem onClick={onMarkPaid}>
                <Check className="mr-2 h-4 w-4" />
                Mark as Paid
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-end">
        <div className="flex items-center gap-2">
          <Label htmlFor="pdf-view" className="text-sm text-slate-500">Show PDF View</Label>
          <Switch id="pdf-view" checked={showPdfView} onCheckedChange={setShowPdfView} />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {showPdfView ? (
          <BillPDFView bill={bill} />
        ) : (
          <BillDetailView bill={bill} />
        )}
      </div>

      <div className="border-t border-slate-200 p-3 text-center text-xs text-slate-500">
        PDF Template: <span className="text-blue-600">{bill.pdfTemplate || 'Standard Template'}</span>
        <button className="text-blue-600 ml-2">Change</button>
      </div>
    </div>
  );
}

export default function Bills() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [billToDelete, setBillToDelete] = useState<string | null>(null);
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'table'>('table');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await fetch('/api/bills');
      if (response.ok) {
        const data = await response.json();
        setBills(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBillDetail = async (id: string) => {
    try {
      const response = await fetch(`/api/bills/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedBill(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch bill detail:', error);
    }
  };

  const handleBillClick = (bill: Bill) => {
    fetchBillDetail(bill.id);
  };

  const handleClosePanel = () => {
    setSelectedBill(null);
  };

  const handleEditBill = () => {
    if (selectedBill) {
      setLocation(`/bills/${selectedBill.id}/edit`);
    }
  };

  const handleDelete = (id: string) => {
    setBillToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!billToDelete) return;
    try {
      const response = await fetch(`/api/bills/${billToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        toast({ title: "Bill deleted successfully" });
        fetchBills();
        if (selectedBill?.id === billToDelete) {
          handleClosePanel();
        }
      }
    } catch (error) {
      toast({ title: "Failed to delete bill", variant: "destructive" });
    } finally {
      setDeleteDialogOpen(false);
      setBillToDelete(null);
    }
  };

  const handleMarkPaid = async () => {
    if (!selectedBill) return;
    try {
      const response = await fetch(`/api/bills/${selectedBill.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PAID' })
      });
      if (response.ok) {
        toast({ title: "Bill marked as paid" });
        fetchBills();
        fetchBillDetail(selectedBill.id);
      }
    } catch (error) {
      toast({ title: "Failed to update bill status", variant: "destructive" });
    }
  };

  const toggleSelectBill = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedBills.includes(id)) {
      setSelectedBills(selectedBills.filter(i => i !== id));
    } else {
      setSelectedBills([...selectedBills, id]);
    }
  };

  const filteredBills = bills.filter(bill =>
    bill.billNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">PAID</Badge>;
      case 'OPEN':
        return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">OPEN</Badge>;
      case 'OVERDUE':
        return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">OVERDUE</Badge>;
      case 'PARTIALLY_PAID':
        return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">PARTIALLY PAID</Badge>;
      case 'VOID':
        return <Badge variant="outline" className="text-slate-600 border-slate-200">VOID</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] animate-in fade-in duration-300">
      <div className={`flex flex-col overflow-hidden transition-all duration-300 ${selectedBill ? 'flex-1 min-w-[400px]' : 'flex-1'}`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-slate-900">All Bills</h1>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </div>
          <div className="flex items-center gap-2">
            {!selectedBill && (
              <>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`h-9 w-9 ${viewMode === 'list' ? 'bg-slate-100' : ''}`}
                  onClick={() => setViewMode('list')}
                  data-testid="button-list-view"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`h-9 w-9 ${viewMode === 'table' ? 'bg-slate-100' : ''}`}
                  onClick={() => setViewMode('table')}
                  data-testid="button-table-view"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button 
              onClick={() => setLocation("/bills/new")} 
              className="bg-blue-600 hover:bg-blue-700 gap-1.5 h-9"
              data-testid="button-new-bill"
            >
              <Plus className="h-4 w-4" /> New
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9" data-testid="button-more-options">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" /> Export
                </DropdownMenuItem>
                <DropdownMenuItem onClick={fetchBills}>
                  Refresh List
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {!selectedBill && (
          <div className="px-4 py-3 flex items-center gap-2 border-b border-slate-200">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search bills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading bills...</div>
          ) : filteredBills.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No bills found</h3>
              <p className="text-slate-500 mb-4">
                {searchTerm ? 'Try adjusting your search criteria' : 'Create your first bill to get started'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setLocation("/bills/new")} className="gap-2" data-testid="button-create-first-bill">
                  <Plus className="h-4 w-4" /> Create New Bill
                </Button>
              )}
            </div>
          ) : viewMode === 'list' && selectedBill ? (
            <div className="divide-y divide-slate-100">
              {filteredBills.map((bill) => (
                <div
                  key={bill.id}
                  onClick={() => handleBillClick(bill)}
                  className={`p-4 cursor-pointer hover-elevate ${selectedBill?.id === bill.id ? 'bg-blue-50 border-l-2 border-l-blue-600' : ''}`}
                  data-testid={`row-bill-${bill.id}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        checked={selectedBills.includes(bill.id)}
                        onClick={(e) => toggleSelectBill(bill.id, e)}
                      />
                      <div>
                        <p className="font-medium text-slate-900 truncate max-w-[180px]">{bill.vendorName}</p>
                        <p className="text-sm text-slate-500">{bill.billNumber} - {formatDate(bill.billDate)}</p>
                        {getStatusBadge(bill.status)}
                      </div>
                    </div>
                    <p className="font-semibold text-slate-900">{formatCurrency(bill.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-10"></TableHead>
                  <TableHead className="text-xs">DATE</TableHead>
                  <TableHead className="text-xs">BILL#</TableHead>
                  <TableHead className="text-xs">REFERENCE NUMBER</TableHead>
                  <TableHead className="text-xs">VENDOR NAME</TableHead>
                  <TableHead className="text-xs">STATUS</TableHead>
                  <TableHead className="text-xs">DUE DATE</TableHead>
                  <TableHead className="text-xs text-right">AMOUNT</TableHead>
                  <TableHead className="text-xs text-right">BALANCE DUE</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.map((bill) => (
                  <TableRow
                    key={bill.id}
                    onClick={() => handleBillClick(bill)}
                    className={`cursor-pointer hover-elevate ${selectedBill?.id === bill.id ? 'bg-blue-50' : ''}`}
                    data-testid={`row-bill-${bill.id}`}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedBills.includes(bill.id)}
                        onClick={(e) => toggleSelectBill(bill.id, e)}
                      />
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(bill.billDate)}</TableCell>
                    <TableCell className="text-sm text-blue-600 font-medium">{bill.billNumber}</TableCell>
                    <TableCell className="text-sm">{bill.orderNumber || '-'}</TableCell>
                    <TableCell className="text-sm">{bill.vendorName}</TableCell>
                    <TableCell>{getStatusBadge(bill.status)}</TableCell>
                    <TableCell className="text-sm">{formatDate(bill.dueDate)}</TableCell>
                    <TableCell className="text-sm text-right">{formatCurrency(bill.total)}</TableCell>
                    <TableCell className="text-sm text-right">{formatCurrency(bill.balanceDue)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setLocation(`/bills/${bill.id}/edit`); }}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600" 
                            onClick={(e) => { e.stopPropagation(); handleDelete(bill.id); }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {selectedBill && (
        <div className="w-full max-w-[600px] lg:w-[600px] flex-shrink-0 border-l border-slate-200">
          <BillDetailPanel
            bill={selectedBill}
            onClose={handleClosePanel}
            onEdit={handleEditBill}
            onDelete={() => handleDelete(selectedBill.id)}
            onMarkPaid={handleMarkPaid}
          />
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Bill</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this bill? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
