import { useQuery } from "@tanstack/react-query";

export interface BrandingLogo {
  url: string;
  fileName: string;
  uploadedAt: string;
  fileSize: number;
}

export interface OrganizationBranding {
  id: string;
  logo: BrandingLogo | null;
  createdAt: string;
  updatedAt: string;
}

export function useBranding() {
  return useQuery<OrganizationBranding>({
    queryKey: ["/api/branding"],
  });
}

export async function fetchBranding(): Promise<OrganizationBranding> {
  const response = await fetch("/api/branding");
  const data = await response.json();
  if (!data.success) throw new Error("Failed to fetch branding");
  return data.data;
}
