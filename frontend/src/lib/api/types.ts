// API response types based on backend models
export interface Customer {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    nationalIdNumber: string;
    documentType: string;
    isVerified: boolean;
    riskLevel: RiskLevel;
    riskScore: number;
    transactions: Transaction[];
    loginActivities: LoginActivity[];
}

export interface RiskAssessmentResult {
    id: string;
    customerId: string;
    score: number;
    level: RiskLevel;
    assessedAt: string;
    notes: string;
}

export enum RiskLevel {
    Low = 0,
    Medium = 1,
    High = 2
}

export interface Transaction {
    id: string;
    customerId: string;
    amount: number;
    sourceAccount: string;
    destinationAccount: string;
    timestamp: string;
}

export interface LoginActivity {
    id: string;
    customerId: string;
    loginTime: string;
    ipAddress: string;
    location: string;
    device: string;
    usedVPNOrProxy: boolean;
}

// API statistics and summary types for dashboard
export interface CustomerStats {
    totalCustomers: number;
    totalVerified: number;
    activeUsers: number;
    riskDistribution: {
        low: number;
        medium: number;
        high: number;
    };
    recentActivity: {
        lastMonth: number; // percentage change
        trend: 'up' | 'down';
    };
}
