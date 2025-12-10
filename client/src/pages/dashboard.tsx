import { useState } from "react";
import { Link } from "wouter";
import { 
  Plus, 
  ChevronDown,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Folder,
  Smartphone,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";

const cashFlowData = [
  { month: "Apr 2025", value: 0 },
  { month: "May 2025", value: 0 },
  { month: "Jun 2025", value: 0 },
  { month: "Jul 2025", value: 0 },
  { month: "Aug 2025", value: 0 },
  { month: "Sep 2025", value: 0 },
  { month: "Oct 2025", value: 0 },
  { month: "Nov 2025", value: 0 },
  { month: "Dec 2025", value: 0 },
  { month: "Jan 2026", value: 0 },
  { month: "Feb 2026", value: 0 },
  { month: "Mar 2026", value: 0 },
];

const incomeExpenseData = [
  { month: "Apr 2025", income: 0, expense: 0 },
  { month: "May 2025", income: 0, expense: 0 },
  { month: "Jun 2025", income: 0, expense: 0 },
  { month: "Jul 2025", income: 0, expense: 0 },
  { month: "Aug 2025", income: 0, expense: 0 },
  { month: "Sep 2025", income: 0, expense: 0 },
  { month: "Oct 2025", income: 0, expense: 0 },
  { month: "Nov 2025", income: 0, expense: 0 },
  { month: "Dec 2025", income: 0, expense: 0 },
  { month: "Jan 2026", income: 0, expense: 0 },
  { month: "Feb 2026", income: 0, expense: 0 },
  { month: "Mar 2026", income: 0, expense: 0 },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [incomeExpenseMode, setIncomeExpenseMode] = useState<"accrual" | "cash">("accrual");
  const [fiscalYear] = useState("This Fiscal Year");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount).replace('₹', '₹');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-2">
        <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
          <span className="text-slate-500 text-lg font-medium">AD</span>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Hello, Admin</h1>
          <p className="text-sm text-slate-500">Baniya Accounting</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-transparent border-b border-slate-200 w-full justify-start rounded-none h-auto p-0 gap-0">
          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 rounded-none px-4 py-3 font-medium text-slate-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="getting-started"
            className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 rounded-none px-4 py-3 font-medium text-slate-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Getting Started
          </TabsTrigger>
          <TabsTrigger 
            value="recent-updates"
            className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 rounded-none px-4 py-3 font-medium text-slate-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Recent Updates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold text-slate-800">Total Receivables</CardTitle>
                <Link href="/invoices/new">
                  <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1">
                    <Plus className="h-4 w-4" /> New
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Total Unpaid Invoices <span className="font-medium text-slate-700">₹0.00</span></p>
                  <div className="w-full h-2 bg-slate-100 rounded-full mt-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs font-medium text-teal-600 uppercase tracking-wide">Current</p>
                    <p className="text-xl font-semibold text-slate-800 mt-1">₹0.00</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-red-500 uppercase tracking-wide">Overdue</p>
                    <div className="flex items-center gap-1 mt-1">
                      <p className="text-xl font-semibold text-slate-800">₹0.00</p>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold text-slate-800">Total Payables</CardTitle>
                <Link href="/bills">
                  <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1">
                    <Plus className="h-4 w-4" /> New
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Total Unpaid Bills <span className="font-medium text-slate-700">₹0.00</span></p>
                  <div className="w-full h-2 bg-slate-100 rounded-full mt-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs font-medium text-teal-600 uppercase tracking-wide">Current</p>
                    <p className="text-xl font-semibold text-slate-800 mt-1">₹0.00</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-red-500 uppercase tracking-wide">Overdue</p>
                    <div className="flex items-center gap-1 mt-1">
                      <p className="text-xl font-semibold text-slate-800">₹0.00</p>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-800">Cash Flow</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1">
                    {fiscalYear} <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-slate-200 shadow-lg">
                  <DropdownMenuItem>This Fiscal Year</DropdownMenuItem>
                  <DropdownMenuItem>Last Fiscal Year</DropdownMenuItem>
                  <DropdownMenuItem>This Quarter</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cashFlowData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        tickFormatter={(value) => value.split(' ')[0]}
                      />
                      <YAxis 
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        tickFormatter={(value) => `${value / 1000}K`}
                        domain={[0, 5000]}
                        ticks={[0, 1000, 2000, 3000, 4000, 5000]}
                      />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#6366f1" 
                        fill="#eef2ff" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Cash as on 01/04/2025</p>
                    <p className="text-2xl font-semibold text-slate-800">₹0.00</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-teal-600">Incoming</p>
                    <p className="text-xl font-semibold text-teal-600 flex items-center justify-end gap-1">
                      ₹0.00 <TrendingUp className="h-4 w-4" />
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-red-500">Outgoing</p>
                    <p className="text-xl font-semibold text-red-500 flex items-center justify-end gap-1">
                      ₹0.00 <TrendingDown className="h-4 w-4" />
                    </p>
                  </div>
                  <div className="text-right pt-2 border-t border-slate-100">
                    <p className="text-sm text-slate-500">Cash as on 31/03/2026</p>
                    <p className="text-xl font-semibold text-slate-800">₹0.00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-800">Income and Expense</CardTitle>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1">
                        {fiscalYear} <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border border-slate-200 shadow-lg">
                      <DropdownMenuItem>This Fiscal Year</DropdownMenuItem>
                      <DropdownMenuItem>Last Fiscal Year</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-end">
                  <div className="inline-flex rounded-md border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => setIncomeExpenseMode("accrual")}
                      className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                        incomeExpenseMode === "accrual" 
                          ? "bg-slate-100 text-slate-800" 
                          : "bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      Accrual
                    </button>
                    <button
                      onClick={() => setIncomeExpenseMode("cash")}
                      className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                        incomeExpenseMode === "cash" 
                          ? "bg-slate-100 text-slate-800" 
                          : "bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      Cash
                    </button>
                  </div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={incomeExpenseData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 10, fill: '#64748b' }}
                        tickFormatter={(value) => value.split(' ')[0]}
                      />
                      <YAxis 
                        tick={{ fontSize: 10, fill: '#64748b' }}
                        tickFormatter={(value) => `${value / 1000}K`}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="income" name="Income" fill="#22c55e" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-green-500 rounded" />
                    <span className="text-sm text-slate-600">Income</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-red-500 rounded" />
                    <span className="text-sm text-slate-600">Expense</span>
                  </div>
                  <div className="ml-auto flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-green-600 font-medium">Total Income</span>
                      <span className="ml-2 font-semibold text-slate-800">₹0.00</span>
                    </div>
                    <div>
                      <span className="text-red-500 font-medium">Total Expenses</span>
                      <span className="ml-2 font-semibold text-slate-800">₹0.00</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-400">* Income and expense values displayed are exclusive of taxes.</p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-800">Top Expenses</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1">
                      {fiscalYear} <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border border-slate-200 shadow-lg">
                    <DropdownMenuItem>This Fiscal Year</DropdownMenuItem>
                    <DropdownMenuItem>Last Fiscal Year</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <p className="text-slate-400 text-sm">No Expense recorded for this fiscal year</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-center justify-center">
                  <Link href="/time-tracking" className="text-indigo-600 hover:text-indigo-700 text-sm hover:underline">
                    Add Project(s) to this watchlist
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">Bank and Credit Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex flex-col items-center justify-center gap-2">
                  <CreditCard className="h-8 w-8 text-slate-300" />
                  <p className="text-sm text-slate-400">Yet to add Bank and Credit Card details</p>
                  <Link href="/banking" className="text-indigo-600 hover:text-indigo-700 text-sm hover:underline">
                    Add Bank Account
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-800">Account Watchlist</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 gap-1">
                    Accrual <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-slate-200 shadow-lg">
                  <DropdownMenuItem>Accrual</DropdownMenuItem>
                  <DropdownMenuItem>Cash</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="h-24 flex items-center justify-center border border-dashed border-slate-200 rounded-lg">
                <p className="text-slate-400 text-sm">No accounts in watchlist</p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-slate-50 rounded-lg p-8 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center md:text-left">
                <h3 className="font-semibold text-slate-800 mb-3">Account on the go!</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Download the Baniya app for Android and iOS to manage your finances from anywhere, anytime!
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2 text-sm text-indigo-600">
                    <Smartphone className="h-4 w-4" />
                    Learn More
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">OTHER APPS</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="hover:text-indigo-600 cursor-pointer">Ecommerce Software</li>
                  <li className="hover:text-indigo-600 cursor-pointer">Expense Reporting</li>
                  <li className="hover:text-indigo-600 cursor-pointer">Subscription Billing</li>
                  <li className="hover:text-indigo-600 cursor-pointer">Inventory Management</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">HELP & SUPPORT</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="hover:text-indigo-600 cursor-pointer">Contact Support</li>
                  <li className="hover:text-indigo-600 cursor-pointer">Knowledge Base</li>
                  <li className="hover:text-indigo-600 cursor-pointer">Help Documentation</li>
                  <li className="hover:text-indigo-600 cursor-pointer">Webinar</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">QUICK LINKS</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="hover:text-indigo-600 cursor-pointer">Getting Started</li>
                  <li className="hover:text-indigo-600 cursor-pointer">Mobile apps</li>
                  <li className="hover:text-indigo-600 cursor-pointer">Add-ons</li>
                  <li className="hover:text-indigo-600 cursor-pointer">What's New?</li>
                  <li className="hover:text-indigo-600 cursor-pointer">Developers API</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-400">© 2025, Baniya Accounting. All Rights Reserved.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="getting-started" className="mt-6">
          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <Folder className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Getting Started Guide</h3>
              <p className="text-slate-500 mb-6">Learn how to set up your accounting and start managing your business finances.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors cursor-pointer">
                  <p className="font-medium text-slate-700">1. Add Customers</p>
                  <p className="text-sm text-slate-500 mt-1">Create your customer list</p>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors cursor-pointer">
                  <p className="font-medium text-slate-700">2. Create Invoice</p>
                  <p className="text-sm text-slate-500 mt-1">Send your first invoice</p>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors cursor-pointer">
                  <p className="font-medium text-slate-700">3. Track Expenses</p>
                  <p className="text-sm text-slate-500 mt-1">Record business expenses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent-updates" className="mt-6">
          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No Recent Updates</h3>
              <p className="text-slate-500">Your recent activity and updates will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
