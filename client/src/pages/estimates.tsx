import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Estimates() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">Estimates</h1>
          <p className="text-muted-foreground mt-1">Manage quotes and proposals for your clients.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> New Estimate
        </Button>
      </div>

      <Card className="border-dashed border-2 border-border/60 bg-secondary/5 py-12">
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">No estimates created yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Create your first estimate to send to a client. You can convert accepted estimates to invoices later.
            </p>
          </div>
          <Button variant="outline">Create Estimate</Button>
        </CardContent>
      </Card>
    </div>
  );
}
