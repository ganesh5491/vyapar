import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { X, Check, ChevronsUpDown, Search, HelpCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const itemSchema = z.object({
  type: z.enum(["goods", "service"]),
  name: z.string().min(1, "Item Name is required"),
  unit: z.string().optional(),
  hsnSac: z.string().optional(),
  taxPreference: z.string().default("taxable"),
  exemptionReason: z.string().optional(),
  
  sellable: z.boolean().default(true),
  sellingPrice: z.string().optional(),
  salesAccount: z.string().default("sales"),
  salesDescription: z.string().optional(),
  
  purchasable: z.boolean().default(true),
  costPrice: z.string().optional(),
  purchaseAccount: z.string().default("cost_of_goods"),
  purchaseDescription: z.string().optional(),
  preferredVendor: z.string().optional(),
  
  intraStateTaxRate: z.string().default("gst18"),
  interStateTaxRate: z.string().default("igst18"),
});

type ItemFormValues = z.infer<typeof itemSchema>;

const units = [
  { label: "g (Grams)", value: "g" },
  { label: "in (Inches)", value: "in" },
  { label: "kg (Kilograms)", value: "kg" },
  { label: "km (Kilometers)", value: "km" },
  { label: "lb (Pounds)", value: "lb" },
  { label: "mg (Milli Grams)", value: "mg" },
  { label: "ml (Milli Litre)", value: "ml" },
  { label: "m (Meter)", value: "m" },
  { label: "pcs (Pieces)", value: "pcs" },
];

const taxPreferences = [
  { label: "Taxable", value: "taxable" },
  { label: "Non-Taxable", value: "non_taxable" },
  { label: "Out of Scope", value: "out_of_scope" },
  { label: "Non-GST Supply", value: "non_gst" },
];

const exemptionReasons = [
  { label: "Exempt under section 10", value: "section_10" },
  { label: "Exempt under section 11", value: "section_11" },
  { label: "Exempt supply under notification", value: "notification" },
  { label: "Other exemption", value: "other" },
];

const salesAccounts = [
  { label: "Sales", value: "sales" },
  { label: "General Income", value: "general_income" },
  { label: "Other Charges", value: "other_charges" },
  { label: "Interest Income", value: "interest_income" },
];

const purchaseAccounts = [
  { label: "Cost of Goods Sold", value: "cost_of_goods" },
  { label: "Job Costing", value: "job_costing" },
  { label: "Materials", value: "materials" },
];

const vendors = [
  { label: "ABC Suppliers", value: "abc" },
  { label: "XYZ Trading Co.", value: "xyz" },
  { label: "Tech Solutions", value: "tech" },
];

export default function ProductEdit() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/items/:id/edit");
  const { toast } = useToast();
  const [unitOpen, setUnitOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      type: "goods",
      name: "",
      taxPreference: "taxable",
      sellable: true,
      purchasable: true,
      salesAccount: "sales",
      purchaseAccount: "cost_of_goods",
      intraStateTaxRate: "gst18",
      interStateTaxRate: "igst18",
    },
  });

  useEffect(() => {
    if (params?.id) {
      fetchItem(params.id);
    }
  }, [params?.id]);

  const fetchItem = async (id: string) => {
    try {
      const response = await fetch(`/api/items/${id}`);
      if (response.ok) {
        const item = await response.json();
        form.reset({
          type: item.type || "goods",
          name: item.name || "",
          unit: item.usageUnit || "",
          hsnSac: item.hsnSac || "",
          taxPreference: item.taxPreference || "taxable",
          sellable: true,
          sellingPrice: item.rate?.replace("₹", "") || "",
          salesAccount: item.salesAccount || "sales",
          salesDescription: item.description || "",
          purchasable: true,
          costPrice: item.purchaseRate?.replace("₹", "") || "",
          purchaseAccount: item.purchaseAccount || "cost_of_goods",
          purchaseDescription: item.purchaseDescription || "",
          intraStateTaxRate: item.intraStateTax || "gst18",
          interStateTaxRate: item.interStateTax || "igst18",
        });
      } else {
        toast({
          title: "Error",
          description: "Item not found",
          variant: "destructive",
        });
        setLocation("/items");
      }
    } catch (error) {
      console.error("Failed to fetch item:", error);
      setLocation("/items");
    } finally {
      setLoading(false);
    }
  };

  const itemType = form.watch("type");
  const taxPreference = form.watch("taxPreference");
  const sellable = form.watch("sellable");
  const purchasable = form.watch("purchasable");

  const onSubmit = async (data: ItemFormValues) => {
    if (!params?.id) return;
    
    try {
      const itemData = {
        name: data.name,
        type: data.type,
        hsnSac: data.hsnSac || "",
        usageUnit: data.unit || "",
        rate: data.sellingPrice || "0.00",
        purchaseRate: data.costPrice || "0.00",
        description: data.salesDescription || "",
        purchaseDescription: data.purchaseDescription || "",
        taxPreference: data.taxPreference,
        intraStateTax: data.intraStateTaxRate,
        interStateTax: data.interStateTaxRate,
        salesAccount: data.salesAccount,
        purchaseAccount: data.purchaseAccount,
      };
      
      const response = await fetch(`/api/items/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      
      if (response.ok) {
        toast({
          title: "Item Updated",
          description: "The item has been successfully updated.",
        });
        setLocation("/items");
      } else {
        throw new Error("Failed to update item");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <p className="text-slate-600">Loading item...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/20">
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h1 className="text-xl font-semibold text-slate-900">Edit Item</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation("/items")}
            className="h-8 w-8"
            data-testid="button-close-edit"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-8">
                    <div className="text-slate-600 min-w-[100px] flex items-center gap-1 text-sm font-medium">
                      Type
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select whether this is a physical product (Goods) or a service</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="goods" id="goods-edit" className="border-blue-600 text-blue-600" />
                          <Label htmlFor="goods-edit" className="font-normal cursor-pointer">Goods</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="service" id="service-edit" className="border-blue-600 text-blue-600" />
                          <Label htmlFor="service-edit" className="font-normal cursor-pointer">Service</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-[120px_1fr] items-start gap-4">
                    <FormLabel className="text-red-500 pt-2.5">Name*</FormLabel>
                    <div>
                      <FormControl>
                        <Input {...field} className="bg-white border-blue-500 focus:border-blue-600" data-testid="input-item-name" />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-[120px_1fr] items-start gap-4">
                    <div className="text-slate-600 pt-2.5 flex items-center gap-1 text-sm font-medium">
                      Unit
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the unit of measurement for this item</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div>
                      <Popover open={unitOpen} onOpenChange={setUnitOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between font-normal bg-white",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? units.find((unit) => unit.value === field.value)?.label
                                : "Select unit..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search" />
                            <CommandList>
                              <CommandEmpty>No unit found.</CommandEmpty>
                              <CommandGroup>
                                {units.map((unit) => (
                                  <CommandItem
                                    value={unit.label}
                                    key={unit.value}
                                    onSelect={() => {
                                      form.setValue("unit", unit.value);
                                      setUnitOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        unit.value === field.value ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {unit.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                              <CommandSeparator />
                              <CommandGroup>
                                <CommandItem className="text-blue-600 cursor-pointer">
                                  <Settings className="mr-2 h-4 w-4" />
                                  Configure Units
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hsnSac"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-[120px_1fr] items-start gap-4">
                    <FormLabel className="text-slate-600 pt-2.5">
                      {itemType === "goods" ? "HSN Code" : "SAC"}
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input {...field} className="bg-white pr-10" data-testid="input-hsn-sac" />
                      </FormControl>
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 cursor-pointer" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxPreference"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-[120px_1fr] items-start gap-4">
                    <FormLabel className="text-red-500 pt-2.5">Tax Preference *</FormLabel>
                    <div>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select tax preference" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {taxPreferences.map((pref) => (
                            <SelectItem key={pref.value} value={pref.value}>
                              {pref.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormItem>
                )}
              />

              {taxPreference === "non_gst" && (
                <FormField
                  control={form.control}
                  name="exemptionReason"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-[120px_1fr] items-start gap-4">
                      <div className="text-red-500 pt-2.5 flex items-center gap-1 text-sm font-medium">
                        Exemption Reason
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Select the reason for exemption</p>
                          </TooltipContent>
                        </Tooltip>
                        *
                      </div>
                      <div>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select exemption reason" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {exemptionReasons.map((reason) => (
                              <SelectItem key={reason.value} value={reason.value}>
                                {reason.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">Sales Information</h3>
                    <FormField
                      control={form.control}
                      name="sellable"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <Label className="font-normal text-sm">Sellable</Label>
                        </FormItem>
                      )}
                    />
                  </div>

                  {sellable && (
                    <>
                      <FormField
                        control={form.control}
                        name="sellingPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-red-500">Selling Price*</FormLabel>
                            <div className="flex">
                              <span className="bg-slate-100 border border-r-0 border-slate-300 rounded-l-md px-3 py-2 text-sm text-slate-600">INR</span>
                              <FormControl>
                                <Input {...field} className="rounded-l-none bg-white" placeholder="0.00" data-testid="input-selling-price" />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="salesAccount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-red-500">Account*</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {salesAccounts.map((acc) => (
                                  <SelectItem key={acc.value} value={acc.value}>
                                    {acc.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="salesDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-600">Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} className="bg-white min-h-[80px] resize-none" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">Purchase Information</h3>
                    <FormField
                      control={form.control}
                      name="purchasable"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <Label className="font-normal text-sm">Purchasable</Label>
                        </FormItem>
                      )}
                    />
                  </div>

                  {purchasable && (
                    <>
                      <FormField
                        control={form.control}
                        name="costPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-red-500">Cost Price*</FormLabel>
                            <div className="flex">
                              <span className="bg-slate-100 border border-r-0 border-slate-300 rounded-l-md px-3 py-2 text-sm text-slate-600">INR</span>
                              <FormControl>
                                <Input {...field} className="rounded-l-none bg-white" placeholder="0.00" data-testid="input-cost-price" />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="purchaseAccount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-red-500">Account*</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {purchaseAccounts.map((acc) => (
                                  <SelectItem key={acc.value} value={acc.value}>
                                    {acc.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="purchaseDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-600">Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} className="bg-white min-h-[80px] resize-none" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferredVendor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-600">Preferred Vendor</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white">
                                  <SelectValue placeholder="Select vendor..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {vendors.map((vendor) => (
                                  <SelectItem key={vendor.value} value={vendor.value}>
                                    {vendor.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </div>

              {taxPreference === "taxable" && (
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-semibold text-slate-800">Default Tax Rates</h3>
                    <Settings className="h-4 w-4 text-slate-400 cursor-pointer hover:text-slate-600" />
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-[150px_1fr] gap-4">
                      <span className="text-slate-600">Intra State Tax Rate</span>
                      <span className="text-slate-800">GST18 (18 %)</span>
                    </div>
                    <div className="grid grid-cols-[150px_1fr] gap-4">
                      <span className="text-slate-600">Inter State Tax Rate</span>
                      <span className="text-slate-800">IGST18 (18 %)</span>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </div>

        <div className="border-t border-slate-200 p-4 bg-white flex items-center gap-3">
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            className="bg-blue-600 hover:bg-blue-700"
            data-testid="button-save-item"
          >
            Save
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setLocation("/items")}
            data-testid="button-cancel-edit"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
