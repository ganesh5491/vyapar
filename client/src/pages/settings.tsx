import { useState, useRef } from "react";
import { Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useBranding } from "@/hooks/use-branding";
import { queryClient } from "@/lib/queryClient";

const SUPPORTED_FORMATS = ["jpg", "jpeg", "png", "gif", "bmp"];
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

export default function Settings() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: branding, isLoading } = useBranding();
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoUpload = async (file: File) => {
    try {
      setIsUploading(true);

      // Validate file type
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
      if (!SUPPORTED_FORMATS.includes(fileExt)) {
        toast({
          title: "Invalid Format",
          description: `Supported formats: ${SUPPORTED_FORMATS.join(", ").toUpperCase()}`,
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File Too Large",
          description: "Maximum file size is 1 MB",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64 = (e.target?.result as string).split(",")[1];
          const response = await fetch("/api/branding/logo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              logoBase64: base64,
              fileName: file.name,
              fileSize: file.size,
            }),
          });

          const data = await response.json();
          if (data.success) {
            toast({
              title: "Success",
              description: "Logo uploaded successfully",
            });
            queryClient.invalidateQueries({ queryKey: ["/api/branding"] });
          } else {
            toast({
              title: "Error",
              description: data.message || "Failed to upload logo",
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to upload logo",
            variant: "destructive",
          });
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process logo",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove the logo? This cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setIsUploading(true);
      const response = await fetch("/api/branding/logo", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Logo removed successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/branding"] });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to remove logo",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove logo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleLogoUpload(e.target.files[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 mb-20">
      <div>
        <input
          type="search"
          placeholder="Search settings (/)"
          className="absolute top-4 right-6 px-4 py-2 border border-slate-200 rounded-md text-sm w-64"
        />
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      </div>

      {/* Branding Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Branding</h2>
        </div>

        {/* Organization Logo Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Organization Logo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-6">
              {/* Logo Preview */}
              <div className="flex-shrink-0">
                {branding?.logo?.url ? (
                  <div className="w-40 h-40 rounded-md border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                    <img
                      src={branding.logo.url}
                      alt="Organization Logo"
                      className="max-w-full max-h-full object-contain"
                      data-testid="img-organization-logo"
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 rounded-md border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
                    <span className="text-sm text-slate-400">No logo</span>
                  </div>
                )}
              </div>

              {/* Logo Details & Upload */}
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-sm text-slate-600 mb-2">
                    This logo will be displayed in transaction PDFs and email
                    notifications.
                  </p>

                  <div className="bg-slate-50 rounded-md p-4 space-y-2 text-sm text-slate-600">
                    <p className="font-medium">Preferred Image Dimensions:</p>
                    <p>240 × 240 pixels @ 72 DPI</p>

                    <p className="font-medium mt-3">Supported Files:</p>
                    <p>JPG, JPEG, PNG, GIF, BMP</p>

                    <p className="font-medium mt-3">Maximum File Size:</p>
                    <p>1 MB</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="gap-2"
                    data-testid="button-upload-logo"
                  >
                    <Upload className="h-4 w-4" />
                    {branding?.logo ? "Update Logo" : "Upload Logo"}
                  </Button>
                  {branding?.logo && (
                    <Button
                      variant="outline"
                      onClick={handleRemoveLogo}
                      disabled={isUploading}
                      className="gap-2"
                      data-testid="button-remove-logo"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>

                {branding?.logo && (
                  <div className="text-xs text-slate-500">
                    <p>Uploaded: {new Date(branding.logo.uploadedAt).toLocaleDateString()}</p>
                    <p>File: {branding.logo.fileName}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Theme and color customization coming soon.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={SUPPORTED_FORMATS.map((f) => `.${f}`).join(",")}
        onChange={handleFileInputChange}
        className="hidden"
        data-testid="input-file-logo"
      />
    </div>
  );
}
