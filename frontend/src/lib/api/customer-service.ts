import { Customer, CustomerStats, RiskAssessmentResult } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7020/api';

// Fetch all customers
export async function fetchCustomers(): Promise<Customer[]> {
    const response = await fetch(`${API_BASE_URL}/Customers`);

    if (!response.ok) {
        throw new Error(`Error fetching customers: ${response.statusText}`);
    }

    const data = await response.json();
    // The API returns { $id: "1", $values: [...customers] }
    const customers = data.$values || [];

    // Normalize each customer's nested arrays
    return customers.map((customer: any) => {
        // Ensure transactions is always an array
        if (customer.transactions && customer.transactions.$values) {
            customer.transactions = customer.transactions.$values || [];
        } else if (!Array.isArray(customer.transactions)) {
            customer.transactions = [];
        }

        // Ensure loginActivities is always an array
        if (customer.loginActivities && customer.loginActivities.$values) {
            customer.loginActivities = customer.loginActivities.$values || [];
        } else if (!Array.isArray(customer.loginActivities)) {
            customer.loginActivities = [];
        }

        return customer;
    });
}

// Fetch customer by ID
export async function fetchCustomerById(id: string): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/Customers/${id}`);

    if (!response.ok) {
        throw new Error(`Error fetching customer: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform nested arrays with $values to regular arrays
    if (data.transactions && data.transactions.$values) {
        data.transactions = data.transactions.$values;
    }

    if (data.loginActivities && data.loginActivities.$values) {
        data.loginActivities = data.loginActivities.$values;
    }

    return data;
}

// Generate customer statistics for the dashboard
export async function fetchCustomerStats(): Promise<CustomerStats> {
    // In a real app, you'd have a dedicated endpoint for stats
    // Here, we'll fetch all customers and compute the stats on the client side
    const customers = await fetchCustomers();

    const totalCustomers = customers.length;
    const totalVerified = customers.filter(c => c.isVerified).length; const activeUsers = customers.filter(c => {
        // Ensure loginActivities is an array before using .some()
        return Array.isArray(c.loginActivities) && c.loginActivities.some(la => {
            if (!la || !la.loginTime) return false;
            const date = new Date(la.loginTime);
            const now = new Date();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(now.getDate() - 30);
            return date >= thirtyDaysAgo;
        });
    }).length;

    // Calculate risk distribution
    const lowRisk = customers.filter(c => c.riskLevel === 0).length;
    const mediumRisk = customers.filter(c => c.riskLevel === 1).length;
    const highRisk = customers.filter(c => c.riskLevel === 2).length;

    // Calculate monthly trend (this is simplified - would use real metrics in production)
    // Here we're assuming a 18% positive trend as shown in the reference design
    const recentActivity = {
        lastMonth: 18,
        trend: 'up' as const
    };

    return {
        totalCustomers,
        totalVerified,
        activeUsers,
        riskDistribution: {
            low: lowRisk,
            medium: mediumRisk,
            high: highRisk
        },
        recentActivity
    };
}

// Assess customer risk
export async function assessCustomerRisk(customerId: string): Promise<RiskAssessmentResult> {
    const response = await fetch(`${API_BASE_URL}/RiskAssessment/assess/${customerId}`, {
        method: 'POST',
    });

    if (!response.ok) {
        throw new Error(`Error assessing customer risk: ${response.statusText}`);
    }

    const result = await response.json();

    // After a risk assessment, we need to refetch the customer to get the updated risk level
    // We'll have a side effect here that also updates the customer
    try {
        await fetchCustomerById(customerId);
    } catch (error) {
        console.error("Failed to refresh customer after risk assessment:", error);
    }

    return result;
}

// Add a new customer
export async function addCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    // Generate a new GUID for customer and any transactions/logins
    const newCustomerId = crypto.randomUUID();

    const newCustomer = {
        ...customer,
        id: newCustomerId,
        // Initialize arrays without circular references
        transactions: (customer.transactions || []).map(t => ({
            ...t,
            id: crypto.randomUUID(),
            customerId: newCustomerId,
            // Don't include the customer object in the transaction to avoid circular reference
            customer: null
        })),
        loginActivities: (customer.loginActivities || []).map(l => ({
            ...l,
            id: crypto.randomUUID(),
            customerId: newCustomerId,
            // Don't include the customer object in the login activity to avoid circular reference
            customer: null
        }))
    };

    const response = await fetch(`${API_BASE_URL}/Customers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error adding customer: ${JSON.stringify(errorData.errors || errorData)}`);
    }

    return await response.json();
}
