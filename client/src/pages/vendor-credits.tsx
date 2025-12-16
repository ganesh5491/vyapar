import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter, ReceiptText, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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

interface VendorCredit {
  id: string;
  creditNumber: string;
  vendorId: string;
  vendorName: string;
  date: string;
  amount: number;
  balance: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function VendorCredits() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [creditToDelete, setCreditToDelete] = useState<string | null>(null);

  const { data: vendorCreditsData, isLoading, refetch } = useQuery<{ success: boolean; data: VendorCredit[] }>({
    queryKey: ['/api/vendor-credits'],
  });

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
    credit.vendorName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { currentPage, totalPages, totalItems, itemsPerPage, paginatedItems, goToPage } = usePagination(filteredVendorCredits, 10);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">Vendor Credits</h1>
          <p className="text-muted-foreground">Manage credits received from your vendors.</p>
        </div>
        <Button 
          className="gap-2 shadow-lg shadow-primary/20" 
          onClick={() => setLocation('/vendor-credits/new')}
          data-testid="button-add-vendor-credit"
        >
          <Plus className="h-4 w-4" /> Add Vendor Credit
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendor credits..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-vendor-credits"
          />
        </div>
        <Button variant="outline" className="gap-2" data-testid="button-filter">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : vendorCredits.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ReceiptText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2" data-testid="text-vendor-credits-empty">No vendor credits</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Record credits from vendors for returns or adjustments to apply against future bills.
            </p>
            <Button 
              className="gap-2" 
              onClick={() => setLocation('/vendor-credits/new')}
              data-testid="button-add-first-vendor-credit"
            >
              <Plus className="h-4 w-4" /> Add Your First Vendor Credit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  <Checkbox data-testid="checkbox-select-all" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Credit Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Vendor Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Balance</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedItems.map((credit) => (
                <tr
                  key={credit.id}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                  data-testid={`row-vendor-credit-${credit.id}`}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <Checkbox data-testid={`checkbox-vendor-credit-${credit.id}`} />
                  </td>
                  <td className="px-4 py-3 text-sm">{credit.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-primary">{credit.creditNumber}</td>
                  <td className="px-4 py-3 text-sm">{credit.vendorName}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      credit.status === 'Open' ? 'bg-green-100 text-green-700' :
                      credit.status === 'Closed' ? 'bg-gray-100 text-gray-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {credit.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium">
                    {formatCurrency(credit.amount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    {formatCurrency(credit.balance)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" data-testid={`button-vendor-credit-actions-${credit.id}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem data-testid={`action-edit-${credit.id}`}>Edit</DropdownMenuItem>
                        <DropdownMenuItem data-testid={`action-clone-${credit.id}`}>Clone</DropdownMenuItem>
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
