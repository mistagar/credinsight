'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Search, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useTransactionAnalysis } from '@/lib/api/analysis-hooks';

interface Transaction {
    id: string;
    amount: number;
    sourceAccount: string;
    destinationAccount: string;
    timestamp: string;
}

interface TransactionAnalyzerProps {
    customerId: string;
    transactions: Transaction[];
}

export function TransactionAnalyzer({ customerId, transactions }: TransactionAnalyzerProps) {
    const { analyzeTransactions, isLoading, error, result } = useTransactionAnalysis();

    const handleAnalyze = () => {
        analyzeTransactions(customerId, transactions);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'critical':
                return <Badge className="bg-red-100 text-red-800 border-red-200">Critical</Badge>;
            case 'severe':
                return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Severe</Badge>;
            case 'moderate':
                return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Moderate</Badge>;
            case 'mild':
                return <Badge className="bg-green-100 text-green-800 border-green-200">Mild</Badge>;
            default:
                return <Badge variant="secondary">Unknown</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'critical':
            case 'severe':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'moderate':
                return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            case 'mild':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            default:
                return <AlertTriangle className="w-4 h-4 text-gray-500" />;
        }
    };

    if (transactions.length === 0) {
        return (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 dark:bg-zinc-800/50 dark:border-zinc-700">
                <p className="text-sm text-gray-600 dark:text-zinc-400 text-center">
                    No transactions available for analysis
                </p>
            </div>
        );
    }

    return (
        <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200 dark:bg-blue-950/30 dark:border-blue-800">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900/50">
                        <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100">
                            AI Transaction Analysis
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Analyze transaction patterns for suspicious activity
                        </p>
                    </div>
                </div>
                <Button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Search className="w-4 h-4 mr-2" />
                            Analyze Transactions
                        </>
                    )}
                </Button>
            </div>            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950/30 dark:border-red-800"
                >
                    <p className="text-sm text-red-700 dark:text-red-300">
                        {error.includes('rate limit') || error.includes('temporarily unavailable')
                            ? '⚠️ AI service is temporarily busy. Please try again in a few minutes.'
                            : `Analysis failed: ${error}`
                        }
                    </p>
                    {(error.includes('rate limit') || error.includes('temporarily unavailable')) && (
                        <Button
                            onClick={handleAnalyze}
                            size="sm"
                            variant="outline"
                            className="mt-2"
                        >
                            Try Again
                        </Button>
                    )}
                </motion.div>
            )}

            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-zinc-900/70 dark:border-zinc-700"
                >
                    <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-zinc-100">
                        Transaction Analysis Results
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-zinc-800/50">
                            <div className="flex items-center space-x-2">
                                {getStatusIcon(result.healthStatus)}
                                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                                    Health Status
                                </span>
                            </div>
                            {getStatusBadge(result.healthStatus)}
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-zinc-800/50">
                            <div className="flex items-center space-x-2">
                                {getStatusIcon(result.suspicionLevel)}
                                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                                    Suspicion Level
                                </span>
                            </div>
                            {getStatusBadge(result.suspicionLevel)}
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-zinc-800/50">
                            <div className="flex items-center space-x-2">
                                {getStatusIcon(result.variationFromNorm)}
                                <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                                    Variation from Norm
                                </span>
                            </div>
                            {getStatusBadge(result.variationFromNorm)}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg dark:bg-zinc-800/50">
                        <h5 className="font-medium text-gray-900 dark:text-zinc-100 mb-2">
                            Analysis Explanation
                        </h5>
                        <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">
                            {result.explanation}
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
