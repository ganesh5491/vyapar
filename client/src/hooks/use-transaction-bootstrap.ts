import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useCustomerSnapshot } from './use-customer-snapshot';
import { 
  CustomerSnapshot, 
  TaxRegime,
  formatAddressDisplay,
  calculateDueDateFromTerms 
} from '@/lib/customer-snapshot';

interface TransactionBootstrapOptions {
  transactionType: 'invoice' | 'quote' | 'sales_order' | 'delivery_challan' | 'payment' | 'credit_note';
}

interface TransactionBootstrapReturn {
  // Customer data
  customerId: string | null;
  setCustomerId: (id: string | null) => void;
  customerSnapshot: CustomerSnapshot | null;
  taxRegime: TaxRegime;
  isLoadingCustomer: boolean;
  customerError: string | null;
  
  // Formatted data for form population
  formData: {
    customerName: string;
    displayName: string;
    billingAddressStr: string;
    shippingAddressStr: string;
    gstTreatment: string;
    taxPreference: 'taxable' | 'tax_exempt';
    gstin: string;
    placeOfSupply: string;
    pan: string;
    currency: string;
    paymentTerms: string;
    isTaxExempt: boolean;
    exemptionReason: string;
  };
  
  // Actions
  refreshCustomer: () => Promise<void>;
  onCustomerChange: (newCustomerId: string) => void;
}

export function useTransactionBootstrap(
  options: TransactionBootstrapOptions
): TransactionBootstrapReturn {
  const [location] = useLocation();
  const [customerId, setCustomerId] = useState<string | null>(null);
  
  // Extract customerId from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const urlCustomerId = params.get('customerId');
    if (urlCustomerId) {
      setCustomerId(urlCustomerId);
    }
  }, [location]);
  
  // Use customer snapshot hook
  const {
    snapshot: customerSnapshot,
    taxRegime,
    isLoading: isLoadingCustomer,
    error: customerError,
    fetchCustomer,
    clearSnapshot
  } = useCustomerSnapshot(customerId);
  
  // Handle customer change
  const onCustomerChange = useCallback((newCustomerId: string) => {
    if (newCustomerId === customerId) return;
    
    // Clear previous data
    clearSnapshot();
    
    // Set new customer
    setCustomerId(newCustomerId || null);
  }, [customerId, clearSnapshot]);
  
  // Refresh customer data
  const refreshCustomer = useCallback(async () => {
    if (customerId) {
      await fetchCustomer(customerId);
    }
  }, [customerId, fetchCustomer]);
  
  // Computed form data for easy consumption
  const formData = {
    customerName: customerSnapshot?.customerName || '',
    displayName: customerSnapshot?.displayName || '',
    billingAddressStr: customerSnapshot ? formatAddressDisplay(customerSnapshot.billingAddress) : '',
    shippingAddressStr: customerSnapshot ? formatAddressDisplay(customerSnapshot.shippingAddress) : '',
    gstTreatment: customerSnapshot?.gstTreatment || '',
    taxPreference: customerSnapshot?.taxPreference || 'taxable',
    gstin: customerSnapshot?.gstin || '',
    placeOfSupply: customerSnapshot?.placeOfSupply || '',
    pan: customerSnapshot?.pan || '',
    currency: customerSnapshot?.currency || 'INR',
    paymentTerms: customerSnapshot?.paymentTerms || 'Due on Receipt',
    isTaxExempt: customerSnapshot?.taxPreference === 'tax_exempt',
    exemptionReason: customerSnapshot?.exemptionReason || ''
  };
  
  return {
    customerId,
    setCustomerId,
    customerSnapshot,
    taxRegime,
    isLoadingCustomer,
    customerError,
    formData,
    refreshCustomer,
    onCustomerChange
  };
}
