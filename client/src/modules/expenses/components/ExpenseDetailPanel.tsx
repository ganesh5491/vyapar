import { X, Edit, Printer, MoreHorizontal, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Expense {
    id: string;
    expenseNumber: string;
    date: string;
    expenseAccount: string;
    amount: number;
    currency: string;
    paidThrough: string;
    expenseType: string;
    sac: string;
    vendorId: string;
    vendorName: string;
    gstTreatment: string;
    sourceOfSupply: string;
    destinationOfSupply: string;
    reverseCharge: boolean;
    tax: string;
    taxAmount: number;
    amountIs: string;
    invoiceNumber: string;
    notes: string;
    customerId: string;
    customerName: string;
    reportingTags: string[];
    isBillable: boolean;
    status: string;
    attachments: string[];
    createdAt: string;
    updatedAt: string;
}

interface ExpenseDetailPanelProps {
    expense: Expense;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function ExpenseDetailPanel({
    expense,
    onClose,
    onEdit,
    onDelete,
}: ExpenseDetailPanelProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <div className="h-full flex flex-col bg-white border-l border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Expense Details</h2>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={onEdit}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Printer className="h-4 w-4 mr-2" />
                                Print
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={onDelete}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Expense Amount */}
                <div className="space-y-2">
                    <div className="text-sm text-slate-500">Expense Amount</div>
                    <div className="text-3xl font-bold text-red-600">
                        {formatCurrency(expense.amount)}
                        <span className="text-sm text-slate-500 ml-2">on {formatDate(expense.date)}</span>
                    </div>
                    <Badge variant="outline" className="bg-slate-100 text-slate-700 border-0">
                        {expense.isBillable ? 'BILLABLE' : 'NON-BILLABLE'}
                    </Badge>
                </div>

                <Separator />

                {/* Expense Account Badge */}
                <div>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
                        {expense.expenseAccount}
                    </Badge>
                </div>

                {/* Paid Through */}
                <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">Paid Through</div>
                    <div className="text-sm text-amber-600">{expense.paidThrough || 'Undeposited Funds'}</div>
                </div>

                {/* Tax */}
                <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">Tax</div>
                    <div className="text-sm text-slate-900">
                        {expense.tax || 'IGST'} [ {expense.taxAmount ? `${expense.taxAmount}%` : '0%'} ]
                    </div>
                </div>

                {/* Tax Amount */}
                <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">Tax Amount</div>
                    <div className="text-sm text-slate-900">
                        {formatCurrency(expense.taxAmount || 0)} [ Exclusive ]
                    </div>
                </div>

                {/* Ref # */}
                <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">Ref #</div>
                    <div className="text-sm text-slate-900">{expense.invoiceNumber || expense.expenseNumber}</div>
                </div>

                {/* Paid To */}
                <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">Paid To</div>
                    <div className="text-sm text-blue-600 hover:underline cursor-pointer">
                        {expense.vendorName || '-'}
                    </div>
                </div>

                {/* GST Treatment */}
                <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">GST Treatment</div>
                    <div className="text-sm text-slate-900">
                        {expense.gstTreatment || 'Registered Business - Regular'}
                    </div>
                </div>

                {/* GSTIN / UIN */}
                <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">GSTIN / UIN</div>
                    <div className="text-sm text-slate-900">{expense.vendorId || '-'}</div>
                </div>

                {/* Source of Supply */}
                <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">Source of Supply</div>
                    <div className="text-sm text-slate-900">{expense.sourceOfSupply || 'Uttar Pradesh'}</div>
                </div>

                {/* Destination of Supply */}
                <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">Destination of Supply</div>
                    <div className="text-sm text-slate-900">{expense.destinationOfSupply || 'Maharashtra'}</div>
                </div>

                <Separator />

                {/* Tabs for Journal and Attachments */}
                <Tabs defaultValue="journal" className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="journal" className="flex-1">Journal</TabsTrigger>
                    </TabsList>
                    <TabsContent value="journal" className="space-y-4 mt-4">
                        <div className="text-sm text-green-600 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                            Amount is displayed in your base currency INR
                        </div>

                        {/* Journal Table */}
                        <div className="border rounded-lg overflow-hidden">
                            <div className="bg-slate-50 px-4 py-2 font-semibold text-sm text-slate-700">
                                Expense
                            </div>
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-y">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">ACCOUNT</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">DEBIT</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase">CREDIT</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="px-4 py-2">{expense.paidThrough || 'Undeposited Funds'}</td>
                                        <td className="px-4 py-2 text-right">0.00</td>
                                        <td className="px-4 py-2 text-right">{formatCurrency(expense.amount).replace('₹', '')}</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2">Input IGST</td>
                                        <td className="px-4 py-2 text-right">0.00</td>
                                        <td className="px-4 py-2 text-right">0.00</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2">{expense.expenseAccount}</td>
                                        <td className="px-4 py-2 text-right">{formatCurrency(expense.amount).replace('₹', '')}</td>
                                        <td className="px-4 py-2 text-right">0.00</td>
                                    </tr>
                                    <tr className="font-semibold bg-slate-50">
                                        <td className="px-4 py-2">Total</td>
                                        <td className="px-4 py-2 text-right">{formatCurrency(expense.amount).replace('₹', '')}</td>
                                        <td className="px-4 py-2 text-right">{formatCurrency(expense.amount).replace('₹', '')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
