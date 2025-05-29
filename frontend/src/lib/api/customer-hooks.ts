import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchCustomers,
    fetchCustomerById,
    fetchCustomerStats,
    addCustomer,
    assessCustomerRisk
} from './customer-service';
import { Customer } from './types';

export const QUERY_KEYS = {
    customers: 'customers',
    customer: 'customer',
    customerStats: 'customerStats',
    riskAssessment: 'riskAssessment',
};

// Hook for fetching all customers
export function useCustomers() {
    return useQuery({
        queryKey: [QUERY_KEYS.customers],
        queryFn: fetchCustomers,
    });
}

// Hook for fetching a single customer by ID
export function useCustomer(id: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.customer, id],
        queryFn: () => fetchCustomerById(id),
        enabled: !!id,
    });
}

// Hook for fetching customer statistics
export function useCustomerStats() {
    return useQuery({
        queryKey: [QUERY_KEYS.customerStats],
        queryFn: fetchCustomerStats,
    });
}

// Hook for assessing customer risk
export function useAssessCustomerRisk() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: assessCustomerRisk,
        onSuccess: (_, customerId) => {
            // Invalidate and refetch the specific customer
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.customer, customerId] });
        },
    });
}

// Hook for adding a new customer
export function useAddCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newCustomer: Omit<Customer, 'id'>) => addCustomer(newCustomer),
        onSuccess: () => {
            // Invalidate and refetch customers list and stats
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.customers] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.customerStats] });
        },
    });
}
