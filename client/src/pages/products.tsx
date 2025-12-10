import { useState } from "react";
import { useLocation } from "wouter";
import { Plus, MoreHorizontal, ChevronDown, ArrowUpDown, Import, Download, Settings, RefreshCw, RotateCcw, FileText, CheckSquare, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

interface Item {
  id: string;
  name: string;
  purchaseDescription: string;
  purchaseRate: string;
  description: string;
  rate: string;
  hsnSac: string;
  usageUnit: string;
}

const initialItems: Item[] = [
  {
    id: "1",
    name: "Antivirus",
    purchaseDescription: "",
    purchaseRate: "₹0.00",
    description: "",
    rate: "₹0.00",
    hsnSac: "85238020",
    usageUnit: "",
  },
  {
    id: "2",
    name: "Cloud Server",
    purchaseDescription: "",
    purchaseRate: "₹0.00",
    description: "",
    rate: "₹0.00",
    hsnSac: "998315",
    usageUnit: "",
  },
  {
    id: "3",
    name: "EMPLOYEE ACTIVITY MONITORING APP",
    purchaseDescription: "",
    purchaseRate: "₹0.00",
    description: "",
    rate: "₹0.00",
    hsnSac: "",
    usageUnit: "",
  },
  {
    id: "4",
    name: "Mouse",
    purchaseDescription: "Dell / HP / lenovo",
    purchaseRate: "₹0.00",
    description: "Dell / HP / lenovo",
    rate: "₹0.00",
    hsnSac: "84716060",
    usageUnit: "pcs",
  },
  {
    id: "5",
    name: "Software",
    purchaseDescription: "",
    purchaseRate: "₹0.00",
    description: "",
    rate: "₹0.00",
    hsnSac: "",
    usageUnit: "",
  },
];

export default function Products() {
  const [, setLocation] = useLocation();
  const [items] = useState<Item[]>(initialItems);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-slate-900">All Items</h1>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setLocation("/products/new")} 
            className="bg-blue-600 hover:bg-blue-700 gap-1.5 h-9"
          >
            <Plus className="h-4 w-4" /> New
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Sort by
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Name</DropdownMenuItem>
                  <DropdownMenuItem>Purchase Rate</DropdownMenuItem>
                  <DropdownMenuItem>Rate</DropdownMenuItem>
                  <DropdownMenuItem>HSN/SAC</DropdownMenuItem>
                  <DropdownMenuItem>Last Modified Time</DropdownMenuItem>
                  <DropdownMenuItem>Created Time</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem>
                <Import className="mr-2 h-4 w-4" />
                Import Items
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                  <DropdownMenuItem>Export as Excel</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh List
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Column Width
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Update New GST Rates
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CheckSquare className="mr-2 h-4 w-4" />
                Validate HSN/SAC
              </DropdownMenuItem>
              <DropdownMenuItem>
                <History className="mr-2 h-4 w-4" />
                HSN/SAC Update History
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedItems.length === items.length && items.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="font-medium text-slate-600">
                <div className="flex items-center gap-1">
                  NAME
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="font-medium text-slate-600">PURCHASE DESCRIPTION</TableHead>
              <TableHead className="font-medium text-slate-600">PURCHASE RATE</TableHead>
              <TableHead className="font-medium text-slate-600">DESCRIPTION</TableHead>
              <TableHead className="font-medium text-slate-600">RATE</TableHead>
              <TableHead className="font-medium text-slate-600">HSN/SAC</TableHead>
              <TableHead className="font-medium text-slate-600">USAGE UNIT</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="hover:bg-slate-50/50">
                <TableCell>
                  <Checkbox 
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => toggleSelectItem(item.id)}
                  />
                </TableCell>
                <TableCell className="font-medium text-blue-600 hover:underline cursor-pointer">
                  {item.name}
                </TableCell>
                <TableCell className="text-slate-600">{item.purchaseDescription}</TableCell>
                <TableCell className="text-slate-600">{item.purchaseRate}</TableCell>
                <TableCell className="text-slate-600">{item.description}</TableCell>
                <TableCell className="text-slate-600">{item.rate}</TableCell>
                <TableCell className="text-slate-600">{item.hsnSac}</TableCell>
                <TableCell className="text-slate-600">{item.usageUnit}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Clone</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
