import { useState, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Upload, X, Info, Plus, MoreHorizontal, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";

const customerSchema = z.object({
  customerType: z.enum(["business", "individual"]),
  salutation: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyName: z.string().optional(),
  displayName: z.string().min(1, "Display Name is required"),
  email: z.string().email("Invalid email address").or(z.literal("")),
  workPhone: z.string().optional(),
  mobile: z.string().optional(),
  language: z.string().default("English"),

  // Other Details
  gstTreatment: z.string().min(1, "GST Treatment is required"),
  placeOfSupply: z.string().min(1, "Place of Supply is required"),
  pan: z.string().optional(),
  taxPreference: z.enum(["taxable", "tax_exempt"]),
  currency: z.string().default("INR"),
  openingBalance: z.string().optional(),
  paymentTerms: z.string().optional(),
  enablePortal: z.boolean().default(false),

  // Address
  billingAddress: z.object({
    attention: z.string().optional(),
    country: z.string().optional(),
    street1: z.string().optional(),
    street2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    phone: z.string().optional(),
    fax: z.string().optional(),
  }),
  shippingAddress: z.object({
    attention: z.string().optional(),
    country: z.string().optional(),
    street1: z.string().optional(),
    street2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    phone: z.string().optional(),
    fax: z.string().optional(),
  }),

  // Contact Persons
  contactPersons: z.array(z.object({
    salutation: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email").or(z.literal("")),
    workPhone: z.string().optional(),
    mobile: z.string().optional(),
  })),

  remarks: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

const defaultValues: CustomerFormValues = {
  customerType: "business",
  displayName: "",
  email: "",
  language: "English",
  gstTreatment: "",
  placeOfSupply: "",
  taxPreference: "taxable",
  currency: "INR",
  enablePortal: false,
  billingAddress: { street: "", city: "", state: "", country: "", pincode: "" },
  shippingAddress: { street: "", city: "", state: "", country: "", pincode: "" },
  contactPersons: [],
  tags: [],
};

export default function CustomerCreate() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const returnTo = searchParams.get("returnTo");
  const { toast } = useToast();
  const { addCustomer, setPendingCustomerId } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  interface AttachedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    data?: string;
  }

  const [documents, setDocuments] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const maxSize = 10 * 1024 * 1024;
    const maxFiles = 10;

    if (documents.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can only upload up to ${maxFiles} files.`,
        variant: "destructive",
      });
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit.`,
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile: AttachedFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          data: e.target?.result as string,
        };
        setDocuments((prev) => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });

    if (event.target) {
      event.target.value = "";
    }
  };

  const removeFile = (fileId: string) => {
    setDocuments((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues,
  });

  const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({
    control: form.control,
    name: "contactPersons",
  });

  const onSubmit = async (data: CustomerFormValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const gstTreatmentLabels: Record<string, string> = {
      "registered_regular": "Registered Business - Regular",
      "registered_composition": "Registered Business - Composition",
      "unregistered": "Unregistered Business",
      "consumer": "Consumer",
      "overseas": "Overseas",
    };

    const placeOfSupplyLabels: Record<string, string> = {
      "KA": "Karnataka",
      "MH": "Maharashtra",
      "DL": "Delhi",
      "TN": "Tamil Nadu",
      "GJ": "Gujarat",
    };

    const billingAddress = {
      street: [data.billingAddress.street1, data.billingAddress.street2].filter(Boolean).join(", ") || "",
      city: data.billingAddress.city || "",
      state: data.billingAddress.state || "",
      country: data.billingAddress.country || "India",
      pincode: data.billingAddress.pincode || "",
    };

    const shippingAddress = {
      street: [data.shippingAddress.street1, data.shippingAddress.street2].filter(Boolean).join(", ") || "",
      city: data.shippingAddress.city || "",
      state: data.shippingAddress.state || "",
      country: data.shippingAddress.country || "India",
      pincode: data.shippingAddress.pincode || "",
    };

    const customerPayload = {
      name: data.displayName,
      displayName: data.displayName,
      companyName: data.companyName || data.displayName,
      email: data.email || "",
      phone: data.workPhone || "",
      workPhone: data.workPhone || "",
      mobile: data.mobile || "",
      gstTreatment: gstTreatmentLabels[data.gstTreatment] || data.gstTreatment,
      receivables: "₹0.00",
      avatar: data.displayName.slice(0, 2).toUpperCase(),
      pan: data.pan || "",
      customerType: data.customerType,
      status: "active",
      billingAddress,
      shippingAddress,
      currency: data.currency || "INR",
      paymentTerms: data.paymentTerms || "Due on Receipt",
      placeOfSupply: placeOfSupplyLabels[data.placeOfSupply] || data.placeOfSupply,
      taxPreference: data.taxPreference,
      portalStatus: data.enablePortal ? "enabled" : "disabled",
      contactPersons: data.contactPersons || [],
    };

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to create customer");
      }

      const result = await response.json();
      const newCustomer = result.data;

      addCustomer({
        ...customerPayload,
        id: newCustomer.id,
      });

      toast({
        title: "Customer Created",
        description: "The customer has been successfully added.",
      });
      setIsSubmitting(false);

      if (returnTo === "invoice") {
        setPendingCustomerId(newCustomer.id);
        setLocation("/invoices/create");
      } else {
        setLocation("/customers");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create customer. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handlePrefill = () => {
    toast({
      title: "Fetching GST Details...",
      description: "Connecting to GST portal (Simulation)",
    });
    setTimeout(() => {
      form.setValue("companyName", "Tech Solutions Pvt Ltd");
      form.setValue("displayName", "Tech Solutions");
      form.setValue("gstTreatment", "registered_regular");
      form.setValue("placeOfSupply", "KA");
      toast({
        title: "Details Prefilled",
        description: "Customer details have been populated from GSTIN.",
      });
    }, 1500);
  };

  const copyBillingToShipping = () => {
    const billing = form.getValues("billingAddress");
    form.setValue("shippingAddress", billing);
    toast({
      description: "Billing address copied to shipping address.",
    });
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer w-fit" onClick={() => setLocation("/customers")}>
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Customers</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">New Customer</h1>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 px-4 py-3 rounded-md flex items-center gap-2 text-sm text-blue-700 mb-8">
        <Info className="h-4 w-4" />
        <span>Prefill Customer details from the GST portal using the Customer's GSTIN.</span>
        <button type="button" onClick={handlePrefill} className="font-semibold hover:underline ml-1">Prefill {">"}</button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
            <div className="md:col-span-4 space-y-6">
              <FormField
                control={form.control}
                name="customerType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Customer Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="business" />
                          </FormControl>
                          <FormLabel className="font-normal">Business</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="individual" />
                          </FormControl>
                          <FormLabel className="font-normal">Individual</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="block text-sm font-medium">Primary Contact</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormField
                      control={form.control}
                      name="salutation"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Salutation" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="z-[100]">
                              <SelectItem value="mr">Mr.</SelectItem>
                              <SelectItem value="mrs">Mrs.</SelectItem>
                              <SelectItem value="ms">Ms.</SelectItem>
                              <SelectItem value="dr">Dr.</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="First Name" {...field} className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Last Name" {...field} className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input placeholder="" {...field} className="pl-9" />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-slate-400">@</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="workPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} className="w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 987-6543" {...field} className="w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="other" className="w-full mt-8">
            <TabsList className="w-full justify-start h-auto border-b border-slate-200 bg-transparent p-0 rounded-none space-x-6">
              <TabsTrigger value="other" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-700 px-0 py-2">Other Details</TabsTrigger>
              <TabsTrigger value="address" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-700 px-0 py-2">Address</TabsTrigger>
              <TabsTrigger value="contact" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-700 px-0 py-2">Contact Persons</TabsTrigger>
              <TabsTrigger value="custom" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-700 px-0 py-2">Custom Fields</TabsTrigger>
              <TabsTrigger value="tags" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-700 px-0 py-2">Reporting Tags</TabsTrigger>
              <TabsTrigger value="remarks" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-700 px-0 py-2">Remarks</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="other" className="space-y-6 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <FormField
                    control={form.control}
                    name="gstTreatment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">GST Treatment</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select GST Treatment" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="registered_regular">Registered Business - Regular</SelectItem>
                            <SelectItem value="registered_composition">Registered Business - Composition</SelectItem>
                            <SelectItem value="unregistered">Unregistered Business</SelectItem>
                            <SelectItem value="consumer">Consumer</SelectItem>
                            <SelectItem value="overseas">Overseas</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="placeOfSupply"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">Place of Supply</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select State" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="KA">Karnataka</SelectItem>
                            <SelectItem value="MH">Maharashtra</SelectItem>
                            <SelectItem value="DL">Delhi</SelectItem>
                            <SelectItem value="TN">Tamil Nadu</SelectItem>
                            <SelectItem value="GJ">Gujarat</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="openingBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opening Balance</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <span className="bg-slate-100 border border-r-0 border-slate-300 rounded-l-md px-3 py-2 text-sm text-slate-500">INR</span>
                            <Input placeholder="0.00" {...field} className="rounded-l-none" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Terms</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Due on Receipt" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="receipt">Due on Receipt</SelectItem>
                            <SelectItem value="net15">Net 15</SelectItem>
                            <SelectItem value="net30">Net 30</SelectItem>
                            <SelectItem value="net45">Net 45</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="taxPreference"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">Tax Preference</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="taxable" />
                            </FormControl>
                            <FormLabel className="font-normal">Taxable</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="tax_exempt" />
                            </FormControl>
                            <FormLabel className="font-normal">Tax Exempt</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enablePortal"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border border-slate-100 bg-slate-50/50">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Allow portal access for this customer
                        </FormLabel>
                        <FormDescription>
                          Customer will be able to view invoices and make payments online.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Label className="mb-2 block">Documents</Label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif"
                    data-testid="input-file-upload"
                  />
                  <div 
                    className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    data-testid="button-upload-area"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-blue-50 p-3 rounded-full">
                        <Upload className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-sm text-slate-600">
                        <span className="text-blue-600 font-medium">Upload files</span> or drag and drop
                      </div>
                      <p className="text-xs text-slate-400">Up to 10 files (max 10MB each)</p>
                    </div>
                  </div>

                  {documents.length > 0 && (
                    <div className="mt-4 space-y-2" data-testid="list-uploaded-files">
                      {documents.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                          data-testid={`file-item-${file.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-slate-400" />
                            <div>
                              <p className="text-sm font-medium text-slate-700" data-testid={`text-filename-${file.id}`}>{file.name}</p>
                              <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(file.id)}
                            data-testid={`button-remove-file-${file.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-slate-400" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="address" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Billing Address */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-500 mb-4">Billing Address</h3>

                    <FormField
                      control={form.control}
                      name="billingAddress.attention"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Attention</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="billingAddress.country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country / Region</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="India">India</SelectItem>
                              <SelectItem value="USA">USA</SelectItem>
                              <SelectItem value="UK">UK</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="billingAddress.street1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Street 1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="billingAddress.street2"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Street 2" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="billingAddress.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="billingAddress.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="billingAddress.pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pin Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="billingAddress.phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="billingAddress.fax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fax</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-500">Shipping Address</h3>
                      <Button type="button" variant="ghost" size="sm" onClick={copyBillingToShipping} className="text-blue-600 h-8 text-xs">
                        Copy billing address
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name="shippingAddress.attention"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Attention</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shippingAddress.country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country / Region</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || form.getValues("shippingAddress.country")}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="India">India</SelectItem>
                              <SelectItem value="USA">USA</SelectItem>
                              <SelectItem value="UK">UK</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="shippingAddress.street1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Street 1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingAddress.street2"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Street 2" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="shippingAddress.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingAddress.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="shippingAddress.pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pin Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shippingAddress.phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="shippingAddress.fax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fax</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Salutation</TableHead>
                          <TableHead>First Name</TableHead>
                          <TableHead>Last Name</TableHead>
                          <TableHead>Email Address</TableHead>
                          <TableHead>Work Phone</TableHead>
                          <TableHead>Mobile</TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contactFields.map((fieldItem, index) => (
                          <TableRow key={fieldItem.id}>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`contactPersons.${index}.salutation`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="h-8" placeholder="Mr." />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`contactPersons.${index}.firstName`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="h-8" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`contactPersons.${index}.lastName`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="h-8" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`contactPersons.${index}.email`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="h-8" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`contactPersons.${index}.workPhone`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="h-8" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`contactPersons.${index}.mobile`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input {...field} className="h-8" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" type="button" onClick={() => removeContact(index)}>
                                <X className="h-4 w-4 text-slate-400 hover:text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {contactFields.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                              No contact persons added.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() => appendContact({ salutation: "", firstName: "", lastName: "", email: "", workPhone: "", mobile: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Contact Person
                </Button>
              </TabsContent>

              <TabsContent value="custom">
                <div className="flex flex-col items-center justify-center py-12 border border-dashed border-slate-200 rounded-lg bg-slate-50/30">
                  <div className="p-4 bg-slate-100 rounded-full mb-3">
                    <MoreHorizontal className="h-6 w-6 text-slate-400" />
                  </div>
                  <h3 className="font-medium text-slate-900">No Custom Fields</h3>
                  <p className="text-sm text-slate-500 mt-1">You haven't created any custom fields for Customers yet.</p>
                </div>
              </TabsContent>

              <TabsContent value="tags">
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900">Reporting Tags</h3>
                  <p className="text-sm text-slate-500">Associate tags to this customer for reporting purposes.</p>
                  <div className="p-4 border border-slate-200 rounded-md bg-white">
                    <p className="text-sm text-slate-400 italic">No tags available. Go to Settings to create tags.</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="remarks">
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remarks (Internal Use)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any notes or remarks about this customer..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </div>
          </Tabs>

          {/* Sticky Footer */}
          <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t border-slate-200 p-4 flex items-center gap-4 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 min-w-[100px]">
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setLocation("/customers")}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}