import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from './customer-hooks';
import { RiskLevel } from './types';

interface AIRiskAssessmentResult {
    score: number;
    level: RiskLevel;
    assessmentId: string;
    analysis: string;
}

interface UseAIRiskAssessmentReturn {
    assessRisk: (customerId: string) => void;
    isLoading: boolean;
    error: string | null;
    result: AIRiskAssessmentResult | null;
    analysis: string;
    streamingText: string;
    isStreaming: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7020/api';

export function useAIRiskAssessment(): UseAIRiskAssessmentReturn {
    const [result, setResult] = useState<AIRiskAssessmentResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [streamingText, setStreamingText] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const queryClient = useQueryClient();

    const assessmentMutation = useMutation<AIRiskAssessmentResult, Error, string>({
        mutationFn: async (customerId: string) => {
            try {
                const response = await fetch(`${API_BASE_URL}/AI/assess-risk/${customerId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log('AI Risk Assessment Response:', response);

                if (!response.ok) {
                    throw new Error(`Assessment failed: ${response.statusText}`);
                } const data = await response.json();
                const analysisText = data.aiAnalysis || '';

                // Extract risk score and level from AI analysis text
                // Look for patterns like "Risk Score:** 93/100" or "Score: 93"
                const scoreMatch = analysisText.match(/\*\*Risk\s+Score:\*\*\s*(\d{1,3})(?:\/100)?/i) ||
                    analysisText.match(/(?:risk\s+score|score)(?:[:\s]*|:\s*|is\s*)(\d{1,3})/i);

                // Look for patterns like "Risk Level Classification:** High" or "Risk Level: High"
                const levelMatch = analysisText.match(/\*\*Risk\s+Level\s+Classification:\*\*\s*(\w+)/i) ||
                    analysisText.match(/risk\s+level(?:[:\s]*|:\s*|is\s*)(\w+)/i);

                // Use AI-extracted values if available, otherwise fall back to backend values
                let extractedScore = data.assessment.score; // fallback
                let extractedLevel = data.assessment.level as RiskLevel; // fallback

                // Prioritize AI analysis score
                if (scoreMatch) {
                    const parsedScore = parseInt(scoreMatch[1], 10);
                    extractedScore = Math.min(100, Math.max(0, parsedScore));
                    console.log(`AI Score extracted: ${extractedScore} (original: ${data.assessment.score})`);
                }

                // Prioritize AI analysis level
                if (levelMatch) {
                    const levelText = levelMatch[1].toLowerCase();
                    if (levelText.includes('high')) {
                        extractedLevel = RiskLevel.High;
                    } else if (levelText.includes('medium') || levelText.includes('moderate')) {
                        extractedLevel = RiskLevel.Medium;
                    } else if (levelText.includes('low')) {
                        extractedLevel = RiskLevel.Low;
                    }
                    console.log(`AI Risk Level extracted: ${extractedLevel} (original: ${data.assessment.level})`);
                } const assessmentResult: AIRiskAssessmentResult = {
                    score: extractedScore,
                    level: extractedLevel,
                    assessmentId: data.assessment.id,
                    analysis: analysisText,
                };

                console.log('Final Assessment Result:', {
                    aiScore: extractedScore,
                    backendScore: data.assessment.score,
                    aiLevel: extractedLevel,
                    backendLevel: data.assessment.level,
                    assessmentId: data.assessment.id
                });

                // Setup streaming text effect
                let currentIndex = 0;
                const streamInterval = setInterval(() => {
                    if (currentIndex < analysisText.length) {
                        const chunkSize = Math.min(5, analysisText.length - currentIndex);
                        setStreamingText(prev => prev + analysisText.slice(currentIndex, currentIndex + chunkSize));
                        currentIndex += chunkSize;
                    } else {
                        clearInterval(streamInterval);
                        setIsStreaming(false);
                    }
                }, 50);

                return assessmentResult;
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error occurred';
                throw new Error(message);
            }
        },
        onMutate: () => {
            setError(null);
            setResult(null);
            setStreamingText('');
            setIsStreaming(true);
        },
        onSuccess: (data) => {
            setResult(data);
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.customers] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.customer, data.assessmentId] });
        },
        onError: (error: Error) => {
            setError(error.message);
            setIsStreaming(false);
        },
    });

    const assessRisk = useCallback((customerId: string) => {
        assessmentMutation.mutate(customerId);
    }, [assessmentMutation]);

    return {
        assessRisk,
        isLoading: assessmentMutation.isPending,
        error,
        result,
        analysis: result?.analysis || '',
        streamingText,
        isStreaming,
    };
}
