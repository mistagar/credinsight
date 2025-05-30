'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, AlertTriangle, CheckCircle, XCircle, Shield } from 'lucide-react';
import { useLocationAnalysis } from '@/lib/api/analysis-hooks';

interface LoginActivity {
    id: string;
    loginTime: string;
    ipAddress: string;
    location: string;
    device: string;
    usedVPNOrProxy: boolean;
}

interface LocationOverlap {
    location: string;
    count: number;
}

interface IPAddressPattern {
    ipAddress: string;
    suspicionLevel: string;
}

interface LocationAnalyzerProps {
    customerId: string;
    loginActivities: LoginActivity[];
}

export function LocationAnalyzer({ customerId, loginActivities }: LocationAnalyzerProps) {
    const { analyzeLocation, isLoading, error, result } = useLocationAnalysis();

    const handleAnalyze = () => {
        analyzeLocation(customerId, loginActivities);
    };

    const getRiskLevelBadge = (riskLevel: string) => {
        switch (riskLevel?.toLowerCase()) {
            case 'low':
                return (
                    <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Low Risk
                    </Badge>
                );
            case 'medium':
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Medium Risk
                    </Badge>
                );
            case 'high':
                return (
                    <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        High Risk
                    </Badge>
                );
            default:
                return (
                    <Badge variant="secondary">
                        <Shield className="w-3 h-3 mr-1" />
                        Unknown
                    </Badge>
                );
        }
    };

    const getRiskIcon = (riskLevel: string) => {
        switch (riskLevel?.toLowerCase()) {
            case 'low':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'medium':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'high':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Shield className="w-5 h-5 text-gray-500" />;
        }
    };

    if (loginActivities.length === 0) {
        return (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 dark:bg-zinc-800/50 dark:border-zinc-700">
                <p className="text-sm text-gray-600 dark:text-zinc-400 text-center">
                    No login activities available for location analysis
                </p>
            </div>
        );
    }

    return (
        <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200 dark:bg-purple-950/30 dark:border-purple-800">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-full dark:bg-purple-900/50">
                        <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h4 className="font-medium text-purple-900 dark:text-purple-100">
                            AI Location Analysis
                        </h4>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                            Analyze location patterns against blacklisted users
                        </p>
                    </div>
                </div>
                <Button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <MapPin className="w-4 h-4 mr-2" />
                            Analyze Locations
                        </>
                    )}
                </Button>
            </div>            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 rounded-lg border border-red-200 dark:bg-red-950/30 dark:border-red-800"
                >
                    <div className="flex items-center space-x-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-700 dark:text-red-400">
                            {error.includes('rate limit') || error.includes('temporarily unavailable')
                                ? '⚠️ AI service is temporarily busy. Please try again in a few minutes.'
                                : `Error analyzing locations: ${error}`
                            }
                        </span>
                    </div>
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >                    {/* Risk Assessment Card */}
                    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-lg dark:bg-zinc-900/70 dark:border-zinc-700">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full">
                                    {getRiskIcon(result.riskLevel)}
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">
                                    Location Risk Assessment
                                </h4>
                            </div>
                            <div className="scale-110">
                                {getRiskLevelBadge(result.riskLevel)}
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-md border border-gray-100 dark:border-zinc-700">
                                <h5 className="font-semibold text-gray-800 dark:text-zinc-200 mb-3 text-base">
                                    Analysis Summary
                                </h5>
                                <p className="text-gray-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                                    {result.reason}
                                </p>
                            </div>                            {result.suspiciousPatterns && result.suspiciousPatterns.length > 0 && (
                                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                                    <h5 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 text-base flex items-center">
                                        <AlertTriangle className="w-5 h-5 mr-2" />
                                        Suspicious Patterns Detected
                                    </h5>
                                    <div className="space-y-3">
                                        {result.suspiciousPatterns.map((pattern: string, index: number) => (
                                            <div
                                                key={index}
                                                className="flex items-start space-x-2 p-3 bg-yellow-100/50 rounded-md border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700"
                                            >
                                                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                                                <span className="font-medium text-yellow-800 dark:text-yellow-200">
                                                    {pattern}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}                            {result.locationOverlaps && result.locationOverlaps.length > 0 && (
                                <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-md border-l-4 border-red-400 dark:border-red-600">
                                    <h5 className="font-semibold text-red-800 dark:text-red-300 mb-3 text-base flex items-center">
                                        <XCircle className="w-5 h-5 mr-2" />
                                        Location Overlaps with Blacklisted Users
                                    </h5>
                                    <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {result.locationOverlaps?.map((overlap: LocationOverlap, index: number) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-red-100/70 rounded-md border border-red-200 dark:bg-red-900/20 dark:border-red-700 shadow-sm"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <div className="bg-red-200 dark:bg-red-800/50 p-1.5 rounded-full">
                                                        <MapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                    </div>
                                                    <span className="font-semibold text-red-800 dark:text-red-200">
                                                        {overlap.location}
                                                    </span>
                                                </div>
                                                <Badge variant="destructive" className="text-sm font-bold">
                                                    {overlap.count} {overlap.count === 1 ? 'overlap' : 'overlaps'}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}                            {result.ipAddressPatterns && result.ipAddressPatterns.length > 0 && (
                                <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-md border-l-4 border-orange-400 dark:border-orange-600">
                                    <h5 className="font-semibold text-orange-800 dark:text-orange-300 mb-3 text-base flex items-center">
                                        <Shield className="w-5 h-5 mr-2" />
                                        IP Address Analysis
                                    </h5>
                                    <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {result.ipAddressPatterns?.map((pattern: IPAddressPattern, index: number) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-orange-100/70 rounded-md border border-orange-200 dark:bg-orange-900/20 dark:border-orange-700 shadow-sm"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <div className="bg-orange-200 dark:bg-orange-800/50 p-1.5 rounded-full">
                                                        <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                                    </div>
                                                    <span className="font-mono font-semibold text-orange-800 dark:text-orange-200">
                                                        {pattern.ipAddress}
                                                    </span>
                                                </div>
                                                <Badge
                                                    className={`font-bold ${pattern.suspicionLevel === 'high' ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300' :
                                                            pattern.suspicionLevel === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                                'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300'
                                                        }`}
                                                >
                                                    {pattern.suspicionLevel.charAt(0).toUpperCase() + pattern.suspicionLevel.slice(1)} suspicion
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>                    {/* Recommendations */}
                    {result.recommendations && result.recommendations.length > 0 && (
                        <div className="p-5 bg-blue-50 rounded-lg border border-blue-200 shadow-md dark:bg-blue-950/30 dark:border-blue-800">
                            <h5 className="font-bold text-blue-900 dark:text-blue-100 mb-3 text-lg flex items-center">
                                <Shield className="w-5 h-5 mr-2" />
                                Security Recommendations
                            </h5>
                            <ul className="space-y-3">
                                {result.recommendations.map((recommendation: string, index: number) => (
                                    <li key={index} className="text-blue-800 dark:text-blue-300 flex items-start bg-blue-100/50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-700">
                                        <CheckCircle className="w-5 h-5 mr-3 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                        <span className="font-medium">{recommendation}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
