import { useState } from "react";
import { Upload, Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 mb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Business Settings</h1>
        <p className="text-slate-500 mt-1">Manage your business profile and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Logo & Signature */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Business Logo</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="border-2 border-dashed border-slate-300 rounded-lg h-48 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group relative overflow-hidden">
                  <div className="flex flex-col items-center gap-2 z-10">
                     <div className="bg-white p-2 rounded-full shadow-sm border border-slate-200 group-hover:border-blue-300 transition-colors">
                        <Upload className="h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                     </div>
                     <span className="text-sm font-medium text-slate-600 group-hover:text-blue-700">Upload Logo</span>
                     <span className="text-xs text-slate-400">PNG, JPG up to 2MB</span>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
                <CardTitle className="text-base">Signature</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="border-2 border-dashed border-slate-300 rounded-lg h-32 flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                   <div className="flex items-center gap-2 text-slate-500 group-hover:text-blue-600 transition-colors">
                      <Plus className="h-4 w-4" />
                      <span className="text-sm font-medium">Add Signature</span>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Right Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
           <Card>
              <CardContent className="p-6 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                       <Label className="after:content-['*'] after:ml-0.5 after:text-red-500">Business Name</Label>
                       <Input placeholder="Enter your business name" className="bg-white" />
                    </div>

                    <div className="space-y-2">
                       <Label>Phone Number</Label>
                       <Input placeholder="Phone number" className="bg-white" />
                    </div>

                    <div className="space-y-2">
                       <Label>Email</Label>
                       <Input placeholder="Email address" className="bg-white" />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                       <Label>Billing Address</Label>
                       <Textarea placeholder="Enter billing address" className="bg-white min-h-[80px]" />
                    </div>

                    <div className="space-y-2">
                       <Label>State</Label>
                       <Select>
                          <SelectTrigger className="bg-white">
                             <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="KA">Karnataka</SelectItem>
                             <SelectItem value="MH">Maharashtra</SelectItem>
                             <SelectItem value="DL">Delhi</SelectItem>
                             <SelectItem value="TN">Tamil Nadu</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label>Pincode</Label>
                          <Input placeholder="Pincode" className="bg-white" />
                       </div>
                       <div className="space-y-2">
                          <Label>City</Label>
                          <Input placeholder="City" className="bg-white" />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <Label>Business Type</Label>
                       <Select>
                          <SelectTrigger className="bg-white">
                             <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="proprietorship">Proprietorship</SelectItem>
                             <SelectItem value="partnership">Partnership</SelectItem>
                             <SelectItem value="pvt_ltd">Private Limited</SelectItem>
                             <SelectItem value="public_ltd">Public Limited</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>

                    <div className="space-y-2">
                       <Label>Industry Type</Label>
                       <Select>
                          <SelectTrigger className="bg-white">
                             <SelectValue placeholder="Select Industry" />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="retail">Retail</SelectItem>
                             <SelectItem value="wholesale">Wholesale</SelectItem>
                             <SelectItem value="manufacturing">Manufacturing</SelectItem>
                             <SelectItem value="services">Services</SelectItem>
                             <SelectItem value="technology">Technology</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t border-slate-200 p-4 flex items-center gap-4 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <Button className="bg-blue-600 hover:bg-blue-700 min-w-[120px]">
            Save Changes
         </Button>
         <Button variant="outline" onClick={() => window.history.back()}>
            Cancel
         </Button>
      </div>
    </div>
  );
}
