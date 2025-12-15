import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Plus, X, Upload, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  displayName: string;
  companyName?: string;
  email?: string;
  workPhone?: string;
  mobile?: string;
  gstTreatment?: string;
  placeOfSupply?: string;
  gstin?: string;
  pan?: string;
  taxPreference?: string;
  currency?: string;
  paymentTerms?: string;
  customerType?: string;
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
  contactPersons?: Array<{
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
    workPhone: string;
    mobile: string;
  }>;
}

export default function CustomerEdit() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);

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

  const [formData, setFormData] = useState({
    customerType: "business" as "business" | "individual",
    displayName: "",
    companyName: "",
    email: "",
    workPhone: "",
    mobile: "",
    gstTreatment: "",
    placeOfSupply: "",
    gstin: "",
    pan: "",
    taxPreference: "taxable" as "taxable" | "tax_exempt",
    currency: "INR",
    paymentTerms: "",
    billingStreet: "",
    billingCity: "",
    billingState: "",
    billingCountry: "India",
    billingPincode: "",
    shippingStreet: "",
    shippingCity: "",
    shippingState: "",
    shippingCountry: "India",
    shippingPincode: "",
  });

  const [contactPersons, setContactPersons] = useState<Array<{
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
    workPhone: string;
    mobile: string;
  }>>([]);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!params.id) return;
      try {
        const response = await fetch(`/api/customers/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          const found = data.data;
          if (found) {
            setCustomer(found);
            setFormData({
              customerType: found.customerType || "business",
              displayName: found.displayName || found.name || "",
              companyName: found.companyName || "",
              email: found.email || "",
              workPhone: found.workPhone || found.phone || "",
              mobile: found.mobile || "",
              gstTreatment: found.gstTreatment || "",
              placeOfSupply: found.placeOfSupply || "",
              gstin: found.gstin || "",
              pan: found.pan || "",
              taxPreference: found.taxPreference || "taxable",
              currency: found.currency || "INR",
              paymentTerms: found.paymentTerms || "",
              billingStreet: found.billingAddress?.street || "",
              billingCity: found.billingAddress?.city || "",
              billingState: found.billingAddress?.state || "",
              billingCountry: found.billingAddress?.country || "India",
              billingPincode: found.billingAddress?.pincode || "",
              shippingStreet: found.shippingAddress?.street || "",
              shippingCity: found.shippingAddress?.city || "",
              shippingState: found.shippingAddress?.state || "",
              shippingCountry: found.shippingAddress?.country || "India",
              shippingPincode: found.shippingAddress?.pincode || "",
            });
            if (found.contactPersons) {
              setContactPersons(found.contactPersons);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch customer:', error);
        toast({
          title: "Error",
          description: "Failed to load customer data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.id) return;

    setIsSubmitting(true);
    
    try {
      const updateData = {
        name: formData.displayName,
        displayName: formData.displayName,
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.workPhone,
        workPhone: formData.workPhone,
        mobile: formData.mobile,
        gstTreatment: formData.gstTreatment,
        placeOfSupply: formData.placeOfSupply,
        gstin: formData.gstin,
        pan: formData.pan,
        taxPreference: formData.taxPreference,
        currency: formData.currency,
        paymentTerms: formData.paymentTerms,
        customerType: formData.customerType,
        billingAddress: {
          street: formData.billingStreet,
          city: formData.billingCity,
          state: formData.billingState,
          country: formData.billingCountry,
          pincode: formData.billingPincode,
        },
        shippingAddress: {
          street: formData.shippingStreet,
          city: formData.shippingCity,
          state: formData.shippingState,
          country: formData.shippingCountry,
          pincode: formData.shippingPincode,
        },
        contactPersons: contactPersons,
      };

      const response = await fetch(`/api/customers/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast({
          title: "Customer Updated",
          description: "The customer has been successfully updated.",
        });
        setLocation("/customers");
      } else {
        throw new Error('Failed to update customer');
      }
    } catch (error) {
      console.error('Failed to update customer:', error);
      toast({
        title: "Error",
        description: "Failed to update customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center">
        <p className="text-slate-500">Loading customer...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center">
        <p className="text-slate-500">Customer not found</p>
        <Button variant="link" onClick={() => setLocation("/customers")}>
          Back to Customers
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 p-4">
      <div className="mb-6">
        <div
          className="flex items-center gap-2 mb-4 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer w-fit"
          onClick={() => setLocation("/customers")}
          data-testid="link-back-customers"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Customers</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Edit Customer</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
          <div className="md:col-span-6 space-y-6">
            <div className="space-y-3">
              <Label>Customer Type</Label>
              <RadioGroup
                value={formData.customerType}
                onValueChange={(val) => setFormData({ ...formData, customerType: val as "business" | "individual" })}
                className="flex flex-row space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="business" id="business" />
                  <Label htmlFor="business" className="font-normal">Business</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual" className="font-normal">Individual</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name *</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                required
                data-testid="input-display-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                data-testid="input-company-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                data-testid="input-email"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workPhone">Work Phone</Label>
                <Input
                  id="workPhone"
                  value={formData.workPhone}
                  onChange={(e) => setFormData({ ...formData, workPhone: e.target.value })}
                  data-testid="input-work-phone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile</Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  data-testid="input-mobile"
                />
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="tax" className="w-full mt-8">
          <TabsList className="w-full justify-start h-auto border-b border-slate-200 bg-transparent p-0 rounded-none space-x-6">
            <TabsTrigger value="tax" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2">Tax Details</TabsTrigger>
            <TabsTrigger value="address" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2">Address</TabsTrigger>
            <TabsTrigger value="contact" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-700 px-0 py-2">Contact Persons</TabsTrigger>
            <TabsTrigger value="documents" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-700 px-0 py-2">Documents</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="tax" className="space-y-6 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="space-y-2">
                  <Label htmlFor="gstTreatment">GST Treatment *</Label>
                  <Select
                    value={formData.gstTreatment}
                    onValueChange={(val) => setFormData({ ...formData, gstTreatment: val })}
                  >
                    <SelectTrigger data-testid="select-gst-treatment">
                      <SelectValue placeholder="Select GST Treatment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Registered Business - Regular">Registered Business - Regular</SelectItem>
                      <SelectItem value="Registered Business - Composition">Registered Business - Composition</SelectItem>
                      <SelectItem value="Unregistered Business">Unregistered Business</SelectItem>
                      <SelectItem value="Consumer">Consumer</SelectItem>
                      <SelectItem value="Overseas">Overseas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="placeOfSupply">Place of Supply</Label>
                  <Select
                    value={formData.placeOfSupply}
                    onValueChange={(val) => setFormData({ ...formData, placeOfSupply: val })}
                  >
                    <SelectTrigger data-testid="select-place-of-supply">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="Karnataka">Karnataka</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="Gujarat">Gujarat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input
                    id="gstin"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                    data-testid="input-gstin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pan">PAN</Label>
                  <Input
                    id="pan"
                    value={formData.pan}
                    onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                    data-testid="input-pan"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(val) => setFormData({ ...formData, currency: val })}
                  >
                    <SelectTrigger data-testid="select-currency">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Select
                    value={formData.paymentTerms}
                    onValueChange={(val) => setFormData({ ...formData, paymentTerms: val })}
                  >
                    <SelectTrigger data-testid="select-payment-terms">
                      <SelectValue placeholder="Due on Receipt" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                      <SelectItem value="Net 15">Net 15</SelectItem>
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="Net 45">Net 45</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Tax Preference *</Label>
                <RadioGroup
                  value={formData.taxPreference}
                  onValueChange={(val) => setFormData({ ...formData, taxPreference: val as "taxable" | "tax_exempt" })}
                  className="flex flex-row space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="taxable" id="taxable" />
                    <Label htmlFor="taxable" className="font-normal">Taxable</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tax_exempt" id="tax_exempt" />
                    <Label htmlFor="tax_exempt" className="font-normal">Tax Exempt</Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>

            <TabsContent value="address" className="space-y-6 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900">Billing Address</h3>
                  <div className="space-y-2">
                    <Label htmlFor="billingStreet">Street</Label>
                    <Textarea
                      id="billingStreet"
                      value={formData.billingStreet}
                      onChange={(e) => setFormData({ ...formData, billingStreet: e.target.value })}
                      data-testid="input-billing-street"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingCity">City</Label>
                      <Input
                        id="billingCity"
                        value={formData.billingCity}
                        onChange={(e) => setFormData({ ...formData, billingCity: e.target.value })}
                        data-testid="input-billing-city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingState">State</Label>
                      <Input
                        id="billingState"
                        value={formData.billingState}
                        onChange={(e) => setFormData({ ...formData, billingState: e.target.value })}
                        data-testid="input-billing-state"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingPincode">Pincode</Label>
                      <Input
                        id="billingPincode"
                        value={formData.billingPincode}
                        onChange={(e) => setFormData({ ...formData, billingPincode: e.target.value })}
                        data-testid="input-billing-pincode"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingCountry">Country</Label>
                      <Input
                        id="billingCountry"
                        value={formData.billingCountry}
                        onChange={(e) => setFormData({ ...formData, billingCountry: e.target.value })}
                        data-testid="input-billing-country"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900">Shipping Address</h3>
                  <div className="space-y-2">
                    <Label htmlFor="shippingStreet">Street</Label>
                    <Textarea
                      id="shippingStreet"
                      value={formData.shippingStreet}
                      onChange={(e) => setFormData({ ...formData, shippingStreet: e.target.value })}
                      data-testid="input-shipping-street"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shippingCity">City</Label>
                      <Input
                        id="shippingCity"
                        value={formData.shippingCity}
                        onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })}
                        data-testid="input-shipping-city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingState">State</Label>
                      <Input
                        id="shippingState"
                        value={formData.shippingState}
                        onChange={(e) => setFormData({ ...formData, shippingState: e.target.value })}
                        data-testid="input-shipping-state"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shippingPincode">Pincode</Label>
                      <Input
                        id="shippingPincode"
                        value={formData.shippingPincode}
                        onChange={(e) => setFormData({ ...formData, shippingPincode: e.target.value })}
                        data-testid="input-shipping-pincode"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingCountry">Country</Label>
                      <Input
                        id="shippingCountry"
                        value={formData.shippingCountry}
                        onChange={(e) => setFormData({ ...formData, shippingCountry: e.target.value })}
                        data-testid="input-shipping-country"
                      />
                    </div>
                  </div>
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
                      {contactPersons.map((person, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Input
                              value={person.salutation}
                              onChange={(e) => {
                                const updated = [...contactPersons];
                                updated[index].salutation = e.target.value;
                                setContactPersons(updated);
                              }}
                              className="h-8"
                              placeholder="Mr."
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={person.firstName}
                              onChange={(e) => {
                                const updated = [...contactPersons];
                                updated[index].firstName = e.target.value;
                                setContactPersons(updated);
                              }}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={person.lastName}
                              onChange={(e) => {
                                const updated = [...contactPersons];
                                updated[index].lastName = e.target.value;
                                setContactPersons(updated);
                              }}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={person.email}
                              onChange={(e) => {
                                const updated = [...contactPersons];
                                updated[index].email = e.target.value;
                                setContactPersons(updated);
                              }}
                              className="h-8"
                              type="email"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={person.workPhone}
                              onChange={(e) => {
                                const updated = [...contactPersons];
                                updated[index].workPhone = e.target.value;
                                setContactPersons(updated);
                              }}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={person.mobile}
                              onChange={(e) => {
                                const updated = [...contactPersons];
                                updated[index].mobile = e.target.value;
                                setContactPersons(updated);
                              }}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              type="button"
                              onClick={() => {
                                const updated = contactPersons.filter((_, i) => i !== index);
                                setContactPersons(updated);
                              }}
                            >
                              <X className="h-4 w-4 text-slate-400 hover:text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {contactPersons.length === 0 && (
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
                onClick={() => {
                  setContactPersons([
                    ...contactPersons,
                    { salutation: "", firstName: "", lastName: "", email: "", workPhone: "", mobile: "" }
                  ]);
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Contact Person
              </Button>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6 max-w-4xl">
              <div>
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
                        <div className="flex items-center gap-1">
                          {file.data && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(file.data, '_blank')}
                              data-testid={`button-view-file-${file.id}`}
                            >
                              View
                            </Button>
                          )}
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
          <Button type="submit" disabled={isSubmitting} data-testid="button-save-customer">
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
          <Button type="button" variant="outline" onClick={() => setLocation("/customers")} data-testid="button-cancel">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
