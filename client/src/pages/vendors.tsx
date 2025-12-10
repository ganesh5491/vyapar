import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Plus, Search, ChevronDown, MoreHorizontal, Pencil, Trash2, 
  X, Copy, Ban, FileText, ArrowUpDown, Download, Upload, 
  Settings, RefreshCw, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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

const GST_TREATMENTS = [
  "Registered Business - Regular",
  "Registered Business - Composition",
  "Unregistered Business",
  "Consumer",
  "Overseas",
  "Special Economic Zone",
  "Deemed Export"
];

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
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-slate-900" data-testid="text-vendor-name">{vendor.displayName}</h2>
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
        <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={onEdit} data-testid="button-edit-vendor">
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5" data-testid="button-more-actions">
              <MoreHorizontal className="h-3.5 w-3.5" />
              More
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
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
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="h-12 w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger 
            value="details" 
            className="rounded-none border-b-2 border-transparent px-6 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Vendor Details
          </TabsTrigger>
          <TabsTrigger 
            value="transactions" 
            className="rounded-none border-b-2 border-transparent px-6 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Transactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="flex-1 overflow-auto p-6 mt-0">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-2xl font-semibold text-blue-600">
                  {vendor.displayName?.charAt(0)?.toUpperCase() || 'V'}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{vendor.displayName}</h3>
                <p className="text-sm text-slate-500">{vendor.companyName}</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-slate-500 mb-3">VENDOR DETAILS</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Primary Contact</span>
                    <p className="font-medium">{vendor.firstName} {vendor.lastName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Company Name</span>
                    <p className="font-medium">{vendor.companyName || '-'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Email</span>
                    <p className="font-medium text-blue-600">{vendor.email || '-'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Work Phone</span>
                    <p className="font-medium">{vendor.workPhone || '-'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Mobile</span>
                    <p className="font-medium">{vendor.mobile || '-'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">GST Treatment</span>
                    <p className="font-medium">{vendor.gstTreatment || '-'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Source of Supply</span>
                    <p className="font-medium">{vendor.sourceOfSupply || '-'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">PAN</span>
                    <p className="font-medium">{vendor.pan || '-'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Currency</span>
                    <p className="font-medium">{vendor.currency || 'INR - Indian Rupee'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Payment Terms</span>
                    <p className="font-medium">{vendor.paymentTerms || 'Due on Receipt'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-slate-500 mb-3">OUTSTANDING</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Payables</span>
                    <p className="font-medium">₹{(vendor.payables || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Unused Credits</span>
                    <p className="font-medium">₹{(vendor.unusedCredits || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>

              {vendor.billingAddress && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-slate-500 mb-3">BILLING ADDRESS</h4>
                  <div className="text-sm">
                    {vendor.billingAddress.attention && <p>{vendor.billingAddress.attention}</p>}
                    {vendor.billingAddress.street1 && <p>{vendor.billingAddress.street1}</p>}
                    {vendor.billingAddress.street2 && <p>{vendor.billingAddress.street2}</p>}
                    {vendor.billingAddress.city && <p>{vendor.billingAddress.city}, {vendor.billingAddress.state} {vendor.billingAddress.pinCode}</p>}
                    {vendor.billingAddress.countryRegion && <p>{vendor.billingAddress.countryRegion}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="flex-1 overflow-auto p-6 mt-0">
          <div className="text-center py-12 text-slate-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium mb-1">No transactions yet</p>
            <p className="text-xs text-slate-400">Create a purchase order or bill to get started</p>
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

  return (
    <div className="flex h-[calc(100vh-80px)] animate-in fade-in duration-300">
      <div className={`flex-1 flex flex-col overflow-hidden ${selectedVendor ? 'max-w-md' : ''}`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-slate-900">All Vendors</h1>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setLocation("/vendors/new")} 
              className="bg-blue-600 hover:bg-blue-700 gap-1.5 h-9"
              data-testid="button-new-vendor"
            >
              <Plus className="h-4 w-4" /> New
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
                <DropdownMenuItem onClick={() => setSortBy('unusedCredits')} className={sortBy === 'unusedCredits' ? 'bg-blue-50' : ''}>
                  <ArrowUpDown className="mr-2 h-4 w-4" /> Unused Credits (BCY)
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

        {!selectedVendor && (
          <div className="px-4 pb-3 flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto border-t border-slate-200">
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
          ) : selectedVendor ? (
            <div className="divide-y divide-slate-100">
              {sortedVendors.map((vendor) => (
                <div 
                  key={vendor.id} 
                  className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                    selectedVendor?.id === vendor.id ? 'bg-blue-50 border-l-2 border-l-blue-600' : ''
                  }`}
                  onClick={() => handleVendorClick(vendor)}
                  data-testid={`card-vendor-${vendor.id}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        checked={selectedVendors.includes(vendor.id)}
                        onClick={(e) => toggleSelectVendor(vendor.id, e)}
                      />
                      <span className="font-medium text-blue-600 truncate">{vendor.displayName}</span>
                    </div>
                    <Badge variant="outline" className={vendor.status === "active" ? "text-green-600 border-green-200" : "text-slate-500"}>
                      {vendor.status || "active"}
                    </Badge>
                  </div>
                  <div className="ml-6 flex items-center gap-2 text-sm">
                    <span className="text-slate-500">{vendor.companyName || "No company"}</span>
                  </div>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Work Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    GST Treatment
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Payables (BCY)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Unused Credits (BCY)
                  </th>
                  <th className="w-12 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {sortedVendors.map((vendor) => (
                  <tr 
                    key={vendor.id} 
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => handleVendorClick(vendor)}
                    data-testid={`row-vendor-${vendor.id}`}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedVendors.includes(vendor.id)}
                        onClick={(e) => toggleSelectVendor(vendor.id, e as any)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-blue-600 font-medium">{vendor.displayName}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{vendor.companyName || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{vendor.email || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{vendor.workPhone || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{vendor.gstTreatment || '-'}</td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      ₹{(vendor.payables || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      ₹{(vendor.unusedCredits || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setLocation(`/vendors/${vendor.id}/edit`)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleVendorClick(vendor)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDelete(vendor.id)}
                          >
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

      {selectedVendor && (
        <div className="w-[600px] flex-shrink-0">
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
