import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Plus,
  ChevronDown,
  MoreHorizontal,
  Search,
  X,
  FileText,
  Pencil,
  Trash2,
  Copy,
  Send,
  CheckCircle,
  XCircle,
  ShoppingCart,
  Receipt,
  Clock,
  Calendar,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Printer,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { usePagination } from "@/hooks/use-pagination";
import { TablePagination } from "@/components/table-pagination";

interface Quote {
  id: string;
  quoteNumber: string;
  referenceNumber?: string;
  date: string;
  expiryDate?: string;
  customerId: string;
  customerName: string;
  total: number;
  status: string;
  convertedTo?: string; // 'invoice' | 'sales-order'
  salesperson?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: any[];
  billingAddress?: any;
  shippingAddress?: any;
  customerNotes?: string;
  termsAndConditions?: string;
  activityLogs?: any[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getStatusBadge = (status: string, convertedTo?: string) => {
  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    DRAFT: { label: "Draft", variant: "secondary" },
    SENT: { label: "Sent", variant: "default" },
    ACCEPTED: { label: "Accepted", variant: "default" },
    DECLINED: { label: "Declined", variant: "destructive" },
    CONVERTED: {
      label: convertedTo === 'invoice' ? "Converted to Invoice" :
        convertedTo === 'sales-order' ? "Converted to Sales Order" : "Converted",
      variant: "outline"
    },
    EXPIRED: { label: "Expired", variant: "destructive" },
  };
  const config = statusMap[status] || { label: status, variant: "secondary" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

interface QuoteDetailPanelProps {
  quote: Quote;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onConvert: (type: string) => void;
  onClone: () => void;
}

function QuoteDetailPanel({ quote, onClose, onEdit, onDelete, onConvert, onClone }: QuoteDetailPanelProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <ChevronDown className="h-4 w-4 rotate-90" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white" data-testid="text-quote-number">{quote.quoteNumber}</h2>
            <p className="text-sm text-slate-500">{quote.customerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onEdit} data-testid="button-edit-quote">
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 gap-1.5" size="sm" data-testid="button-convert">
                Convert
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onConvert("sales-order")} data-testid="menu-item-convert-sales-order">
                <ShoppingCart className="mr-2 h-4 w-4" /> To Sales Order
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onConvert("invoice")} data-testid="menu-item-convert-invoice">
                <Receipt className="mr-2 h-4 w-4" /> To Invoice
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5" data-testid="button-more-actions">
                More
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem data-testid="menu-item-send">
                <Send className="mr-2 h-4 w-4" /> Send Email
              </DropdownMenuItem>
              <DropdownMenuItem data-testid="menu-item-print">
                <Printer className="mr-2 h-4 w-4" /> Print
              </DropdownMenuItem>
              <DropdownMenuItem data-testid="menu-item-download">
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onClone} data-testid="menu-item-clone">
                <Copy className="mr-2 h-4 w-4" /> Clone
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem data-testid="menu-item-accept">
                <CheckCircle className="mr-2 h-4 w-4" /> Mark as Accepted
              </DropdownMenuItem>
              <DropdownMenuItem data-testid="menu-item-decline">
                <XCircle className="mr-2 h-4 w-4" /> Mark as Declined
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={onDelete} data-testid="menu-item-delete">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} data-testid="button-close-panel">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
          <TabsList className="h-auto p-0 bg-transparent">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent px-4 py-3"
              data-testid="tab-overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent px-4 py-3"
              data-testid="tab-activity"
            >
              Activity
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="flex-1 overflow-auto mt-0">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-500">Quote Number</p>
                <p className="font-medium">{quote.quoteNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Status</p>
                <div className="mt-1">{getStatusBadge(quote.status, quote.convertedTo)}</div>
              </div>
              <div>
                <p className="text-sm text-slate-500">Quote Date</p>
                <p className="font-medium">{formatDate(quote.date)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Expiry Date</p>
                <p className="font-medium">{quote.expiryDate ? formatDate(quote.expiryDate) : '-'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Customer</p>
                <p className="font-medium text-blue-600">{quote.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Salesperson</p>
                <p className="font-medium">{quote.salesperson || '-'}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold mb-4">Amount</h4>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(quote.total)}
              </div>
            </div>

            {quote.items && quote.items.length > 0 && (
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold mb-4">Items</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-slate-500">
                      <th className="py-2">Item</th>
                      <th className="py-2 text-right">Qty</th>
                      <th className="py-2 text-right">Rate</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quote.items.map((item: any, index: number) => (
                      <tr key={item.id || index} className="border-b">
                        <td className="py-2">{item.name}</td>
                        <td className="py-2 text-right">{item.quantity}</td>
                        <td className="py-2 text-right">{formatCurrency(item.rate)}</td>
                        <td className="py-2 text-right">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="flex-1 overflow-auto mt-0">
          <div className="p-6">
            {quote.activityLogs && quote.activityLogs.length > 0 ? (
              <div className="space-y-4">
                {quote.activityLogs.map((log: any) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{log.description}</p>
                      <p className="text-sm text-slate-500">
                        {log.user} - {formatDate(log.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">No activity recorded</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function Estimates() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await fetch('/api/quotes');
      if (response.ok) {
        const data = await response.json();
        setQuotes(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteClick = (quote: Quote) => {
    setSelectedQuote(quote);
  };

  const handleClosePanel = () => {
    setSelectedQuote(null);
  };

  const handleEditQuote = () => {
    if (selectedQuote) {
      setLocation(`/estimates/${selectedQuote.id}/edit`);
    }
  };

  const toggleSelectQuote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedQuotes.includes(id)) {
      setSelectedQuotes(selectedQuotes.filter(i => i !== id));
    } else {
      setSelectedQuotes([...selectedQuotes, id]);
    }
  };

  const handleDeleteClick = () => {
    if (selectedQuote) {
      setQuoteToDelete(selectedQuote.id);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!quoteToDelete) return;
    try {
      const response = await fetch(`/api/quotes/${quoteToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        toast({ title: "Quote deleted successfully" });
        handleClosePanel();
        fetchQuotes();
      }
    } catch (error) {
      toast({ title: "Failed to delete quote", variant: "destructive" });
    } finally {
      setDeleteDialogOpen(false);
      setQuoteToDelete(null);
    }
  };

  const handleConvert = async (type: string) => {
    if (!selectedQuote) return;

    try {
      const endpoint = type === 'invoice'
        ? `/api/quotes/${selectedQuote.id}/convert-to-invoice`
        : `/api/quotes/${selectedQuote.id}/convert-to-sales-order`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const result = await response.json();
        const targetType = type === 'invoice' ? 'Invoice' : 'Sales Order';
        const targetNumber = type === 'invoice'
          ? result.data?.invoice?.invoiceNumber || result.data?.invoiceNumber
          : result.data?.salesOrder?.orderNumber || result.data?.orderNumber;

        toast({
          title: "Quote Converted",
          description: `Quote converted to ${targetType}${targetNumber ? ' ' + targetNumber : ''}`,
        });

        // Refresh quotes to show updated status
        fetchQuotes();
        handleClosePanel();
      } else {
        throw new Error('Failed to convert');
      }
    } catch (error) {
      console.error('Error converting quote:', error);
      toast({
        title: "Conversion Failed",
        description: `Failed to convert quote to ${type === 'invoice' ? 'Invoice' : 'Sales Order'}`,
        variant: "destructive"
      });
    }
  };

  const handleClone = async () => {
    if (!selectedQuote) return;
    setLocation(`/quotes/create?cloneFrom=${selectedQuote.id}`);
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch =
      quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const { currentPage, totalPages, totalItems, itemsPerPage, paginatedItems, goToPage } = usePagination(filteredQuotes, 10);

  return (
    <div className="flex h-[calc(100vh-80px)] animate-in fade-in duration-300">
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${selectedQuote ? 'w-80' : 'w-full'}`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">All Quotes</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Quotes</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("DRAFT")}>Draft</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("SENT")}>Sent</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("ACCEPTED")}>Accepted</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("CONVERTED")}>Converted</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("DECLINED")}>Declined</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setLocation("/estimates/create")}
              className="bg-blue-600 hover:bg-blue-700 gap-1.5 h-9"
              data-testid="button-new-quote"
            >
              <Plus className="h-4 w-4" /> New
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading quotes...</div>
          ) : filteredQuotes.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <p className="mb-4">No quotes found.</p>
              <Button
                onClick={() => setLocation("/estimates/create")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" /> Create your first quote
              </Button>
            </div>
          ) : (
            <>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 z-10">
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="w-10 px-3 py-3 text-left">
                    <Checkbox
                      checked={selectedQuotes.length === filteredQuotes.length && filteredQuotes.length > 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedQuotes.length === filteredQuotes.length) {
                          setSelectedQuotes([]);
                        } else {
                          setSelectedQuotes(filteredQuotes.map(q => q.id));
                        }
                      }}
                    />
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Quote Number</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Reference#</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer Name</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="w-10 px-3 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {paginatedItems.map((quote) => (
                  <tr
                    key={quote.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors ${selectedQuote?.id === quote.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    onClick={() => handleQuoteClick(quote)}
                    data-testid={`row-quote-${quote.id}`}
                  >
                    <td className="px-3 py-3">
                      <Checkbox
                        checked={selectedQuotes.includes(quote.id)}
                        onClick={(e) => toggleSelectQuote(quote.id, e)}
                      />
                    </td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                      {formatDate(quote.date)}
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-medium text-blue-600 dark:text-blue-400">{quote.quoteNumber}</span>
                    </td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                      {quote.referenceNumber || '-'}
                    </td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                      {quote.customerName}
                    </td>
                    <td className="px-3 py-3">
                      {getStatusBadge(quote.status, quote.convertedTo)}
                    </td>
                    <td className="px-3 py-3 text-right text-slate-600 dark:text-slate-400">
                      {formatCurrency(quote.total)}
                    </td>
                    <td className="px-3 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Search className="h-4 w-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleQuoteClick(quote); }}>
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={goToPage}
            />
            </>
          )}
        </div>
      </div>

      {selectedQuote && (
        <div className="flex-1 min-w-0">
          <QuoteDetailPanel
            quote={selectedQuote}
            onClose={handleClosePanel}
            onEdit={handleEditQuote}
            onDelete={handleDeleteClick}
            onConvert={handleConvert}
            onClone={handleClone}
          />
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quote</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this quote? This action cannot be undone.
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
