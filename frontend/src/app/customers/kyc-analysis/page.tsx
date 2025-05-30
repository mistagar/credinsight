'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useKYCAnalysis } from '@/lib/api/kyc-hooks';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, UserCheck, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export default function KYCAnalysisPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [analysis, setAnalysis] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const kycAnalysisMutation = useKYCAnalysis();
    const customerId = searchParams.get('customerId');
    const fullName = searchParams.get('fullName');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    const street = searchParams.get('street');
    const city = searchParams.get('city');
    const region = searchParams.get('region');
    const postalCode = searchParams.get('postalCode');

    useEffect(() => {
        const performAnalysis = async () => {
            if (!fullName || !email) {
                setError('Missing required customer information');
                setIsLoading(false);
                return;
            }

            try {
                const result = await kycAnalysisMutation.mutateAsync({
                    fullName,
                    email,
                    phone: phone || '',
                    street: street || '',
                    city: city || '',
                    region: region || '',
                    postalCode: postalCode || '',
                });
                setAnalysis(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to perform KYC analysis');
            } finally {
                setIsLoading(false);
            }
        };

        performAnalysis();
    }, [fullName, email, phone, street, city, region, postalCode]);

    if (isLoading) {
        return (
            <div className='flex flex-col items-center justify-center min-h-[60vh]'>
                <motion.div
                    className='w-16 h-16 rounded-full'
                    style={{
                        background: 'linear-gradient(90deg, #4776E6 0%, #8E54E9 100%)',
                        backgroundSize: '200% 200%',
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <p className='mt-4 text-lg text-gray-600 dark:text-zinc-400'>
                    Performing KYC Analysis...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='p-6 text-red-600 border border-red-300 rounded-lg bg-red-50 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400'
            >
                <h2 className='mb-2 text-xl font-bold'>Analysis Error</h2>
                <p>{error}</p>
                <Link href={customerId ? `/customers/${customerId}` : '/customers'}>
                    <Button variant="outline" className="mt-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {customerId ? 'Back to Customer Details' : 'Back to Customers'}
                    </Button>
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='max-w-5xl mx-auto space-y-6 p-6'
        >
            <div className='flex items-center justify-between'>
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className='flex items-center gap-4'
                >
                    <Link href={customerId ? `/customers/${customerId}` : '/customers'}>
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {customerId ? 'Back to Customer Details' : 'Back to Customers'}
                        </Button>
                    </Link>
                    <h1 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent'>
                        KYC Analysis Results
                    </h1>
                </motion.div>
            </div>

            <Card className='overflow-hidden border border-gray-200 bg-white shadow-xl dark:bg-zinc-900/70 dark:border-zinc-700'>
                <CardHeader>
                    <CardTitle className='text-xl font-semibold flex items-center gap-2'>
                        <UserCheck className='w-5 h-5 text-blue-500' />
                        Customer Information
                    </CardTitle>
                    <CardDescription>
                        Analysis for {fullName}
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                    {/* Analysis Overview */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <p className='text-sm font-medium text-gray-500 dark:text-zinc-400'>Name</p>
                            <p className='text-lg font-medium text-gray-900 dark:text-white'>{fullName}</p>
                        </div>
                        <div className='space-y-2'>
                            <p className='text-sm font-medium text-gray-500 dark:text-zinc-400'>Email</p>
                            <p className='text-lg font-medium text-gray-900 dark:text-white'>{email}</p>
                        </div>
                    </div>

                    {/* Analysis Results */}
                    {analysis && (
                        <div className='space-y-6 pt-6 border-t border-gray-200 dark:border-zinc-700'>
                            <h3 className='text-lg font-medium text-gray-900 dark:text-white'>Analysis Results</h3>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='space-y-4'>
                                    <div className='flex justify-between items-center p-4 bg-gray-50 rounded-lg dark:bg-zinc-800'>
                                        <span className='text-sm font-medium'>Health Status</span>                                        <Badge variant={analysis.healthStatus === 'critical' ? 'destructive' :
                                            analysis.healthStatus === 'severe' ? 'destructive' :
                                                analysis.healthStatus === 'moderate' ? 'secondary' : 'default'}>
                                            {analysis.healthStatus}
                                        </Badge>
                                    </div>
                                    <div className='flex justify-between items-center p-4 bg-gray-50 rounded-lg dark:bg-zinc-800'>
                                        <span className='text-sm font-medium'>Suspicion Level</span>                                        <Badge variant={analysis.suspicionLevel === 'critical' ? 'destructive' :
                                            analysis.suspicionLevel === 'severe' ? 'destructive' :
                                                analysis.suspicionLevel === 'moderate' ? 'secondary' : 'default'}>
                                            {analysis.suspicionLevel}
                                        </Badge>
                                    </div>
                                </div>
                                <div className='space-y-4'>
                                    <div className='flex justify-between items-center p-4 bg-gray-50 rounded-lg dark:bg-zinc-800'>
                                        <span className='text-sm font-medium'>Email Authenticity</span>                                        <Badge variant={analysis.emailAuthenticity === 'critical' ? 'destructive' :
                                            analysis.emailAuthenticity === 'severe' ? 'destructive' :
                                                analysis.emailAuthenticity === 'moderate' ? 'secondary' : 'default'}>
                                            {analysis.emailAuthenticity}
                                        </Badge>
                                    </div>
                                    <div className='flex justify-between items-center p-4 bg-gray-50 rounded-lg dark:bg-zinc-800'>
                                        <span className='text-sm font-medium'>Name Authenticity</span>                                        <Badge variant={analysis.nameAuthenticity === 'critical' ? 'destructive' :
                                            analysis.nameAuthenticity === 'severe' ? 'destructive' :
                                                analysis.nameAuthenticity === 'moderate' ? 'secondary' : 'default'}>
                                            {analysis.nameAuthenticity}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Analysis Explanation */}
                            <div className='mt-6 p-4 bg-gray-50 rounded-lg dark:bg-zinc-800'>
                                <h4 className='text-sm font-medium mb-2'>Detailed Analysis</h4>
                                <p className='text-sm text-gray-600 dark:text-zinc-400 whitespace-pre-line'>
                                    {analysis.explanation}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex justify-end gap-4 pt-4'>
                                <Link href={customerId ? `/customers/${customerId}` : '/customers'}>
                                    <Button variant="default">
                                        {customerId ? 'View Customer Details' : 'Back to Customers'}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
