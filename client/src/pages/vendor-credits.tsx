import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, MoreHorizontal, Trash2, Edit, FileText, ChevronDown, X, Printer, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import { usePagination } from "@/hooks/use-pagination";
import { TablePagination } from "@/components/table-pagination";
import { useToast } from "@/hooks/use-toast";

interface VendorCreditItem {
  id: string;
  itemId: string;
  itemName: string;
  description: string;
  hsnSac?: string;
  account: string;
  quantity: number;
  rate: string | number;
  tax: string;
  amount: number;
}

interface VendorCredit {
  id: string;
  creditNumber: string;
  vendorId: string;
  vendorName: string;
  referenceNumber?: string;
  orderNumber?: string;
  date: string;
  subject?: string;
  reverseCharge?: boolean;
  taxType?: string;
  tdsTcs?: string;
  items: VendorCreditItem[];
  subTotal: number;
  discountType?: string;
  discountValue?: string;
  discountAmount?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  tdsTcsAmount?: number;
  adjustment?: number;
  amount: number;
  balance: number;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Vendor {
  id: string;
  displayName: string;
  companyName?: string;
  billingAddress?: {
    attention?: string;
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    countryRegion?: string;
  };
  gstin?: string;
  sourceOfSupply?: string;
}

export default function VendorCredits() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCredit, setSelectedCredit] = useState<VendorCredit | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [creditToDelete, setCreditToDelete] = useState<string | null>(null);

  const { data: vendorCreditsData, isLoading, refetch } = useQuery<{ success: boolean; data: VendorCredit[] }>({
    queryKey: ['/api/vendor-credits'],
  });

  const { data: vendorsData } = useQuery<{ success: boolean; data: Vendor[] }>({
    queryKey: ['/api/vendors'],
  });

  const vendors = vendorsData?.data || [];

  const handleDelete = (id: string) => {
    setCreditToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!creditToDelete) return;
    try {
      const response = await fetch(`/api/vendor-credits/${creditToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        toast({ title: "Vendor credit deleted successfully" });
        if (selectedCredit?.id === creditToDelete) {
          setSelectedCredit(null);
        }
        refetch();
      } else {
        toast({ title: "Failed to delete vendor credit", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Failed to delete vendor credit", variant: "destructive" });
    } finally {
      setDeleteDialogOpen(false);
      setCreditToDelete(null);
    }
  };

  const vendorCredits = vendorCreditsData?.data || [];

  const filteredVendorCredits = vendorCredits.filter(credit =>
    credit.creditNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    credit.vendorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    credit.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { currentPage, totalPages, totalItems, itemsPerPage, paginatedItems, goToPage } = usePagination(filteredVendorCredits, 10);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getVendorDetails = (vendorId: string) => {
    return vendors.find(v => v.id === vendorId);
  };

  const calculateTaxDetails = (credit: VendorCredit) => {
    let cgst = 0;
    let sgst = 0;
    
    credit.items.forEach(item => {
      if (item.tax && item.tax.includes('gst')) {
        const rate = parseFloat(item.rate.toString());
        const quantity = item.quantity;
        const baseAmount = rate * quantity;
        
        if (item.tax === 'gst_18') {
          cgst += baseAmount * 0.09;
          sgst += baseAmount * 0.09;
        } else if (item.tax === 'gst_12') {
          cgst += baseAmount * 0.06;
          sgst += baseAmount * 0.06;
        } else if (item.tax === 'gst_5') {
          cgst += baseAmount * 0.025;
          sgst += baseAmount * 0.025;
        }
      }
    });
    
    return { cgst, sgst };
  };

  const getJournalEntries = (credit: VendorCredit) => {
    const { cgst, sgst } = calculateTaxDetails(credit);
    const costOfGoodsSold = credit.subTotal - (credit.discountAmount || 0);
    
    const entries = [
      { account: "Accounts Payable", debit: credit.amount, credit: 0 },
      { account: "Input SGST", debit: 0, credit: sgst },
      { account: "Input CGST", debit: 0, credit: cgst },
      { account: "Cost of Goods Sold", debit: 0, credit: costOfGoodsSold },
    ];
    
    const totalDebit = entries.reduce((sum, e) => sum + e.debit, 0);
    const totalCredit = entries.reduce((sum, e) => sum + e.credit, 0);
    
    return { entries, totalDebit, totalCredit };
  };

  return (
    <div className="h-full flex animate-in fade-in duration-500">
      <div className={`${selectedCredit ? 'w-80' : 'w-full'} flex flex-col border-r bg-background transition-all duration-300`}>
        <div className="flex items-center justify-between gap-2 p-4 border-b">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1 text-lg font-semibold" data-testid="dropdown-all-vendor-credits">
                All Vendor Credits
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>All Vendor Credits</DropdownMenuItem>
              <DropdownMenuItem>Open</DropdownMenuItem>
              <DropdownMenuItem>Closed</DropdownMenuItem>
              <DropdownMenuItem>Draft</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm"
              className="gap-1" 
              onClick={() => setLocation('/vendor-credits/new')}
              data-testid="button-add-vendor-credit"
            >
              <Plus className="h-4 w-4" /> New
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" data-testid="button-more-options">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Import Vendor Credits</DropdownMenuItem>
                <DropdownMenuItem>Export Vendor Credits</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {!selectedCredit && (
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendor credits..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-vendor-credits"
              />
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : vendorCredits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2" data-testid="text-vendor-credits-empty">No vendor credits</h3>
            <p className="text-muted-foreground mb-4 max-w-sm text-sm">
              Record credits from vendors for returns or adjustments to apply against future bills.
            </p>
            <Button 
              className="gap-2" 
              onClick={() => setLocation('/vendor-credits/new')}
              data-testid="button-add-first-vendor-credit"
            >
              <Plus className="h-4 w-4" /> Add Your First Vendor Credit
            </Button>
          </div>
        ) : selectedCredit ? (
          <div className="flex-1 overflow-auto">
            {paginatedItems.map((credit) => (
              <div
                key={credit.id}
                className={`p-3 border-b cursor-pointer transition-colors ${
                  selectedCredit?.id === credit.id ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedCredit(credit)}
                data-testid={`row-vendor-credit-${credit.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <Checkbox 
                      onClick={(e) => e.stopPropagation()} 
                      data-testid={`checkbox-vendor-credit-${credit.id}`}
                    />
                    <div>
                      <p className="font-medium text-sm">{credit.vendorName}</p>
                      <p className="text-primary text-xs">{credit.creditNumber} | {formatDate(credit.date)}</p>
                      <Badge 
                        variant="outline" 
                        className={`mt-1 text-xs ${
                          credit.status === 'OPEN' ? 'text-blue-600 border-blue-200' : 
                          credit.status === 'CLOSED' ? 'text-gray-600 border-gray-200' : 
                          'text-yellow-600 border-yellow-200'
                        }`}
                      >
                        {credit.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatCurrency(credit.amount)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                    <Checkbox data-testid="checkbox-select-all" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Credit Note#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Reference Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Vendor Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Amount</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Balance</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase">
                    <Search className="h-4 w-4 mx-auto" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedItems.map((credit) => (
                  <tr
                    key={credit.id}
                    className="hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => setSelectedCredit(credit)}
                    data-testid={`row-vendor-credit-${credit.id}`}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox data-testid={`checkbox-vendor-credit-${credit.id}`} />
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDate(credit.date)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-primary">{credit.creditNumber}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{credit.referenceNumber || credit.orderNumber || '-'}</td>
                    <td className="px-4 py-3 text-sm uppercase">{credit.vendorName}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge 
                        variant="outline"
                        className={`${
                          credit.status === 'OPEN' ? 'text-blue-600 border-blue-200 bg-blue-50' : 
                          credit.status === 'CLOSED' ? 'text-gray-600 border-gray-200 bg-gray-50' : 
                          'text-yellow-600 border-yellow-200 bg-yellow-50'
                        }`}
                      >
                        {credit.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium">
                      {formatCurrency(credit.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {formatCurrency(credit.balance)}
                    </td>
                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" data-testid={`button-vendor-credit-actions-${credit.id}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => setLocation(`/vendor-credits/${credit.id}/edit`)}
                            data-testid={`action-edit-${credit.id}`}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem data-testid={`action-clone-${credit.id}`}>
                            <FileText className="mr-2 h-4 w-4" />
                            Clone
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(credit.id)}
                            data-testid={`action-delete-${credit.id}`}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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
          </div>
        )}
      </div>

      {selectedCredit && (
        <div className="flex-1 flex flex-col overflow-hidden bg-muted/20">
          <div className="flex items-center justify-between gap-2 p-3 border-b bg-background">
            <h2 className="font-semibold text-lg">{selectedCredit.creditNumber}</h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={() => setLocation(`/vendor-credits/${selectedCredit.id}/edit`)}
                data-testid="button-edit-credit"
              >
                <Edit className="h-4 w-4" /> Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1" data-testid="button-pdf-print">
                    <Printer className="h-4 w-4" /> PDF/Print
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Print</DropdownMenuItem>
                  <DropdownMenuItem>Download PDF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" data-testid="button-apply-to-bills">
                Apply to Bills
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="button-more-actions">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Clone</DropdownMenuItem>
                  <DropdownMenuItem>Send Email</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => handleDelete(selectedCredit.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedCredit(null)}
                data-testid="button-close-detail"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <Tabs defaultValue="document" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="document">Document</TabsTrigger>
                <TabsTrigger value="journal">Journal</TabsTrigger>
              </TabsList>

              <TabsContent value="document">
                <Card className="bg-white dark:bg-card">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="absolute top-0 left-0 -rotate-45 origin-center transform -translate-x-6 translate-y-8">
                        <Badge className="bg-blue-500 text-white px-6 py-1 text-xs">
                          {selectedCredit.status}
                        </Badge>
                      </div>
                      
                      <div className="p-6 pt-12">
                        <div className="flex justify-between items-start mb-8">
                          <div>
                            <h2 className="text-2xl font-bold text-primary mb-2">SkilltonIT</h2>
                            <p className="text-sm text-muted-foreground">SkilltonIT</p>
                            <p className="text-sm text-muted-foreground">Hinjewadi - Wakad road</p>
                            <p className="text-sm text-muted-foreground">Hinjawadi</p>
                            <p className="text-sm text-muted-foreground">Pune Maharashtra 411057</p>
                            <p className="text-sm text-muted-foreground">India</p>
                            <p className="text-sm text-muted-foreground">GSTIN 27AATPM4585L1ZH</p>
                            <p className="text-sm text-muted-foreground">Sales.SkilltonIT@skilltonit.com</p>
                            <p className="text-sm text-muted-foreground">www.skilltonit.com</p>
                          </div>
                          <div className="text-right">
                            <h1 className="text-2xl font-bold text-muted-foreground mb-2">VENDOR CREDITS</h1>
                            <p className="text-sm text-muted-foreground">CreditNote# {selectedCredit.creditNumber}</p>
                            <div className="mt-4 bg-primary/10 px-4 py-3 rounded">
                              <p className="text-xs text-muted-foreground">Credits Remaining</p>
                              <p className="text-xl font-bold">{formatCurrency(selectedCredit.balance)}</p>
                            </div>
                          </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="grid grid-cols-2 gap-8 mb-8">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Vendor Address</h3>
                            <p className="text-sm font-semibold text-primary uppercase">{selectedCredit.vendorName}</p>
                            {(() => {
                              const vendor = getVendorDetails(selectedCredit.vendorId);
                              if (vendor?.billingAddress) {
                                return (
                                  <>
                                    {vendor.billingAddress.attention && (
                                      <p className="text-sm text-muted-foreground">{vendor.billingAddress.attention}</p>
                                    )}
                                    {vendor.billingAddress.street1 && (
                                      <p className="text-sm text-muted-foreground">{vendor.billingAddress.street1}</p>
                                    )}
                                    {vendor.billingAddress.city && (
                                      <p className="text-sm text-muted-foreground">{vendor.billingAddress.city}</p>
                                    )}
                                    {vendor.billingAddress.state && (
                                      <p className="text-sm text-muted-foreground">{vendor.billingAddress.state}</p>
                                    )}
                                    {vendor.billingAddress.pinCode && (
                                      <p className="text-sm text-muted-foreground">{vendor.billingAddress.pinCode}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground">India</p>
                                    {vendor.gstin && (
                                      <p className="text-sm text-muted-foreground">GSTIN {vendor.gstin}</p>
                                    )}
                                  </>
                                );
                              }
                              return <p className="text-sm text-muted-foreground">India</p>;
                            })()}
                          </div>
                          <div className="text-right">
                            <div className="inline-block text-left">
                              <p className="text-sm"><span className="text-muted-foreground">Date:</span> {formatDate(selectedCredit.date)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-lg overflow-hidden mb-6">
                          <table className="w-full">
                            <thead className="bg-primary text-primary-foreground">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium">#</th>
                                <th className="px-4 py-2 text-left text-xs font-medium">Item & Description</th>
                                <th className="px-4 py-2 text-center text-xs font-medium">HSN/SAC</th>
                                <th className="px-4 py-2 text-center text-xs font-medium">Qty</th>
                                <th className="px-4 py-2 text-right text-xs font-medium">Rate</th>
                                <th className="px-4 py-2 text-right text-xs font-medium">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedCredit.items.map((item, index) => (
                                <tr key={item.id} className="border-b">
                                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                                  <td className="px-4 py-3 text-sm">
                                    <div>
                                      <p className="font-medium">{item.itemName}</p>
                                      {item.description && (
                                        <p className="text-xs text-muted-foreground">{item.description}</p>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-center">{item.hsnSac || '-'}</td>
                                  <td className="px-4 py-3 text-sm text-center">{item.quantity}</td>
                                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(parseFloat(item.rate.toString()))}</td>
                                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(item.amount)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex justify-end mb-6">
                          <div className="w-72">
                            <div className="flex justify-between py-2 text-sm">
                              <span className="text-muted-foreground">Sub Total</span>
                              <span className="font-medium">{formatCurrency(selectedCredit.subTotal)}</span>
                            </div>
                            {(() => {
                              const { cgst, sgst } = calculateTaxDetails(selectedCredit);
                              return (
                                <>
                                  {cgst > 0 && (
                                    <div className="flex justify-between py-2 text-sm">
                                      <span className="text-muted-foreground">CGST (9%)</span>
                                      <span className="font-medium">{formatCurrency(cgst)}</span>
                                    </div>
                                  )}
                                  {sgst > 0 && (
                                    <div className="flex justify-between py-2 text-sm">
                                      <span className="text-muted-foreground">SGST (9%)</span>
                                      <span className="font-medium">{formatCurrency(sgst)}</span>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                            {(selectedCredit.discountAmount || 0) > 0 && (
                              <div className="flex justify-between py-2 text-sm">
                                <span className="text-muted-foreground">Discount</span>
                                <span className="font-medium text-red-500">-{formatCurrency(selectedCredit.discountAmount || 0)}</span>
                              </div>
                            )}
                            <Separator className="my-2" />
                            <div className="flex justify-between py-2 text-sm font-semibold">
                              <span>Total</span>
                              <span className="text-primary">{formatCurrency(selectedCredit.amount)}</span>
                            </div>
                            <div className="flex justify-between py-2 bg-green-50 dark:bg-green-950 px-3 rounded text-sm">
                              <span className="font-medium">Credits Remaining</span>
                              <span className="font-bold text-green-600">{formatCurrency(selectedCredit.balance)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-12 border-t pt-4">
                          <p className="text-sm text-muted-foreground">Authorized Signature ____________________</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="journal">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">INR</Badge>
                      <span className="text-sm text-muted-foreground">Amount is displayed in your base currency</span>
                    </div>
                    
                    <h3 className="font-semibold mb-4">Vendor Credits</h3>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Account</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Debit</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Credit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const { entries, totalDebit, totalCredit } = getJournalEntries(selectedCredit);
                            return (
                              <>
                                {entries.map((entry, index) => (
                                  <tr key={index} className="border-b">
                                    <td className="px-4 py-3 text-sm">{entry.account}</td>
                                    <td className="px-4 py-3 text-sm text-right">
                                      {entry.debit > 0 ? formatCurrency(entry.debit) : '0.00'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right">
                                      {entry.credit > 0 ? formatCurrency(entry.credit) : '0.00'}
                                    </td>
                                  </tr>
                                ))}
                                <tr className="bg-muted/30 font-semibold">
                                  <td className="px-4 py-3 text-sm"></td>
                                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(totalDebit)}</td>
                                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(totalCredit)}</td>
                                </tr>
                              </>
                            );
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vendor Credit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this vendor credit? This action cannot be undone.
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
