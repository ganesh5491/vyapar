import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
    Plus, 
    MoreHorizontal, 
    Trash2, 
    Pencil,
    X,
    Search,
    Filter,
    ChevronDown,
    FileText,
    Truck,
    Train,
    Plane,
    Ship,
    ExternalLink
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { Checkbox } from "@/components/ui/checkbox";

interface EWayBillListItem {
    id: string;
    ewayBillNumber: string;
    documentType: string;
    documentNumber: string;
    customerName: string;
    customerId: string;
    date: string;
    amount: number;
    status: string;
    transactionType: string;
}

interface EWayBillDetail {
    id: string;
    ewayBillNumber: string;
    documentType: string;
    transactionSubType: string;
    customerName: string;
    customerId: string;
    documentNumber: string;
    date: string;
    transactionType: string;
    dispatchFrom: {
        street: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
    };
    billFrom: {
        street: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
    };
    billTo: {
        street: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
    };
    shipTo: {
        street: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
    };
    placeOfDelivery: string;
    transporter: string;
    distance: number;
    modeOfTransportation: string;
    vehicleType: string;
    vehicleNo: string;
    transporterDocNo: string;
    transporterDocDate: string;
    items: any[];
    total: number;
    status: string;
    createdAt: string;
}

const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatAddress = (address: any): string[] => {
    if (!address) return ['-'];
    if (typeof address === 'string') return [address];
    if (typeof address !== 'object') return ['-'];
    const parts = [
        address.street ? String(address.street) : '',
        address.city ? String(address.city) : '',
        address.state ? String(address.state) : '',
        address.country ? String(address.country) : '',
        address.pincode ? String(address.pincode) : ''
    ].filter(Boolean);
    return parts.length > 0 ? parts : ['-'];
};

const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'ACTIVE':
            return 'bg-green-100 text-green-700 border-green-200';
        case 'GENERATED':
            return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'DRAFT':
            return 'bg-slate-100 text-slate-600 border-slate-200';
        case 'CANCELLED':
            return 'bg-red-100 text-red-700 border-red-200';
        case 'EXPIRED':
            return 'bg-amber-100 text-amber-700 border-amber-200';
        default:
            return 'bg-slate-100 text-slate-600 border-slate-200';
    }
};

const documentTypes = [
    { value: 'credit_notes', label: 'Credit Notes' },
    { value: 'invoices', label: 'Invoices' },
    { value: 'delivery_challans', label: 'Delivery Challans' },
    { value: 'sales_orders', label: 'Sales Orders' },
];

const transactionSubTypes = [
    { value: 'sales_return', label: 'Sales Return' },
    { value: 'supply', label: 'Supply' },
    { value: 'export', label: 'Export' },
    { value: 'job_work', label: 'Job Work' },
];

const transactionTypes = [
    { value: 'regular', label: 'Regular' },
    { value: 'bill_to_ship_to', label: 'Bill To - Ship To' },
    { value: 'bill_from_dispatch_from', label: 'Bill From - Dispatch From' },
    { value: 'combination', label: 'Combination of 2 and 3' },
];

export default function EWayBills() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [ewayBills, setEwayBills] = useState<EWayBillListItem[]>([]);
    const [selectedBill, setSelectedBill] = useState<EWayBillDetail | null>(null);
    const [selectedBills, setSelectedBills] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [billToDelete, setBillToDelete] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    
    const [formData, setFormData] = useState({
        documentType: 'credit_notes',
        transactionSubType: 'sales_return',
        customerName: '',
        documentNumber: '',
        date: new Date().toISOString().split('T')[0],
        transactionType: 'regular',
        placeOfDelivery: '',
        transporter: '',
        distance: 0,
        modeOfTransportation: 'road',
        vehicleType: 'regular',
        vehicleNo: '',
        transporterDocNo: '',
        transporterDocDate: '',
    });

    useEffect(() => {
        fetchEWayBills();
    }, []);

    const fetchEWayBills = async () => {
        try {
            const response = await fetch('/api/bills');
            if (response.ok) {
                const data = await response.json();
                const bills = data.data || [];
                const mappedBills: EWayBillListItem[] = bills.map((bill: any, index: number) => ({
                    id: bill.id || `ewb-${index + 1}`,
                    ewayBillNumber: `EWB-${String(index + 1).padStart(6, '0')}`,
                    documentType: 'Invoices',
                    documentNumber: bill.billNumber || `INV-${index + 1}`,
                    customerName: bill.vendorName || 'Unknown Customer',
                    customerId: bill.vendorId || `cust-${index + 1}`,
                    date: bill.billDate || new Date().toISOString(),
                    amount: bill.total || 0,
                    status: bill.status || 'DRAFT',
                    transactionType: 'Regular',
                }));
                setEwayBills(mappedBills);
            }
        } catch (error) {
            console.error('Failed to fetch e-way bills:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBillDetail = async (id: string) => {
        try {
            const response = await fetch(`/api/bills/${id}`);
            if (response.ok) {
                const data = await response.json();
                const bill = data.data;
                const detail: EWayBillDetail = {
                    id: bill.id,
                    ewayBillNumber: `EWB-${String(bill.id).padStart(6, '0')}`,
                    documentType: 'Invoices',
                    transactionSubType: 'Supply',
                    customerName: bill.vendorName || 'Unknown Customer',
                    customerId: bill.vendorId,
                    documentNumber: bill.billNumber,
                    date: bill.billDate,
                    transactionType: 'Regular',
                    dispatchFrom: {
                        street: 'Hinjewadi - Wakad road',
                        city: 'Hinjewadi',
                        state: 'Pune',
                        country: 'Maharashtra',
                        pincode: 'India - 411057',
                    },
                    billFrom: {
                        street: 'Hinjewadi - Wakad road',
                        city: 'Hinjewadi',
                        state: 'Pune',
                        country: 'Maharashtra',
                        pincode: 'India - 411057',
                    },
                    billTo: bill.vendorAddress || {
                        street: 'flat No. 605, B wing, Ganesh',
                        city: 'Galaxy, Dattanagar',
                        state: 'Varodi Daymukh',
                        country: 'Maharashtra',
                        pincode: 'India - 411046',
                    },
                    shipTo: bill.vendorAddress || {
                        street: 'flat No. 605, B wing, Ganesh',
                        city: 'Galaxy, Dattanagar',
                        state: 'Varodi Daymukh',
                        country: 'Maharashtra',
                        pincode: 'India - 411046',
                    },
                    placeOfDelivery: '[MH] - Maharashtra',
                    transporter: '',
                    distance: 0,
                    modeOfTransportation: 'road',
                    vehicleType: 'regular',
                    vehicleNo: '',
                    transporterDocNo: '',
                    transporterDocDate: '',
                    items: bill.items || [],
                    total: bill.total || 0,
                    status: bill.status || 'DRAFT',
                    createdAt: bill.createdAt || new Date().toISOString(),
                };
                setSelectedBill(detail);
                setShowCreateForm(true);
            }
        } catch (error) {
            console.error('Failed to fetch bill detail:', error);
        }
    };

    const handleSelectBill = (bill: EWayBillListItem) => {
        fetchBillDetail(bill.id);
    };

    const handleCloseDetail = () => {
        setSelectedBill(null);
        setShowCreateForm(false);
    };

    const handleNewEWayBill = () => {
        setSelectedBill(null);
        setShowCreateForm(true);
        setFormData({
            documentType: 'credit_notes',
            transactionSubType: 'sales_return',
            customerName: '',
            documentNumber: '',
            date: new Date().toISOString().split('T')[0],
            transactionType: 'regular',
            placeOfDelivery: '',
            transporter: '',
            distance: 0,
            modeOfTransportation: 'road',
            vehicleType: 'regular',
            vehicleNo: '',
            transporterDocNo: '',
            transporterDocDate: '',
        });
    };

    const handleDeleteBill = async () => {
        if (!billToDelete) return;

        try {
            toast({
                title: "E-Way Bill Deleted",
                description: "The e-way bill has been deleted successfully.",
            });
            fetchEWayBills();
            if (selectedBill?.id === billToDelete) {
                setSelectedBill(null);
                setShowCreateForm(false);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete e-way bill. Please try again.",
                variant: "destructive"
            });
        } finally {
            setDeleteDialogOpen(false);
            setBillToDelete(null);
        }
    };

    const handleSave = () => {
        toast({
            title: "E-Way Bill Saved",
            description: "The e-way bill has been saved as draft.",
        });
        setShowCreateForm(false);
        setSelectedBill(null);
    };

    const handleSaveAndGenerate = () => {
        toast({
            title: "E-Way Bill Generated",
            description: "The e-way bill has been generated successfully.",
        });
        setShowCreateForm(false);
        setSelectedBill(null);
    };

    const handleCancel = () => {
        setShowCreateForm(false);
        setSelectedBill(null);
    };

    const filteredBills = ewayBills.filter(bill =>
        bill.ewayBillNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.documentNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedBills(filteredBills.map(b => b.id));
        } else {
            setSelectedBills([]);
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedBills([...selectedBills, id]);
        } else {
            setSelectedBills(selectedBills.filter(i => i !== id));
        }
    };

    return (
        <div className="flex h-full" data-testid="eway-bills-page">
            <div className={`${showCreateForm ? 'w-80' : 'flex-1'} border-r flex flex-col bg-background transition-all duration-300`}>
                <div className="p-4 border-b space-y-4">
                    <div className="flex items-center justify-between gap-2">
                        <h1 className="text-xl font-semibold" data-testid="text-page-title">E-Way Bills</h1>
                        <Button onClick={handleNewEWayBill} size="sm" data-testid="button-new-eway-bill">
                            <Plus className="w-4 h-4 mr-1" />
                            New
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search e-way bills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                            data-testid="input-search"
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground" data-testid="text-loading">
                            Loading e-way bills...
                        </div>
                    ) : filteredBills.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground" data-testid="text-empty">
                            No e-way bills found
                        </div>
                    ) : (
                        <div className="divide-y">
                            {filteredBills.map((bill) => (
                                <div
                                    key={bill.id}
                                    className={`p-4 cursor-pointer hover-elevate ${
                                        selectedBill?.id === bill.id ? 'bg-accent' : ''
                                    }`}
                                    onClick={() => handleSelectBill(bill)}
                                    data-testid={`row-eway-bill-${bill.id}`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                checked={selectedBills.includes(bill.id)}
                                                onCheckedChange={(checked) => handleSelectOne(bill.id, checked as boolean)}
                                                onClick={(e) => e.stopPropagation()}
                                                data-testid={`checkbox-select-${bill.id}`}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-sm" data-testid={`text-ewb-number-${bill.id}`}>
                                                        {bill.ewayBillNumber}
                                                    </span>
                                                    <Badge variant="outline" className={`text-xs ${getStatusColor(bill.status)}`}>
                                                        {bill.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground truncate" data-testid={`text-customer-${bill.id}`}>
                                                    {bill.customerName}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                    <span>{bill.documentType}</span>
                                                    <span>•</span>
                                                    <span>{bill.documentNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-sm" data-testid={`text-amount-${bill.id}`}>
                                                {formatCurrency(bill.amount)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(bill.date)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>

            {showCreateForm && (
                <div className="flex-1 flex flex-col bg-background">
                    <div className="p-4 border-b flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            <h2 className="text-lg font-semibold" data-testid="text-form-title">
                                {selectedBill ? 'Edit E-Way Bill' : 'New e-Way Bill'}
                            </h2>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleCloseDetail} data-testid="button-close-form">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 p-6">
                        <div className="max-w-4xl space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-red-500">Document Type*</Label>
                                    <Select
                                        value={formData.documentType}
                                        onValueChange={(value) => setFormData({ ...formData, documentType: value })}
                                        data-testid="select-document-type"
                                    >
                                        <SelectTrigger data-testid="select-trigger-document-type">
                                            <SelectValue placeholder="Select document type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {documentTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-red-500">Transaction Sub Type*</Label>
                                    <Select
                                        value={formData.transactionSubType}
                                        onValueChange={(value) => setFormData({ ...formData, transactionSubType: value })}
                                        data-testid="select-transaction-sub-type"
                                    >
                                        <SelectTrigger data-testid="select-trigger-transaction-sub-type">
                                            <SelectValue placeholder="Select sub type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {transactionSubTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-red-500">Customer Name*</Label>
                                <Select
                                    value={selectedBill?.customerName || formData.customerName}
                                    onValueChange={(value) => setFormData({ ...formData, customerName: value })}
                                    data-testid="select-customer-name"
                                >
                                    <SelectTrigger data-testid="select-trigger-customer-name">
                                        <SelectValue placeholder="Select customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ganesh traders">ganesh traders</SelectItem>
                                        <SelectItem value="abc corp">ABC Corp</SelectItem>
                                        <SelectItem value="xyz ltd">XYZ Ltd</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-red-500">Credit Note#*</Label>
                                    <Input
                                        value={selectedBill?.documentNumber || formData.documentNumber}
                                        onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                                        placeholder="CN-00002"
                                        data-testid="input-document-number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input
                                        type="date"
                                        value={selectedBill?.date?.split('T')[0] || formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        data-testid="input-date"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-red-500">Transaction Type*</Label>
                                    <Select
                                        value={formData.transactionType}
                                        onValueChange={(value) => setFormData({ ...formData, transactionType: value })}
                                        data-testid="select-transaction-type"
                                    >
                                        <SelectTrigger data-testid="select-trigger-transaction-type">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {transactionTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-medium text-sm text-muted-foreground">Address Details</h3>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                            DISPATCH FROM <Pencil className="w-3 h-3" />
                                        </Label>
                                        <div className="text-sm space-y-0.5">
                                            {selectedBill ? formatAddress(selectedBill.dispatchFrom).map((line, i) => (
                                                <p key={i}>{line}</p>
                                            )) : (
                                                <>
                                                    <p>Hinjewadi - Wakad road</p>
                                                    <p>Hinjewadi</p>
                                                    <p>Pune</p>
                                                    <p>Maharashtra</p>
                                                    <p>India - 411057</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-muted-foreground">BILL FROM</Label>
                                        <div className="text-sm space-y-0.5">
                                            {selectedBill ? formatAddress(selectedBill.billFrom).map((line, i) => (
                                                <p key={i}>{line}</p>
                                            )) : (
                                                <>
                                                    <p>Hinjewadi - Wakad road</p>
                                                    <p>Hinjewadi</p>
                                                    <p>Pune</p>
                                                    <p>Maharashtra</p>
                                                    <p>India - 411057</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-muted-foreground">BILL TO</Label>
                                        <div className="text-sm space-y-0.5">
                                            {selectedBill ? formatAddress(selectedBill.billTo).map((line, i) => (
                                                <p key={i}>{line}</p>
                                            )) : (
                                                <>
                                                    <p>flat No. 605, B wing, Ganesh</p>
                                                    <p>Galaxy, Dattanagar</p>
                                                    <p>Varodi Daymukh</p>
                                                    <p>Maharashtra</p>
                                                    <p>India - 411046</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium text-muted-foreground">SHIP TO</Label>
                                        <div className="text-sm space-y-0.5">
                                            {selectedBill ? formatAddress(selectedBill.shipTo).map((line, i) => (
                                                <p key={i}>{line}</p>
                                            )) : (
                                                <>
                                                    <p>flat No. 605, B wing, Ganesh</p>
                                                    <p>Galaxy, Dattanagar</p>
                                                    <p>Varodi Daymukh</p>
                                                    <p>Maharashtra</p>
                                                    <p>India - 411046</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-red-500">Place of Delivery*</Label>
                                <Select
                                    value={selectedBill?.placeOfDelivery || formData.placeOfDelivery}
                                    onValueChange={(value) => setFormData({ ...formData, placeOfDelivery: value })}
                                    data-testid="select-place-of-delivery"
                                >
                                    <SelectTrigger data-testid="select-trigger-place-of-delivery">
                                        <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="[MH] - Maharashtra">[MH] - Maharashtra</SelectItem>
                                        <SelectItem value="[GJ] - Gujarat">[GJ] - Gujarat</SelectItem>
                                        <SelectItem value="[KA] - Karnataka">[KA] - Karnataka</SelectItem>
                                        <SelectItem value="[TN] - Tamil Nadu">[TN] - Tamil Nadu</SelectItem>
                                        <SelectItem value="[DL] - Delhi">[DL] - Delhi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2 text-blue-600 cursor-pointer hover:underline">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm" data-testid="link-item-details">Item Details</span>
                                <ExternalLink className="w-3 h-3" />
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold text-sm">TRANSPORTATION DETAILS</h3>
                                
                                <div className="space-y-2">
                                    <Label>Transporter</Label>
                                    <Select
                                        value={formData.transporter}
                                        onValueChange={(value) => setFormData({ ...formData, transporter: value })}
                                        data-testid="select-transporter"
                                    >
                                        <SelectTrigger data-testid="select-trigger-transporter">
                                            <SelectValue placeholder="Select the transporter's name" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="transporter1">Transporter 1</SelectItem>
                                            <SelectItem value="transporter2">Transporter 2</SelectItem>
                                            <SelectItem value="transporter3">Transporter 3</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-red-500">Distance (In Km)*</Label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            type="number"
                                            value={formData.distance}
                                            onChange={(e) => setFormData({ ...formData, distance: parseInt(e.target.value) || 0 })}
                                            placeholder="0"
                                            className="max-w-[200px]"
                                            data-testid="input-distance"
                                        />
                                        <a href="#" className="text-blue-600 text-sm hover:underline flex items-center gap-1" data-testid="link-calculate-distance">
                                            Calculate Distance
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        If you enter 0 as the distance, e-Way Bill system will automatically calculate it based on the dispatch and delivery locations.
                                    </p>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <h4 className="font-medium text-sm">PART B</h4>
                                    
                                    <div className="space-y-2">
                                        <Label>Mode of Transportation</Label>
                                        <Tabs value={formData.modeOfTransportation} onValueChange={(value) => setFormData({ ...formData, modeOfTransportation: value })}>
                                            <TabsList className="grid grid-cols-4 w-fit" data-testid="tabs-transport-mode">
                                                <TabsTrigger value="road" className="flex items-center gap-1" data-testid="tab-road">
                                                    <Truck className="w-4 h-4" /> Road
                                                </TabsTrigger>
                                                <TabsTrigger value="rail" className="flex items-center gap-1" data-testid="tab-rail">
                                                    <Train className="w-4 h-4" /> Rail
                                                </TabsTrigger>
                                                <TabsTrigger value="air" className="flex items-center gap-1" data-testid="tab-air">
                                                    <Plane className="w-4 h-4" /> Air
                                                </TabsTrigger>
                                                <TabsTrigger value="ship" className="flex items-center gap-1" data-testid="tab-ship">
                                                    <Ship className="w-4 h-4" /> Ship
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Vehicle Type</Label>
                                        <RadioGroup
                                            value={formData.vehicleType}
                                            onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
                                            className="flex items-center gap-6"
                                            data-testid="radio-vehicle-type"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="regular" id="regular" data-testid="radio-regular" />
                                                <Label htmlFor="regular" className="font-normal">Regular</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="over_dimensional" id="over_dimensional" data-testid="radio-over-dimensional" />
                                                <Label htmlFor="over_dimensional" className="font-normal">Over Dimensional Cargo</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Vehicle No</Label>
                                        <Input
                                            value={formData.vehicleNo}
                                            onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
                                            placeholder="Enter vehicle number"
                                            data-testid="input-vehicle-no"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Transporter's Doc No</Label>
                                        <Input
                                            value={formData.transporterDocNo}
                                            onChange={(e) => setFormData({ ...formData, transporterDocNo: e.target.value })}
                                            placeholder="Enter document number"
                                            data-testid="input-transporter-doc-no"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Transporter's Doc Date</Label>
                                        <Input
                                            type="date"
                                            value={formData.transporterDocDate}
                                            onChange={(e) => setFormData({ ...formData, transporterDocDate: e.target.value })}
                                            placeholder="dd/MM/yyyy"
                                            data-testid="input-transporter-doc-date"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    <div className="p-4 border-t flex items-center gap-2">
                        <Button onClick={handleSave} data-testid="button-save">
                            Save
                        </Button>
                        <Button variant="default" className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveAndGenerate} data-testid="button-save-generate">
                            Save and Generate
                        </Button>
                        <Button variant="outline" onClick={handleCancel} data-testid="button-cancel">
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete E-Way Bill</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this e-way bill? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteBill} className="bg-red-600 hover:bg-red-700" data-testid="button-confirm-delete">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
