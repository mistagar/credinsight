import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';

interface TransactionAnalysisResult {
    healthStatus: 'mild' | 'moderate' | 'severe' | 'critical';
    suspicionLevel: 'mild' | 'moderate' | 'severe' | 'critical';
    variationFromNorm: 'mild' | 'moderate' | 'severe' | 'critical';
    explanation: string;
}

interface LocationAnalysisResult {
    riskLevel: 'Low' | 'Medium' | 'High';
    reason: string;
    overlaps?: string[];
    findings?: string;
    suspiciousPatterns?: string[];
    locationOverlaps?: Array<{ location: string; count: number }>;
    ipAddressPatterns?: Array<{ ipAddress: string; suspicionLevel: string }>;
    recommendations?: string[];
}

interface Transaction {
    id: string;
    amount: number;
    sourceAccount: string;
    destinationAccount: string;
    timestamp: string;
}

interface LoginActivity {
    id: string;
    loginTime: string;
    ipAddress: string;
    location: string;
    device: string;
    usedVPNOrProxy: boolean;
}

interface UseTransactionAnalysisReturn {
    analyzeTransactions: (customerId: string, transactions: Transaction[]) => void;
    isLoading: boolean;
    error: string | null;
    result: TransactionAnalysisResult | null;
}

interface UseLocationAnalysisReturn {
    analyzeLocation: (customerId: string, loginActivities: LoginActivity[]) => void;
    isLoading: boolean;
    error: string | null;
    result: LocationAnalysisResult | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7020/api';

export function useTransactionAnalysis(): UseTransactionAnalysisReturn {
    const [result, setResult] = useState<TransactionAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null); const analysisMutation = useMutation<TransactionAnalysisResult, Error, { customerId: string; transactions: Transaction[] }>({
        mutationFn: async ({ customerId, transactions }) => {
            try {
                const response = await fetch(`${API_BASE_URL}/AI/analyze-transactions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        customerId,
                        transactions: transactions.map(t => ({
                            TransactionId: t.id,
                            UserId: customerId,
                            Category: 'transfer', // Default category
                            Amount: t.amount,
                            Date: t.timestamp
                        }))
                    }),
                }); if (!response.ok) {
                    if (response.status === 503) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.error || 'AI service is temporarily unavailable due to rate limiting. Please try again in a few minutes.');
                    }
                    throw new Error(`Transaction analysis failed: ${response.statusText}`);
                }

                const data = await response.json();

                // Parse the AI response which should be in JSON format
                try {
                    const analysisResult = typeof data.analysis === 'string'
                        ? JSON.parse(data.analysis)
                        : data.analysis;

                    return {
                        healthStatus: analysisResult.healthStatus || 'mild',
                        suspicionLevel: analysisResult.suspicionLevel || 'mild',
                        variationFromNorm: analysisResult.variationFromNorm || 'mild',
                        explanation: analysisResult.explanation || 'No detailed analysis available'
                    };
                } catch (parseError) {
                    // If parsing fails, try to extract from plain text response
                    const text = data.analysis || data.result || '';
                    return {
                        healthStatus: text.toLowerCase().includes('critical') ? 'critical' :
                            text.toLowerCase().includes('severe') ? 'severe' :
                                text.toLowerCase().includes('moderate') ? 'moderate' : 'mild',
                        suspicionLevel: text.toLowerCase().includes('critical') ? 'critical' :
                            text.toLowerCase().includes('severe') ? 'severe' :
                                text.toLowerCase().includes('moderate') ? 'moderate' : 'mild',
                        variationFromNorm: text.toLowerCase().includes('critical') ? 'critical' :
                            text.toLowerCase().includes('severe') ? 'severe' :
                                text.toLowerCase().includes('moderate') ? 'moderate' : 'mild',
                        explanation: text
                    };
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(message);
            }
        },
        onMutate: () => {
            setError(null);
            setResult(null);
        },
        onSuccess: (data) => {
            setResult(data);
        },
        onError: (error: Error) => {
            setError(error.message);
        },
    });

    const analyzeTransactions = useCallback((customerId: string, transactions: Transaction[]) => {
        analysisMutation.mutate({ customerId, transactions });
    }, [analysisMutation]);

    return {
        analyzeTransactions,
        isLoading: analysisMutation.isPending,
        error,
        result,
    };
}

export function useLocationAnalysis(): UseLocationAnalysisReturn {
    const [result, setResult] = useState<LocationAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null); const analysisMutation = useMutation<LocationAnalysisResult, Error, { customerId: string; loginActivities: LoginActivity[] }>({
        mutationFn: async ({ customerId, loginActivities }) => {
            try {
                const response = await fetch(`${API_BASE_URL}/AI/analyze-location`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        customerId,
                        loginActivities: loginActivities.map(l => ({
                            TransactionId: l.id,
                            UserId: customerId,
                            Location: l.location,
                            IPAddress: l.ipAddress,
                            Date: l.loginTime
                        }))
                    }),
                }); if (!response.ok) {
                    if (response.status === 503) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.error || 'AI service is temporarily unavailable due to rate limiting. Please try again in a few minutes.');
                    }
                    throw new Error(`Location analysis failed: ${response.statusText}`);
                }

                const data = await response.json();
                const text = data.analysis || data.result || '';

                // Extract risk level from the response
                const riskLevel = text.toLowerCase().includes('high') ? 'High' :
                    text.toLowerCase().includes('medium') ? 'Medium' : 'Low';

                return {
                    riskLevel,
                    reason: text,
                    overlaps: [],
                    findings: text
                };
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(message);
            }
        },
        onMutate: () => {
            setError(null);
            setResult(null);
        },
        onSuccess: (data) => {
            setResult(data);
        },
        onError: (error: Error) => {
            setError(error.message);
        },
    });

    const analyzeLocation = useCallback((customerId: string, loginActivities: LoginActivity[]) => {
        analysisMutation.mutate({ customerId, loginActivities });
    }, [analysisMutation]);

    return {
        analyzeLocation,
        isLoading: analysisMutation.isPending,
        error,
        result,
    };
}
