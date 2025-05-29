"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Monitor,
    Shield,
    AlertTriangle,
    ChevronLeft,
    User,
    FileText
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useCustomer, useAssessCustomerRisk } from "@/lib/api/customer-hooks";
import { Customer, RiskLevel } from "@/lib/api/types";

// Component for risk assessment button
function AssessRiskButton({ customerId }: { customerId: string }) {
    const assessRiskMutation = useAssessCustomerRisk();

    const handleAssessRisk = async () => {
        try {
            await assessRiskMutation.mutateAsync(customerId);
        } catch (error) {
            console.error("Error assessing risk:", error);
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${assessRiskMutation.isPending
                ? 'bg-purple-900/50 text-purple-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                }`}
            onClick={handleAssessRisk}
            disabled={assessRiskMutation.isPending}
        >
            {assessRiskMutation.isPending ? 'Assessing Risk...' : 'Perform Risk Assessment'}
        </motion.button>
    );
}

export default function CustomerDetails({ id }: { id: string }) {
    const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "logins">("overview");

    const {
        data: customer,
        isLoading,
        error
    } = useCustomer(id);

    // Handle loading state
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <motion.div
                    className="w-16 h-16 rounded-full"
                    style={{
                        background: "linear-gradient(90deg, #4776E6 0%, #8E54E9 100%)",
                        backgroundSize: "200% 200%"
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <p className="mt-4 text-lg text-zinc-300 dark:text-zinc-400">Loading customer details...</p>
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 text-red-400 border border-red-800 rounded-lg bg-red-900/20 dark:bg-red-950/30 dark:border-red-900"
            >
                <h2 className="mb-2 text-xl font-bold">Error loading customer</h2>
                <p>{(error as Error)?.message || "An unknown error occurred"}</p>
                <Link href="/customers">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4 flex items-center px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md hover:bg-zinc-800 text-white dark:bg-zinc-800 dark:border-zinc-600 dark:hover:bg-zinc-700"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back to customers
                    </motion.button>
                </Link>
            </motion.div>
        );
    }
    // Handle not found state
    if (!customer) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 text-amber-400 border border-amber-800 rounded-lg bg-amber-900/20 dark:bg-amber-950/30 dark:border-amber-900"
            >
                <h2 className="mb-2 text-xl font-bold">Customer not found</h2>
                <p>The requested customer could not be found.</p>
                <Link href="/customers">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4 flex items-center px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md hover:bg-zinc-800 text-white dark:bg-zinc-800 dark:border-zinc-600 dark:hover:bg-zinc-700"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back to customers
                    </motion.button>
                </Link>
            </motion.div>
        );
    }

    // Ensure transactions and loginActivities are arrays
    const transactions = Array.isArray(customer.transactions) ? customer.transactions : [];
    const loginActivities = Array.isArray(customer.loginActivities) ? customer.loginActivities : [];

    // Format the risk level display
    const getRiskLevelBadge = (riskLevel: RiskLevel) => {
        switch (riskLevel) {
            case RiskLevel.Low:
                return (
                    <Badge className="bg-gradient-to-r from-green-700/30 to-green-600/30 text-green-400 border border-green-800/50">
                        <Shield className="w-3 h-3 mr-1" /> Low Risk
                    </Badge>
                );
            case RiskLevel.Medium:
                return (
                    <Badge className="bg-gradient-to-r from-yellow-700/30 to-yellow-600/30 text-yellow-400 border border-yellow-800/50">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Medium Risk
                    </Badge>
                );
            case RiskLevel.High:
                return (
                    <Badge className="bg-gradient-to-r from-red-700/30 to-red-600/30 text-red-400 border border-red-800/50">
                        <AlertTriangle className="w-3 h-3 mr-1" /> High Risk
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-zinc-700/30 text-zinc-400 border border-zinc-800/50">
                        Unknown
                    </Badge>
                );
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl mx-auto space-y-6"
        >
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="flex items-center justify-between mb-6"
            >
                <div className="flex items-center">
                    <Link href="/customers">
                        <motion.button
                            whileHover={{ x: -3 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center mr-4 px-3 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </motion.button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        {customer.fullName}
                    </h1>
                    <div className="ml-4">{getRiskLevelBadge(customer.riskLevel)}</div>
                </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
                className="border-b border-zinc-800 dark:border-zinc-700"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <nav className="-mb-px flex space-x-8">
                    <motion.button
                        onClick={() => setActiveTab("overview")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "overview"
                            ? "border-blue-600 text-blue-500"
                            : "border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 dark:hover:text-zinc-300 dark:hover:border-zinc-600"
                            }`}
                        whileHover={{ y: -1 }}
                        whileTap={{ y: 0 }}
                    >
                        Overview
                    </motion.button>
                    <motion.button
                        onClick={() => setActiveTab("transactions")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "transactions"
                            ? "border-blue-600 text-blue-500"
                            : "border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 dark:hover:text-zinc-300 dark:hover:border-zinc-600"
                            }`}
                        whileHover={{ y: -1 }}
                        whileTap={{ y: 0 }}
                    >
                        Transactions
                    </motion.button>
                    <motion.button
                        onClick={() => setActiveTab("logins")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "logins"
                            ? "border-blue-600 text-blue-500"
                            : "border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 dark:hover:text-zinc-300 dark:hover:border-zinc-600"
                            }`}
                        whileHover={{ y: -1 }}
                        whileTap={{ y: 0 }}
                    >
                        Login Activity
                    </motion.button>
                </nav>
            </motion.div>

            {/* Content based on active tab */}
            <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                    <motion.div
                        className="grid gap-6 md:grid-cols-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        key="overview"
                        transition={{ duration: 0.2 }}
                    >
                        {/* Customer Information Card */}
                        <motion.div
                            className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/70 shadow-xl dark:bg-zinc-900/70 dark:border-zinc-700"
                            whileHover={{ y: -5, boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-2 rounded-full mr-3 dark:from-blue-600/10 dark:to-purple-600/10">
                                        <User className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-white dark:text-zinc-100">Customer Information</h3>
                                        <p className="text-sm text-zinc-400 dark:text-zinc-400">Personal and account details</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Full Name</p>
                                            <p className="text-white dark:text-zinc-200">{customer.fullName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Email</p>
                                            <p className="text-white dark:text-zinc-200">{customer.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Phone</p>
                                            <p className="text-white dark:text-zinc-200">{customer.phoneNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Address</p>
                                            <p className="text-white dark:text-zinc-200">{customer.address}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-4 border-t border-zinc-800 dark:border-zinc-700">
                                        <div className="flex items-center mb-3">
                                            <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-1.5 rounded-full mr-2 dark:from-purple-600/10 dark:to-blue-600/10">
                                                <AlertTriangle className="h-3.5 w-3.5 text-purple-400" />
                                            </div>
                                            <h4 className="text-sm font-medium text-white dark:text-zinc-100">Risk Factors</h4>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-zinc-300 dark:text-zinc-300">Transaction patterns</p>
                                                <Badge className={customer.riskLevel === RiskLevel.Low
                                                    ? "bg-gradient-to-r from-green-700/30 to-green-600/30 text-green-400 border border-green-800/50"
                                                    : "bg-gradient-to-r from-yellow-700/30 to-yellow-600/30 text-yellow-400 border border-yellow-800/50"
                                                }>
                                                    {customer.riskLevel === RiskLevel.Low ? "Normal" : "Unusual"}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-zinc-300 dark:text-zinc-300">Location verification</p>
                                                <Badge className={customer.riskLevel === RiskLevel.Low
                                                    ? "bg-gradient-to-r from-green-700/30 to-green-600/30 text-green-400 border border-green-800/50"
                                                    : "bg-gradient-to-r from-yellow-700/30 to-yellow-600/30 text-yellow-400 border border-yellow-800/50"
                                                }>
                                                    {customer.riskLevel === RiskLevel.Low ? "Verified" : "Suspicious"}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-zinc-300 dark:text-zinc-300">Document authenticity</p>
                                                <Badge className={customer.riskLevel === RiskLevel.Low
                                                    ? "bg-gradient-to-r from-green-700/30 to-green-600/30 text-green-400 border border-green-800/50"
                                                    : "bg-gradient-to-r from-red-700/30 to-red-600/30 text-red-400 border border-red-800/50"
                                                }>
                                                    {customer.riskLevel === RiskLevel.Low ? "Authentic" : "Requires review"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <AssessRiskButton customerId={customer.id} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Risk Assessment Card */}
                        <motion.div
                            className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/70 shadow-xl dark:bg-zinc-900/70 dark:border-zinc-700"
                            whileHover={{ y: -5, boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-2 rounded-full mr-3 dark:from-blue-600/10 dark:to-purple-600/10">
                                        <Shield className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-white dark:text-zinc-100">Risk Assessment</h3>
                                        <p className="text-sm text-zinc-400 dark:text-zinc-400">Customer risk profile and score</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Risk Score</span>
                                            <span className="font-bold text-white dark:text-zinc-200">{customer.riskScore || 0}%</span>
                                        </div>
                                        <div className="relative">
                                            <Progress
                                                value={customer.riskScore || 0}
                                                className="h-2 bg-zinc-800 dark:bg-zinc-700"
                                            />
                                        </div>
                                        <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-400">
                                            {customer.riskLevel === RiskLevel.Low && "Low risk - Standard monitoring is sufficient"}
                                            {customer.riskLevel === RiskLevel.Medium && "Medium risk - Enhanced due diligence recommended"}
                                            {customer.riskLevel === RiskLevel.High && "High risk - Immediate attention required"}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-zinc-800 dark:border-zinc-700">
                                        <h4 className="mb-4 text-sm font-medium text-white dark:text-zinc-300">Risk Factors</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-zinc-300 dark:text-zinc-300">Transaction patterns</p>
                                                <Badge className={customer.riskLevel === RiskLevel.Low
                                                    ? "bg-gradient-to-r from-green-700/30 to-green-600/30 text-green-400 border border-green-800/50"
                                                    : "bg-gradient-to-r from-yellow-700/30 to-yellow-600/30 text-yellow-400 border border-yellow-800/50"
                                                }>
                                                    {customer.riskLevel === RiskLevel.Low ? "Normal" : "Unusual"}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-zinc-300 dark:text-zinc-300">Location verification</p>
                                                <Badge className={customer.riskLevel === RiskLevel.Low
                                                    ? "bg-gradient-to-r from-green-700/30 to-green-600/30 text-green-400 border border-green-800/50"
                                                    : "bg-gradient-to-r from-yellow-700/30 to-yellow-600/30 text-yellow-400 border border-yellow-800/50"
                                                }>
                                                    {customer.riskLevel === RiskLevel.Low ? "Verified" : "Suspicious"}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-zinc-300 dark:text-zinc-300">Document authenticity</p>
                                                <Badge className={customer.riskLevel === RiskLevel.Low
                                                    ? "bg-gradient-to-r from-green-700/30 to-green-600/30 text-green-400 border border-green-800/50"
                                                    : "bg-gradient-to-r from-red-700/30 to-red-600/30 text-red-400 border border-red-800/50"
                                                }>
                                                    {customer.riskLevel === RiskLevel.Low ? "Authentic" : "Requires review"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Transactions Tab */}
                {activeTab === "transactions" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        key="transactions"
                        transition={{ duration: 0.2 }}
                    >
                        <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/70 shadow-xl dark:bg-zinc-900/70 dark:border-zinc-700">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-2 rounded-full mr-3 dark:from-blue-600/10 dark:to-purple-600/10">
                                        <Calendar className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-white dark:text-zinc-100">Transaction History</h3>
                                        <p className="text-sm text-zinc-400 dark:text-zinc-400">Complete record of customer transactions</p>
                                    </div>
                                </div>

                                {transactions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <motion.div
                                            className="p-4 mb-4 rounded-full bg-zinc-900 dark:bg-zinc-800"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 20
                                            }}
                                        >
                                            <Calendar className="w-8 h-8 text-zinc-400 dark:text-zinc-300" />
                                        </motion.div>
                                        <h3 className="mb-1 text-lg font-medium text-white dark:text-zinc-100">No transactions</h3>
                                        <p className="text-sm text-zinc-400 dark:text-zinc-400">
                                            This customer has not made any transactions yet.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900/20 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/20">
                                                    <TableHead className="text-zinc-400 dark:text-zinc-300">Date</TableHead>
                                                    <TableHead className="text-zinc-400 dark:text-zinc-300">Amount</TableHead>
                                                    <TableHead className="text-zinc-400 dark:text-zinc-300">Source Account</TableHead>
                                                    <TableHead className="text-zinc-400 dark:text-zinc-300">Destination Account</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <AnimatePresence>
                                                    {transactions.map((transaction, index) => (
                                                        <motion.tr
                                                            key={transaction.id}
                                                            className="border-b border-zinc-800 hover:bg-zinc-900/20 dark:border-zinc-700 dark:hover:bg-zinc-800/20"
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.05)' }}
                                                        >
                                                            <TableCell className="text-zinc-300 dark:text-zinc-300">
                                                                {new Date(transaction.timestamp).toLocaleDateString()}
                                                            </TableCell>
                                                            <TableCell className="font-medium text-zinc-300 dark:text-zinc-300">
                                                                ${transaction.amount.toLocaleString()}
                                                            </TableCell>
                                                            <TableCell className="text-zinc-300 dark:text-zinc-300">{transaction.sourceAccount}</TableCell>
                                                            <TableCell className="text-zinc-300 dark:text-zinc-300">{transaction.destinationAccount}</TableCell>
                                                        </motion.tr>
                                                    ))}
                                                </AnimatePresence>
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Login Activity Tab */}
                {activeTab === "logins" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        key="logins"
                        transition={{ duration: 0.2 }}
                    >
                        <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/70 shadow-xl dark:bg-zinc-900/70 dark:border-zinc-700">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-2 rounded-full mr-3">
                                        <Monitor className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-white">Login Activity</h3>
                                        <p className="text-sm text-zinc-400">Recent user login history</p>
                                    </div>
                                </div>

                                {loginActivities.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <motion.div
                                            className="p-4 mb-4 rounded-full bg-zinc-900"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 20
                                            }}
                                        >
                                            <Monitor className="w-8 h-8 text-zinc-400" />
                                        </motion.div>
                                        <h3 className="mb-1 text-lg font-medium text-white">No login activity</h3>
                                        <p className="text-sm text-zinc-400">
                                            This customer has not logged in yet.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900/20 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/20">
                                                    <TableHead className="text-zinc-400">Date & Time</TableHead>
                                                    <TableHead className="text-zinc-400">IP Address</TableHead>
                                                    <TableHead className="text-zinc-400">Location</TableHead>
                                                    <TableHead className="text-zinc-400">Device</TableHead>
                                                    <TableHead className="text-zinc-400">VPN/Proxy</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <AnimatePresence>
                                                    {loginActivities.map((activity, index) => (
                                                        <motion.tr
                                                            key={activity.id}
                                                            className="border-b border-zinc-800 hover:bg-zinc-900/20 dark:border-zinc-700 dark:hover:bg-zinc-800/20"
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.05)' }}
                                                        >
                                                            <TableCell className="text-zinc-300 dark:text-zinc-300">
                                                                {new Date(activity.loginTime).toLocaleString()}
                                                            </TableCell>
                                                            <TableCell className="font-medium text-zinc-300 dark:text-zinc-300">{activity.ipAddress}</TableCell>
                                                            <TableCell className="text-zinc-300 dark:text-zinc-300">{activity.location}</TableCell>
                                                            <TableCell className="text-zinc-300 dark:text-zinc-300">{activity.device}</TableCell>
                                                            <TableCell>
                                                                {activity.usedVPNOrProxy ? (
                                                                    <Badge className="bg-gradient-to-r from-yellow-700/30 to-yellow-600/30 text-yellow-400 border border-yellow-800/50">
                                                                        Yes
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge className="bg-gradient-to-r from-green-700/30 to-green-600/30 text-green-400 border border-green-800/50">
                                                                        No
                                                                    </Badge>
                                                                )}
                                                            </TableCell>
                                                        </motion.tr>
                                                    ))}
                                                </AnimatePresence>
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
