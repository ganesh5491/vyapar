import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  ChevronDown,
  X,
  Copy,
  UserMinus,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  Receipt,
  CreditCard,
  FileCheck,
  Package,
  Truck,
  RefreshCw,
  Wallet,
  BookOpen,
  FolderKanban,
  BadgeIndianRupee,
  Send,
  Share2,
  ExternalLink
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
  DropdownMenuLabel
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
import { useToast } from "@/hooks/use-toast";

interface CustomerListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  status?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
}

interface CustomerDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  status?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  createdAt?: string;
}

const formatAddress = (address: any) => {
  if (!address) return ['-'];
  const parts = [address.street, address.city, address.state, address.country, address.pincode].filter(Boolean);
  return parts.length > 0 ? parts : ['-'];
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

interface CustomerDetailPanelProps {
  customer: CustomerDetail;
  onClose: () => void;
  onEdit: () => void;
  onClone: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

function CustomerDetailPanel({ customer, onClose, onEdit, onClone, onToggleStatus, onDelete }: CustomerDetailPanelProps) {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("details");

  const handleNewTransaction = (type: string) => {
    const routes: Record<string, string> = {
      invoice: `/invoices/new?customerId=${customer.id}`,
      payment: `/invoices/new?customerId=${customer.id}`,
      quote: `/quotes/create?customerId=${customer.id}`,
      "sales-order": `/invoices/new?customerId=${customer.id}`,
      "delivery-challan": `/invoices/new?customerId=${customer.id}`,
      "recurring-invoice": `/invoices/new?customerId=${customer.id}`,
      expense: `/expenses?customerId=${customer.id}`,
      journal: `/invoices/new?customerId=${customer.id}`,
      "credit-note": `/invoices/new?customerId=${customer.id}`,
      project: `/invoices/new?customerId=${customer.id}`,
    };
    setLocation(routes[type] || `/invoices/new?customerId=${customer.id}`);
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900" data-testid="text-customer-name">{customer.name}</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <FileText className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} data-testid="button-close-panel">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-200 overflow-x-auto">
        <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={onEdit} data-testid="button-edit-customer">
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5" data-testid="button-new-transaction">
              <Receipt className="h-3.5 w-3.5" />
              New Transaction
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel className="text-xs text-slate-500">SALES</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleNewTransaction("invoice")} data-testid="menu-item-invoice">
              <Receipt className="mr-2 h-4 w-4" /> Invoice
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNewTransaction("payment")} data-testid="menu-item-payment">
              <CreditCard className="mr-2 h-4 w-4" /> Customer Payment
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNewTransaction("quote")} data-testid="menu-item-quote">
              <FileCheck className="mr-2 h-4 w-4" /> Quote
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNewTransaction("sales-order")} data-testid="menu-item-sales-order">
              <Package className="mr-2 h-4 w-4" /> Sales Order
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNewTransaction("delivery-challan")} data-testid="menu-item-delivery-challan">
              <Truck className="mr-2 h-4 w-4" /> Delivery Challan
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNewTransaction("recurring-invoice")} data-testid="menu-item-recurring-invoice">
              <RefreshCw className="mr-2 h-4 w-4" /> Recurring Invoice
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleNewTransaction("expense")} data-testid="menu-item-expense">
              <Wallet className="mr-2 h-4 w-4" /> Expense
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNewTransaction("journal")} data-testid="menu-item-journal">
              <BookOpen className="mr-2 h-4 w-4" /> Journal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNewTransaction("credit-note")} data-testid="menu-item-credit-note">
              <BadgeIndianRupee className="mr-2 h-4 w-4" /> Credit Note
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNewTransaction("project")} data-testid="menu-item-project">
              <FolderKanban className="mr-2 h-4 w-4" /> Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5">
          <Send className="h-3.5 w-3.5" />
          Email
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-more-options">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onClone} data-testid="menu-item-clone">
              <Copy className="mr-2 h-4 w-4" /> Clone
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleStatus} data-testid="menu-item-toggle-status">
              {customer.status === "active" ? (
                <><UserMinus className="mr-2 h-4 w-4" /> Mark as Inactive</>
              ) : (
                <><UserCheck className="mr-2 h-4 w-4" /> Mark as Active</>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive" data-testid="menu-item-delete">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center px-6 border-b border-slate-200">
          <TabsList className="h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="details" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent px-4 py-3"
              data-testid="tab-details"
            >
              Customer Details
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent px-4 py-3"
              data-testid="tab-transactions"
            >
              Transactions
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details" className="flex-1 overflow-auto p-6 mt-0">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold text-slate-900">{customer.name}</h3>
                  <Badge className={customer.status === "active" ? "bg-green-100 text-green-700 border-green-200" : "bg-slate-100 text-slate-600 border-slate-200"}>
                    {customer.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500">{customer.email || "No email"}</p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h4 className="text-base font-medium text-slate-900 mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-500" /> Company Details
              </h4>
              <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Name</span>
                  <span className="text-slate-900">{customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <span className="text-slate-900 capitalize">{customer.status || "active"}</span>
                </div>
                {customer.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Created</span>
                    <span className="text-slate-900">{formatDate(customer.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h4 className="text-base font-medium text-slate-900 mb-4 flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-500" /> Contact Information
              </h4>
              <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Email</span>
                  <span className="text-blue-600">{customer.email || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone</span>
                  <span className="text-slate-900">{customer.phone || "-"}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h4 className="text-base font-medium text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-500" /> Addresses
              </h4>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Billing Address</p>
                  {formatAddress(customer.billingAddress).map((line, i) => (
                    <p key={i} className="text-sm text-slate-900">{line}</p>
                  ))}
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Shipping Address</p>
                  {formatAddress(customer.shippingAddress).map((line, i) => (
                    <p key={i} className="text-sm text-slate-900">{line}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="flex-1 overflow-auto p-6 mt-0">
          <div className="text-center py-8 text-slate-500">
            <Receipt className="h-8 w-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm">No transactions yet</p>
            <p className="text-xs text-slate-400">Create an invoice or quote to get started</p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="border-t border-slate-200 p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ChevronDown className="h-4 w-4 rotate-90" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ChevronDown className="h-4 w-4 -rotate-90" />
        </Button>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetail = async (id: string) => {
    try {
      const response = await fetch(`/api/customers/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedCustomer(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch customer detail:', error);
    }
  };

  const handleCustomerClick = (customer: CustomerListItem) => {
    fetchCustomerDetail(customer.id);
  };

  const handleClosePanel = () => {
    setSelectedCustomer(null);
  };

  const handleEditCustomer = () => {
    if (selectedCustomer) {
      setLocation(`/customers/${selectedCustomer.id}/edit`);
    }
  };

  const toggleSelectCustomer = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter(i => i !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  const handleClone = async () => {
    if (!selectedCustomer) return;
    try {
      const response = await fetch(`/api/customers/${selectedCustomer.id}/clone`, { method: 'POST' });
      if (response.ok) {
        toast({ title: "Customer cloned successfully" });
        fetchCustomers();
        handleClosePanel();
      }
    } catch (error) {
      toast({ title: "Failed to clone customer", variant: "destructive" });
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedCustomer) return;
    const newStatus = selectedCustomer.status === "active" ? "inactive" : "active";
    try {
      const response = await fetch(`/api/customers/${selectedCustomer.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        toast({ title: `Customer marked as ${newStatus}` });
        fetchCustomers();
        fetchCustomerDetail(selectedCustomer.id);
      }
    } catch (error) {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  const handleDeleteClick = () => {
    if (selectedCustomer) {
      setCustomerToDelete(selectedCustomer.id);
      setDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      const response = await fetch(`/api/customers/${customerToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        toast({ title: "Customer deleted successfully" });
        handleClosePanel();
        fetchCustomers();
      }
    } catch (error) {
      toast({ title: "Failed to delete customer", variant: "destructive" });
    } finally {
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-[calc(100vh-80px)] animate-in fade-in duration-300">
      <div className={`flex-1 flex flex-col overflow-hidden ${selectedCustomer ? 'max-w-md' : ''}`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-slate-900">All Customers</h1>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setLocation("/customers/new")} 
              className="bg-blue-600 hover:bg-blue-700 gap-1.5 h-9"
              data-testid="button-new-customer"
            >
              <Plus className="h-4 w-4" /> New
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!selectedCustomer && (
          <div className="px-4 pb-3 flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-auto border-t border-slate-200">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading customers...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <p>No customers found.</p>
              <Button 
                onClick={() => setLocation("/customers/new")} 
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" /> Create your first customer
              </Button>
            </div>
          ) : selectedCustomer ? (
            <div className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <div 
                  key={customer.id} 
                  className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                    selectedCustomer?.id === customer.id ? 'bg-blue-50 border-l-2 border-l-blue-600' : ''
                  }`}
                  onClick={() => handleCustomerClick(customer)}
                  data-testid={`card-customer-${customer.id}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        checked={selectedCustomers.includes(customer.id)}
                        onClick={(e) => toggleSelectCustomer(customer.id, e)}
                      />
                      <span className="font-medium text-slate-900 truncate">{customer.name}</span>
                    </div>
                    <Badge variant="outline" className={customer.status === "active" ? "text-green-600 border-green-200" : "text-slate-500"}>
                      {customer.status || "active"}
                    </Badge>
                  </div>
                  <div className="ml-6 flex items-center gap-2 text-sm">
                    <span className="text-slate-500">{customer.email || "No email"}</span>
                  </div>
                  {customer.phone && (
                    <div className="ml-6 mt-1 text-sm text-slate-500">
                      {customer.phone}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <Checkbox />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">City</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="w-10 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => handleCustomerClick(customer)}
                    data-testid={`row-customer-${customer.id}`}
                  >
                    <td className="px-4 py-3">
                      <Checkbox 
                        checked={selectedCustomers.includes(customer.id)}
                        onClick={(e) => toggleSelectCustomer(customer.id, e)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-blue-600 hover:underline font-medium">
                        {customer.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {customer.email || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {customer.phone || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {customer.billingAddress?.city || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={customer.status === "active" ? "text-green-600 border-green-200" : "text-slate-500"}>
                        {customer.status || "active"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setLocation(`/customers/${customer.id}/edit`)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCustomerClick(customer)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
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

      {selectedCustomer && (
        <div className="flex-1 overflow-hidden">
          <CustomerDetailPanel 
            customer={selectedCustomer} 
            onClose={handleClosePanel}
            onEdit={handleEditCustomer}
            onClone={handleClone}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteClick}
          />
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
