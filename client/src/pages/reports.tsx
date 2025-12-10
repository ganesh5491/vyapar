import { BarChart3, PieChart, ArrowUpRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Reports() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">Insights into your business performance.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Export All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Sales by Customer
            </CardTitle>
            <CardDescription>Revenue breakdown per client.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-secondary/20 rounded-md flex items-center justify-center text-muted-foreground text-sm">
              Chart Preview
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-500" />
              Expense Breakdown
            </CardTitle>
            <CardDescription>Where your money is going.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-secondary/20 rounded-md flex items-center justify-center text-muted-foreground text-sm">
              Chart Preview
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-green-500" />
              Profit & Loss
            </CardTitle>
            <CardDescription>Net income over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-secondary/20 rounded-md flex items-center justify-center text-muted-foreground text-sm">
              Chart Preview
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
