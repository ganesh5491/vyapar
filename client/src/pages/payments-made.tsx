import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter, CreditCard, MoreHorizontal, Trash2 } from "lucide-react";
import { usePagination } from "@/hooks/use-pagination";
import { TablePagination } from "@/components/table-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
import { useToast } from "@/hooks/use-toast";

interface PaymentMade {
  id: string;
  paymentNumber: string;
  vendorId: string;
  vendorName: string;
  paymentAmount: number;
  paymentDate: string;
  paymentMode: string;
  paymentType: string;
  status: string;
  reference?: string;
  createdAt: string;
}

export default function PaymentsMade() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);

  const { data: paymentsData, isLoading, refetch } = useQuery<{ success: boolean; data: PaymentMade[] }>({
    queryKey: ['/api/payments-made'],
  });

  const payments = paymentsData?.data || [];

  const filteredPayments = payments.filter(payment =>
    payment.paymentNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.vendorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.reference?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { currentPage, totalPages, totalItems, itemsPerPage, paginatedItems, goToPage } = usePagination(filteredPayments, 10);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleDelete = (id: string) => {
    setPaymentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!paymentToDelete) return;
    try {
      const response = await fetch(`/api/payments-made/${paymentToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        toast({ title: "Payment deleted successfully" });
        refetch();
      } else {
        toast({ title: "Failed to delete payment", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Failed to delete payment", variant: "destructive" });
    } finally {
      setDeleteDialogOpen(false);
      setPaymentToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Paid</Badge>;
      case 'DRAFT':
        return <Badge variant="outline" className="text-slate-600 border-slate-200">Draft</Badge>;
      case 'REFUNDED':
        return <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentTypeBadge = (type: string) => {
    return type === 'vendor_advance' 
      ? <Badge variant="secondary" className="text-xs">Advance</Badge>
      : <Badge variant="secondary" className="text-xs">Bill Payment</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pr-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">Payments Made</h1>
          <p className="text-muted-foreground">Track all payments made to your vendors.</p>
        </div>
        <Button 
          className="gap-2 shadow-lg shadow-primary/20"
          onClick={() => setLocation('/payments-made/new')}
          data-testid="button-record-payment"
        >
          <Plus className="h-4 w-4" /> Record Payment
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search payments..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-payments"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : payments.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2" data-testid="text-payments-empty">No payments recorded</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Record payments made to vendors to keep track of your accounts payable.
            </p>
            <Button 
              className="gap-2"
              onClick={() => setLocation('/payments-made/new')}
              data-testid="button-record-first-payment"
            >
              <Plus className="h-4 w-4" /> Record Your First Payment
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
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Payment #</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Vendor Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mode</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedItems.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                  data-testid={`row-payment-${payment.id}`}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <Checkbox data-testid={`checkbox-payment-${payment.id}`} />
                  </td>
                  <td className="px-4 py-3 text-sm">{formatDate(payment.paymentDate)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-primary">{payment.paymentNumber}</td>
                  <td className="px-4 py-3 text-sm">{payment.vendorName}</td>
                  <td className="px-4 py-3 text-sm">{getPaymentTypeBadge(payment.paymentType)}</td>
                  <td className="px-4 py-3 text-sm capitalize">{payment.paymentMode?.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-sm">{getStatusBadge(payment.status)}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">
                    {formatCurrency(payment.paymentAmount)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" data-testid={`button-payment-actions-${payment.id}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem data-testid={`action-view-${payment.id}`}>View</DropdownMenuItem>
                        <DropdownMenuItem data-testid={`action-edit-${payment.id}`}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(payment.id)}
                          data-testid={`action-delete-${payment.id}`}
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
            <AlertDialogTitle>Delete Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payment? This action cannot be undone.
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
