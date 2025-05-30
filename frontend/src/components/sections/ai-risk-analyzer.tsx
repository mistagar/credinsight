'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    Brain,
    AlertTriangle,
    Shield,
    Loader2,
    Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAIRiskAssessment } from '@/lib/api/ai-risk-hooks';
import { RiskLevel } from '@/lib/api/types';

interface AIRiskAnalyzerProps {
    customerId: string;
    customerName: string;
}

export function AIRiskAnalyzer({
    customerId,
    customerName,
}: AIRiskAnalyzerProps) {
    const [showAnalysis, setShowAnalysis] = useState(false); const {
        assessRisk,
        isLoading,
        error,
        result,
        analysis,
        streamingText,
        isStreaming,
    } = useAIRiskAssessment();

    const handleAssessRisk = () => {
        setShowAnalysis(true);
        assessRisk(customerId);
    };

    const getRiskLevelInfo = (level: number) => {
        switch (level) {
            case RiskLevel.Low:
                return {
                    label: 'Low Risk',
                    color: 'text-green-400',
                    bgColor: 'bg-green-500/20',
                    borderColor: 'border-green-500/30',
                    icon: Shield,
                };
            case RiskLevel.Medium:
                return {
                    label: 'Medium Risk',
                    color: 'text-yellow-400',
                    bgColor: 'bg-yellow-500/20',
                    borderColor: 'border-yellow-500/30',
                    icon: AlertTriangle,
                };
            case RiskLevel.High:
                return {
                    label: 'High Risk',
                    color: 'text-red-400',
                    bgColor: 'bg-red-500/20',
                    borderColor: 'border-red-500/30',
                    icon: AlertTriangle,
                };
            default:
                return {
                    label: 'Unknown',
                    color: 'text-gray-400',
                    bgColor: 'bg-gray-500/20',
                    borderColor: 'border-gray-500/30',
                    icon: Activity,
                };
        }
    }; return (
        <Card className="bg-slate-900/50 border-slate-700/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                    <Brain className="w-5 h-5 text-purple-400" />
                    AI Risk Analysis - {customerName}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {!showAnalysis ? (
                    <div className="text-center py-6">
                        <Button
                            onClick={handleAssessRisk}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                            <Brain className="w-4 h-4 mr-2" />
                            Start AI Risk Analysis
                        </Button>
                        <p className="text-gray-400 text-sm mt-2">
                            Get real-time AI-powered risk assessment
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Risk Score and Level */}
                        <AnimatePresence>
                            {result && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <Card className="bg-slate-800/50 border-slate-600/50">
                                            <CardContent className="p-4">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-white mb-1">
                                                        {result.score}%
                                                    </div>
                                                    <div className="text-sm text-gray-400">Risk Score</div>
                                                    <Progress
                                                        value={result.score}
                                                        className="mt-2" style={{
                                                            '--progress-background': result.score >= 70
                                                                ? 'rgb(239 68 68)'
                                                                : result.score >= 40
                                                                    ? 'rgb(245 158 11)'
                                                                    : 'rgb(34 197 94)'
                                                        } as React.CSSProperties}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-slate-800/50 border-slate-600/50">
                                            <CardContent className="p-4">
                                                <div className="text-center">
                                                    {(() => {
                                                        const riskInfo = getRiskLevelInfo(result.level);
                                                        const Icon = riskInfo.icon;
                                                        return (
                                                            <div>
                                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                                    <Icon className={`w-5 h-5 ${riskInfo.color}`} />
                                                                </div>
                                                                <Badge className={`${riskInfo.bgColor} ${riskInfo.color} ${riskInfo.borderColor}`}>
                                                                    {riskInfo.label}
                                                                </Badge>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* AI Analysis Stream */}
                        <Card className="bg-slate-800/50 border-slate-600/50">
                            <CardHeader>
                                <CardTitle className="text-lg text-white flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-blue-400" />
                                    AI Analysis
                                    {isLoading && (
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>                                <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
                                {isLoading && !streamingText && !analysis && (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>AI is analyzing customer data...</span>
                                        </div>
                                    </div>
                                )}                                {(streamingText || analysis) && (<motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="prose prose-invert prose-sm max-w-none [&>*]:text-gray-300 [&_h1]:text-blue-400 [&_h2]:text-blue-300 [&_h3]:text-blue-200 [&_strong]:text-white [&_em]:text-blue-200 [&_code]:bg-slate-800 [&_code]:text-green-400"
                                >
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h1: ({ children }) => <h1 className="text-xl font-bold text-blue-400 mb-2">{children}</h1>,
                                            h2: ({ children }) => <h2 className="text-lg font-semibold text-blue-300 mb-2">{children}</h2>,
                                            h3: ({ children }) => <h3 className="text-md font-semibold text-blue-200 mb-2">{children}</h3>,
                                            p: ({ children }) => <p className="text-gray-300 mb-2">{children}</p>,
                                            ul: ({ children }) => <ul className="list-disc pl-4 mb-2 text-gray-300">{children}</ul>,
                                            ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 text-gray-300">{children}</ol>,
                                            li: ({ children }) => <li className="mb-1">{children}</li>,
                                            strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                                            em: ({ children }) => <em className="italic text-blue-200">{children}</em>,
                                            code: ({ children }) => <code className="bg-slate-800 text-green-400 px-1 py-0.5 rounded text-sm">{children}</code>,
                                            blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400">{children}</blockquote>,
                                        }}
                                    >
                                        {streamingText || analysis}
                                    </ReactMarkdown>
                                    {isStreaming && (
                                        <motion.span
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className="text-blue-400"
                                        >
                                            ▋
                                        </motion.span>
                                    )}
                                </motion.div>
                                )}

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-red-400 p-4 bg-red-500/10 rounded-lg border border-red-500/20"
                                    >
                                        <AlertTriangle className="w-4 h-4 inline mr-2" />
                                        {error}
                                    </motion.div>
                                )}
                            </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowAnalysis(false)}
                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                            >
                                Reset
                            </Button>
                            <Button
                                onClick={handleAssessRisk}
                                disabled={isLoading}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Brain className="w-4 h-4 mr-2" />
                                        Re-analyze
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
