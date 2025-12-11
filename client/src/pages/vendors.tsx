import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Plus, Search, ChevronDown, ChevronRight, MoreHorizontal, Pencil, Trash2, 
  X, Copy, Ban, FileText, ArrowUpDown, Download, Upload, 
  Settings, RefreshCw, Building2, Bold, Italic, Underline,
  Printer, Calendar, Link2, Clock, User, Filter, Send, Mail,
  Receipt, CreditCard, Wallet, BookOpen, Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Vendor {
  id: string;
  salutation?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  displayName: string;
  email?: string;
  workPhone?: string;
  mobile?: string;
  gstTreatment?: string;
  sourceOfSupply?: string;
  pan?: string;
  msmeRegistered?: boolean;
  currency?: string;
  openingBalance?: number;
  paymentTerms?: string;
  tds?: string;
  payables?: number;
  unusedCredits?: number;
  status?: string;
  billingAddress?: {
    attention?: string;
    countryRegion?: string;
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    phone?: string;
    faxNumber?: string;
  };
  shippingAddress?: {
    attention?: string;
    countryRegion?: string;
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    phone?: string;
    faxNumber?: string;
  };
  contactPersons?: Array<{
    salutation?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    workPhone?: string;
    mobile?: string;
  }>;
  bankDetails?: {
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    swiftCode?: string;
    branchName?: string;
  };
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  type: string;
  date: string;
  number: string;
  orderNumber?: string;
  vendor?: string;
  paidThrough?: string;
  amount: number;
  balance: number;
  status: string;
  referenceNumber?: string;
  customer?: string;
  invoiceNumber?: string;
}

interface SystemMail {
  id: string;
  to: string;
  subject: string;
  description: string;
  sentAt: string;
}

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  user: string;
  date: string;
  time: string;
}

const formatAddress = (address: any) => {
  if (!address) return ['-'];
  const parts = [address.street1, address.street2, address.city, address.state, address.pinCode, address.countryRegion].filter(Boolean);
  return parts.length > 0 ? parts : ['-'];
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  };
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

function VendorDetailPanel({ 
  vendor, 
  onClose, 
  onEdit, 
  onClone, 
  onToggleStatus, 
  onDelete 
}: { 
  vendor: Vendor; 
  onClose: () => void; 
  onEdit: () => void;
  onClone: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>({
    bills: [],
    billPayments: [],
    expenses: [],
    purchaseOrders: [],
    vendorCredits: [],
    journals: []
  });
  const [mails, setMails] = useState<SystemMail[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    bills: true,
    billPayments: true,
    expenses: true,
    purchaseOrders: false,
    vendorCredits: false,
    journals: false
  });
  
  const [statementPeriod, setStatementPeriod] = useState("this-month");
  const [statementFilter, setStatementFilter] = useState("all");

  useEffect(() => {
    fetchVendorData();
  }, [vendor.id]);

  const fetchVendorData = async () => {
    try {
      const [commentsRes, transactionsRes, mailsRes, activitiesRes] = await Promise.all([
        fetch(`/api/vendors/${vendor.id}/comments`),
        fetch(`/api/vendors/${vendor.id}/transactions`),
        fetch(`/api/vendors/${vendor.id}/mails`),
        fetch(`/api/vendors/${vendor.id}/activities`)
      ]);
      
      if (commentsRes.ok) {
        const data = await commentsRes.json();
        setComments(data.data || []);
      }
      if (transactionsRes.ok) {
        const data = await transactionsRes.json();
        setTransactions(data.data || transactions);
      }
      if (mailsRes.ok) {
        const data = await mailsRes.json();
        setMails(data.data || []);
      }
      if (activitiesRes.ok) {
        const data = await activitiesRes.json();
        setActivities(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching vendor data:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await fetch(`/api/vendors/${vendor.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment })
      });
      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data.data]);
        setNewComment("");
        toast({ title: "Comment added successfully" });
      }
    } catch (error) {
      toast({ title: "Failed to add comment", variant: "destructive" });
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleNewTransaction = (type: string) => {
    const availableRoutes: Record<string, string> = {
      bill: `/bills/new?vendorId=${vendor.id}`,
      bills: `/bills/new?vendorId=${vendor.id}`,
      expense: `/expenses?vendorId=${vendor.id}`,
      expenses: `/expenses?vendorId=${vendor.id}`,
      purchaseOrder: `/purchase-orders/new?vendorId=${vendor.id}`,
      purchaseOrders: `/purchase-orders/new?vendorId=${vendor.id}`,
    };
    const unavailableTypes = ["billPayment", "vendorCredit", "journal", "billPayments", "vendorCredits", "journals"];
    
    if (unavailableTypes.includes(type)) {
      toast({ 
        title: "Feature coming soon", 
        description: "This feature is not yet available. Please check back later.",
      });
      return;
    }
    setLocation(availableRoutes[type] || `/bills/new?vendorId=${vendor.id}`);
  };

  const transactionSections = [
    { key: 'bills', label: 'Bills', columns: ['DATE', 'BILL#', 'ORDER ...', 'VENDOR', 'AMOUNT', 'BALANC...', 'STATUS'] },
    { key: 'billPayments', label: 'Bill Payments', columns: ['DATE', 'PAYMEN...', 'REFERE...', 'PAYMEN...', 'AMOUN...', 'UNUSED...', 'STATUS'] },
    { key: 'expenses', label: 'Expenses', columns: ['DATE', 'EXPE...', 'INVOI...', 'VEND...', 'PAID T...', 'CUST...', 'AMOU...', 'STATUS'] },
    { key: 'purchaseOrders', label: 'Purchase Orders', columns: ['PURCHAS...', 'REFEREN...', 'DATE', 'DELIVERY D...', 'AMOUNT', 'STATUS'] },
    { key: 'vendorCredits', label: 'Vendor Credits', columns: ['DATE', 'CREDIT NO...', 'ORDER NU...', 'BALANCE', 'AMOUNT', 'STATUS'] },
    { key: 'journals', label: 'Journals', columns: ['DATE', 'JOURNAL NU...', 'REFERENCE NU...', 'DEBIT', 'CREDIT'] }
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <ChevronDown className="h-4 w-4 rotate-90" />
          </Button>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white truncate" data-testid="text-vendor-name">{vendor.displayName}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onEdit} data-testid="button-edit-vendor">
            Edit
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <FileText className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 gap-1.5" size="sm" data-testid="button-new-transaction">
                New Transaction
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-xs text-slate-500">PURCHASES</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleNewTransaction("bill")} data-testid="menu-item-bill">
                <Receipt className="mr-2 h-4 w-4" /> Bill
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNewTransaction("billPayment")} data-testid="menu-item-bill-payment">
                <CreditCard className="mr-2 h-4 w-4" /> Bill Payment
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNewTransaction("purchaseOrder")} data-testid="menu-item-purchase-order">
                <Package className="mr-2 h-4 w-4" /> Purchase Order
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleNewTransaction("expense")} data-testid="menu-item-expense">
                <Wallet className="mr-2 h-4 w-4" /> Expense
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNewTransaction("vendorCredit")} data-testid="menu-item-vendor-credit">
                <CreditCard className="mr-2 h-4 w-4" /> Vendor Credit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNewTransaction("journal")} data-testid="menu-item-journal">
                <BookOpen className="mr-2 h-4 w-4" /> Journal
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
              <DropdownMenuItem onClick={onClone} data-testid="menu-item-clone">
                <Copy className="mr-2 h-4 w-4" />
                Clone Vendor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleStatus} data-testid="menu-item-toggle-status">
                <Ban className="mr-2 h-4 w-4" />
                {vendor.status === 'active' ? 'Mark as Inactive' : 'Mark as Active'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={onDelete} data-testid="menu-item-delete">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
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
              value="comments" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent px-4 py-3"
              data-testid="tab-comments"
            >
              Comments
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent px-4 py-3"
              data-testid="tab-transactions"
            >
              Transactions
            </TabsTrigger>
            <TabsTrigger 
              value="mails" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent px-4 py-3"
              data-testid="tab-mails"
            >
              Mails
            </TabsTrigger>
            <TabsTrigger 
              value="statement" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent px-4 py-3"
              data-testid="tab-statement"
            >
              Statement
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="flex-1 overflow-auto mt-0">
          <div className="flex h-full">
            <div className="w-72 border-r border-slate-200 dark:border-slate-700 p-6 overflow-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{vendor.displayName}</h3>
                  {vendor.companyName && (
                    <p className="text-sm text-slate-500 mt-1">{vendor.companyName}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <User className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{vendor.firstName} {vendor.lastName}</p>
                      {vendor.email && <p className="text-xs text-blue-600">{vendor.email}</p>}
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 mt-2">Invite to Portal</button>
                </div>

                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-slate-500">
                    ADDRESS
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">Billing Address</p>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-sm mt-1">
                        {formatAddress(vendor.billingAddress).map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">Shipping Address</p>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-sm mt-1">
                        {formatAddress(vendor.shippingAddress).map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                    <button className="text-sm text-blue-600">Add additional address</button>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-slate-500">
                    OTHER DETAILS
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 space-y-3 text-sm">
                    <div>
                      <p className="text-slate-500">Vendor Type</p>
                      <p className="font-medium">Business</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Default Currency</p>
                      <p className="font-medium">{vendor.currency || 'INR'}</p>
                    </div>
                    {vendor.gstTreatment && (
                      <div>
                        <p className="text-slate-500">GST Treatment</p>
                        <p className="font-medium">{vendor.gstTreatment}</p>
                      </div>
                    )}
                    {vendor.pan && (
                      <div>
                        <p className="text-slate-500">PAN</p>
                        <p className="font-medium">{vendor.pan}</p>
                      </div>
                    )}
                    {vendor.sourceOfSupply && (
                      <div>
                        <p className="text-slate-500">Source of Supply</p>
                        <p className="font-medium">{vendor.sourceOfSupply}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-slate-500">Payment Terms</p>
                      <p className="font-medium">{vendor.paymentTerms || 'Due on Receipt'}</p>
                    </div>
                    {vendor.tds && (
                      <div>
                        <p className="text-slate-500">TDS</p>
                        <p className="font-medium">{vendor.tds}</p>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-auto">
              <div className="max-w-2xl">
                <div className="mb-6">
                  <p className="text-sm text-slate-500">Payment due period</p>
                  <p className="text-sm font-medium">{vendor.paymentTerms || 'Due on Receipt'}</p>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-4">Payables</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b">
                        <th className="py-2">CURRENCY</th>
                        <th className="py-2 text-right">OUTSTANDING PAYABLES</th>
                        <th className="py-2 text-right">UNUSED CREDITS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2">INR- Indian Rupee</td>
                        <td className="py-2 text-right">{formatCurrency(vendor.payables || 0)}</td>
                        <td className="py-2 text-right">{formatCurrency(vendor.unusedCredits || 0)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <button className="text-sm text-blue-600 mt-2">Enter Opening Balance</button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">Expenses</h4>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="last-6-months">
                        <SelectTrigger className="w-36 h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                          <SelectItem value="last-12-months">Last 12 Months</SelectItem>
                          <SelectItem value="this-year">This Year</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="accrual">
                        <SelectTrigger className="w-28 h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="accrual">Accrual</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">This chart is displayed in the organization's base currency.</p>
                  <div className="h-32 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-end justify-around px-4 pb-2">
                    {['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((month, i) => (
                      <div key={month} className="flex flex-col items-center">
                        <div className="w-8 bg-orange-200 dark:bg-orange-800 rounded-t" style={{ height: `${20 + i * 8}px` }}></div>
                        <span className="text-xs text-slate-500 mt-1">{month}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm mt-4">Total Expenses ( Last 6 Months ) - {formatCurrency(0)}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">Activity Timeline</h4>
                  <div className="space-y-4">
                    {activities.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm">No activities yet</p>
                      </div>
                    ) : (
                      activities.map((activity) => {
                        const { date, time } = formatDateTime(activity.date);
                        return (
                          <div key={activity.id} className="flex gap-4">
                            <div className="text-right text-xs text-slate-500 w-24 flex-shrink-0">
                              <p>{date}</p>
                              <p>{time}</p>
                            </div>
                            <div className="relative">
                              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-blue-200"></div>
                              <div className="relative z-10 h-4 w-4 bg-white border-2 border-blue-500 rounded"></div>
                            </div>
                            <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                              <h5 className="font-medium text-sm">{activity.title}</h5>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{activity.description}</p>
                              <p className="text-xs text-slate-500 mt-2">
                                by <span className="text-blue-600">{activity.user}</span>
                                <button className="text-blue-600 ml-2">- View Details</button>
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comments" className="flex-1 overflow-auto p-6 mt-0">
          <div className="max-w-2xl">
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg mb-6">
              <div className="flex items-center gap-2 p-2 border-b border-slate-200 dark:border-slate-700">
                <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-bold">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-italic">
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-underline">
                  <Underline className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="border-0 focus-visible:ring-0 min-h-24 resize-none"
                data-testid="input-comment"
              />
              <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  data-testid="button-add-comment"
                >
                  Add Comment
                </Button>
              </div>
            </div>

            <h4 className="text-sm font-medium text-slate-500 mb-4">ALL COMMENTS</h4>
            {comments.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No comments yet.</p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="flex-1 overflow-auto mt-0">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5" data-testid="button-goto-transactions">
                    Go to transactions
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem>Bills</DropdownMenuItem>
                  <DropdownMenuItem>Bill Payments</DropdownMenuItem>
                  <DropdownMenuItem>Expenses</DropdownMenuItem>
                  <DropdownMenuItem>Purchase Orders</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-4">
              {transactionSections.map((section) => (
                <Collapsible
                  key={section.key}
                  open={expandedSections[section.key]}
                  onOpenChange={() => toggleSection(section.key)}
                >
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <div className="flex items-center gap-2">
                        {expandedSections[section.key] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <span className="font-medium">{section.label}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Filter className="h-4 w-4" />
                          Status: All
                          <ChevronDown className="h-3 w-3" />
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-blue-600 gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNewTransaction(section.key === 'bills' ? 'bill' : section.key);
                          }}
                          data-testid={`button-new-${section.key}`}
                        >
                          <Plus className="h-3 w-3" />
                          New
                        </Button>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="border-t border-slate-200 dark:border-slate-700">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                              {section.columns.map((col, i) => (
                                <th key={i} className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(transactions[section.key] || []).length === 0 ? (
                              <tr>
                                <td colSpan={section.columns.length} className="px-4 py-8 text-center text-slate-500">
                                  No {section.label.toLowerCase()} found. <button className="text-blue-600" onClick={() => handleNewTransaction(section.key === 'bills' ? 'bill' : section.key)}>Add New</button>
                                </td>
                              </tr>
                            ) : (
                              (transactions[section.key] || []).map((tx) => (
                                <tr key={tx.id} className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                                  <td className="px-4 py-3">{formatDate(tx.date)}</td>
                                  <td className="px-4 py-3 text-blue-600">{tx.number}</td>
                                  <td className="px-4 py-3">{tx.orderNumber || '-'}</td>
                                  <td className="px-4 py-3">{tx.vendor || '-'}</td>
                                  <td className="px-4 py-3">{formatCurrency(tx.amount)}</td>
                                  <td className="px-4 py-3">{formatCurrency(tx.balance)}</td>
                                  <td className="px-4 py-3">
                                    <Badge variant="outline" className={tx.status === 'Paid' ? 'text-green-600' : tx.status === 'Draft' ? 'text-slate-500' : 'text-blue-600'}>
                                      {tx.status}
                                    </Badge>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="mails" className="flex-1 overflow-auto p-6 mt-0">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-medium">System Mails</h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5" data-testid="button-link-email">
                  <Link2 className="h-4 w-4" />
                  Link Email account
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Gmail</DropdownMenuItem>
                <DropdownMenuItem>Outlook</DropdownMenuItem>
                <DropdownMenuItem>Other</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {mails.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Mail className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-medium mb-1">No emails yet</p>
              <p className="text-sm">System emails sent to this vendor will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mails.map((mail) => {
                const { date, time } = formatDateTime(mail.sentAt);
                return (
                  <div key={mail.id} className="flex items-start gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 font-medium">R</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">To <span className="text-blue-600">{mail.to}</span></p>
                      <p className="font-medium text-sm mt-1">{mail.subject}</p>
                      <p className="text-sm text-slate-500 truncate">{mail.description}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500 flex-shrink-0">
                      <p>{date}</p>
                      <p>{time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="statement" className="flex-1 overflow-auto mt-0">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Select value={statementPeriod} onValueChange={setStatementPeriod}>
                  <SelectTrigger className="w-40 h-9" data-testid="select-period">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="This Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="this-quarter">This Quarter</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statementFilter} onValueChange={setStatementFilter}>
                  <SelectTrigger className="w-32 h-9" data-testid="select-filter">
                    <SelectValue placeholder="Filter By: All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Filter By: All</SelectItem>
                    <SelectItem value="outstanding">Outstanding</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9" data-testid="button-print">
                  <Printer className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9" data-testid="button-download-pdf">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9" data-testid="button-download-excel">
                  <FileText className="h-4 w-4" />
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 gap-1.5" size="sm" data-testid="button-send-email">
                  <Send className="h-4 w-4" />
                  Send Email
                </Button>
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Vendor Statement for {vendor.displayName}</h3>
              <p className="text-sm text-slate-500">From 01/12/2025 To 31/12/2025</p>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
              <div className="flex justify-between mb-8">
                <div>
                  <h4 className="text-xl font-bold text-blue-600">SkilltonIT</h4>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium">SkilltonIT</p>
                  <p>Hinjewadi - Wakad road</p>
                  <p>Hinjewadi</p>
                  <p>Pune Maharashtra 411057</p>
                  <p>India</p>
                  <p>GSTIN 27AZCPA5145K1ZH</p>
                  <p>Sales.SkilltonIT@skilltonit.com</p>
                  <p>www.skilltonit.com</p>
                </div>
              </div>

              <div className="flex mb-8">
                <div className="w-1/2">
                  <p className="text-sm text-slate-500 mb-1">To</p>
                  <p className="font-medium text-blue-600">{vendor.displayName}</p>
                  {vendor.companyName && <p className="text-sm">{vendor.companyName}</p>}
                  <div className="text-sm">
                    {formatAddress(vendor.billingAddress).map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  {vendor.pan && <p className="text-sm">PAN {vendor.pan}</p>}
                </div>
                <div className="w-1/2 text-right">
                  <h4 className="text-xl font-bold mb-2">Statement of Accounts</h4>
                  <p className="text-sm text-blue-600">01/12/2025 To 31/12/2025</p>
                </div>
              </div>

              <div className="mb-8">
                <h5 className="text-center font-semibold mb-4">Account Summary</h5>
                <table className="w-full max-w-sm mx-auto text-sm">
                  <tbody>
                    <tr>
                      <td className="py-1">Opening Balance</td>
                      <td className="py-1 text-right">{formatCurrency(vendor.openingBalance || 0)}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Billed Amount</td>
                      <td className="py-1 text-right">{formatCurrency(0)}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Amount Paid</td>
                      <td className="py-1 text-right text-green-600">{formatCurrency(0)}</td>
                    </tr>
                    <tr className="border-t font-medium">
                      <td className="py-2">Balance Due</td>
                      <td className="py-2 text-right">{formatCurrency(vendor.payables || 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Date</th>
                    <th className="py-2 text-left">Transactions</th>
                    <th className="py-2 text-left">Details</th>
                    <th className="py-2 text-right">Amount</th>
                    <th className="py-2 text-right">Payments</th>
                    <th className="py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">01/12/2025</td>
                    <td className="py-2">***Opening Balance***</td>
                    <td className="py-2"></td>
                    <td className="py-2 text-right">{(vendor.openingBalance || 0).toFixed(2)}</td>
                    <td className="py-2 text-right"></td>
                    <td className="py-2 text-right">{(vendor.openingBalance || 0).toFixed(2)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t font-medium">
                    <td colSpan={5} className="py-2 text-right">Balance Due</td>
                    <td className="py-2 text-right">{formatCurrency(vendor.payables || 0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function VendorsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await fetch('/api/vendors');
      if (response.ok) {
        const data = await response.json();
        setVendors(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorDetail = async (id: string) => {
    try {
      const response = await fetch(`/api/vendors/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedVendor(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch vendor detail:', error);
    }
  };

  const handleVendorClick = (vendor: Vendor) => {
    fetchVendorDetail(vendor.id);
  };

  const handleClosePanel = () => {
    setSelectedVendor(null);
  };

  const handleEditVendor = () => {
    if (selectedVendor) {
      setLocation(`/vendors/${selectedVendor.id}/edit`);
    }
  };

  const toggleSelectVendor = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedVendors.includes(id)) {
      setSelectedVendors(selectedVendors.filter(i => i !== id));
    } else {
      setSelectedVendors([...selectedVendors, id]);
    }
  };

  const handleClone = async () => {
    if (!selectedVendor) return;
    try {
      const response = await fetch(`/api/vendors/${selectedVendor.id}/clone`, { method: 'POST' });
      if (response.ok) {
        toast({ title: "Vendor cloned successfully" });
        fetchVendors();
        handleClosePanel();
      }
    } catch (error) {
      toast({ title: "Failed to clone vendor", variant: "destructive" });
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedVendor) return;
    try {
      const newStatus = selectedVendor.status === 'active' ? 'inactive' : 'active';
      const response = await fetch(`/api/vendors/${selectedVendor.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        toast({ title: `Vendor marked as ${newStatus}` });
        fetchVendors();
        handleClosePanel();
      }
    } catch (error) {
      toast({ title: "Failed to update vendor status", variant: "destructive" });
    }
  };

  const handleDelete = (id: string) => {
    setVendorToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!vendorToDelete) return;
    try {
      const response = await fetch(`/api/vendors/${vendorToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        toast({ title: "Vendor deleted successfully" });
        fetchVendors();
        if (selectedVendor?.id === vendorToDelete) {
          handleClosePanel();
        }
      }
    } catch (error) {
      toast({ title: "Failed to delete vendor", variant: "destructive" });
    } finally {
      setDeleteDialogOpen(false);
      setVendorToDelete(null);
    }
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedVendors = [...filteredVendors].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.displayName || '').localeCompare(b.displayName || '');
      case 'companyName':
        return (a.companyName || '').localeCompare(b.companyName || '');
      case 'payables':
        return (b.payables || 0) - (a.payables || 0);
      case 'unusedCredits':
        return (b.unusedCredits || 0) - (a.unusedCredits || 0);
      default:
        return 0;
    }
  });

  const formatCurrencyLocal = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] animate-in fade-in duration-300">
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${selectedVendor ? 'w-80' : 'w-full'}`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Active Vendors</h1>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setLocation("/vendors/new")} 
              className="bg-blue-600 hover:bg-blue-700 gap-1.5 h-9"
              data-testid="button-new-vendor"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9" data-testid="button-more-options">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs text-slate-500">SORT BY</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setSortBy('name')} className={sortBy === 'name' ? 'bg-blue-50' : ''}>
                  <ArrowUpDown className="mr-2 h-4 w-4" /> Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('companyName')} className={sortBy === 'companyName' ? 'bg-blue-50' : ''}>
                  <ArrowUpDown className="mr-2 h-4 w-4" /> Company Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('payables')} className={sortBy === 'payables' ? 'bg-blue-50' : ''}>
                  <ArrowUpDown className="mr-2 h-4 w-4" /> Payables (BCY)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Upload className="mr-2 h-4 w-4" /> Import
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" /> Export
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Preferences
                </DropdownMenuItem>
                <DropdownMenuItem onClick={fetchVendors}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Refresh List
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading vendors...</div>
          ) : sortedVendors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No vendors yet</h3>
              <p className="text-slate-500 mb-4 max-w-sm">
                Add your first vendor to start tracking purchases and managing supplier relationships.
              </p>
              <Button 
                onClick={() => setLocation("/vendors/new")} 
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="button-add-first-vendor"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Your First Vendor
              </Button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 z-10">
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="w-10 px-3 py-3 text-left">
                    <Checkbox 
                      checked={selectedVendors.length === sortedVendors.length && sortedVendors.length > 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedVendors.length === sortedVendors.length) {
                          setSelectedVendors([]);
                        } else {
                          setSelectedVendors(sortedVendors.map(v => v.id));
                        }
                      }}
                    />
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Company Name</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Work Phone</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Payables (BCY)</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Unused Credits (BCY)</th>
                  <th className="w-10 px-3 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {sortedVendors.map((vendor) => (
                  <tr 
                    key={vendor.id} 
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors ${
                      selectedVendor?.id === vendor.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => handleVendorClick(vendor)}
                    data-testid={`row-vendor-${vendor.id}`}
                  >
                    <td className="px-3 py-3">
                      <Checkbox 
                        checked={selectedVendors.includes(vendor.id)}
                        onClick={(e) => toggleSelectVendor(vendor.id, e)}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-medium text-blue-600 dark:text-blue-400">{vendor.displayName}</span>
                    </td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                      {vendor.companyName || '-'}
                    </td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                      {vendor.email || '-'}
                    </td>
                    <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                      {vendor.workPhone || '-'}
                    </td>
                    <td className="px-3 py-3 text-right text-slate-600 dark:text-slate-400">
                      {formatCurrencyLocal(vendor.payables || 0)}
                    </td>
                    <td className="px-3 py-3 text-right text-slate-600 dark:text-slate-400">
                      {formatCurrencyLocal(vendor.unusedCredits || 0)}
                    </td>
                    <td className="px-3 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Search className="h-4 w-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleVendorClick(vendor); }}>
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedVendor && (
        <div className="flex-1 min-w-0">
          <VendorDetailPanel
            vendor={selectedVendor}
            onClose={handleClosePanel}
            onEdit={handleEditVendor}
            onClone={handleClone}
            onToggleStatus={handleToggleStatus}
            onDelete={() => handleDelete(selectedVendor.id)}
          />
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this vendor? This action cannot be undone.
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
