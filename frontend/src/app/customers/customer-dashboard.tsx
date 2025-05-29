'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Shield,
  Search,
  Plus,
  Users,
  UserCheck,
  User,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AddCustomerForm } from '@/components/forms/add-customer-form';
import {
  useCustomers,
  useCustomerStats,
  useAssessCustomerRisk,
} from '@/lib/api/customer-hooks';
import { RiskLevel } from '@/lib/api/types';

export default function CustomerDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: customers = [],
    isLoading: isLoadingCustomers,
    error: customersError,
  } = useCustomers();

  const {
    data: stats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useCustomerStats();

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle loading states
  if (isLoadingCustomers || isLoadingStats) {
    return (
      <div className='flex flex-col items-center justify-center h-64'>
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
          Loading dashboard data...
        </p>
      </div>
    );
  }

  // Handle error states
  if (customersError || statsError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='p-6 text-red-600 border border-red-300 rounded-lg bg-red-50 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400'
      >
        <h2 className='mb-2 text-xl font-bold'>Error loading dashboard</h2>
        <p>
          {(customersError as Error)?.message ||
            (statsError as Error)?.message ||
            'An unknown error occurred'}
        </p>
      </motion.div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  const cardHoverVariants = {
    hover: {
      y: -5,
      boxShadow: '0 10px 30px -15px rgba(79, 70, 229, 0.3)',
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='max-w-5xl mx-auto space-y-8'
    >
      <motion.div
        variants={itemVariants}
        className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'
      >
        <div>
          <h1 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            Customer Overview
          </h1>
          <p className='text-gray-600 dark:text-zinc-400'>
            Manage and monitor all your customers in one place.
          </p>
        </div>
        <div className='flex flex-col sm:flex-row gap-3'>
          <motion.div
            className='relative'
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500 dark:text-zinc-400' />
            <Input
              placeholder='Search customers...'
              className='pl-10 w-full sm:w-[250px] bg-white dark:bg-zinc-900/60 border-gray-300 dark:border-zinc-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>
          <Dialog>
            <DialogTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-md flex items-center justify-center font-medium'
              >
                <Plus className='mr-2 h-4 w-4' /> Add Customer
              </motion.button>
            </DialogTrigger>
            <AddCustomerForm />
          </Dialog>
        </div>
      </motion.div>
      {/* Key Metrics Cards */}
      <motion.div variants={itemVariants} className='grid gap-4 md:grid-cols-3'>
        {' '}
        <motion.div
          variants={cardHoverVariants}
          whileHover='hover'
          className='relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:bg-zinc-900 dark:border-zinc-700'
        >
          <motion.div
            className='absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 dark:from-blue-600/5 dark:to-purple-600/5'
            style={{
              maskImage:
                'radial-gradient(circle at 100% 100%, transparent 25%, black)',
            }}
          />
          <div className='flex items-center mb-2'>
            <Users className='h-5 w-5 text-blue-500 dark:text-blue-400 mr-2' />
            <h3 className='text-sm font-medium text-gray-700 dark:text-zinc-300'>
              Total Customers
            </h3>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
              {(stats?.totalCustomers || 0).toLocaleString()}
            </div>
            <div className='flex items-center text-sm text-green-500 dark:text-green-400'>
              <ChevronUp className='w-4 h-4 mr-1' />
              {stats?.recentActivity?.lastMonth || 0}% vs last month
            </div>
          </div>
        </motion.div>{' '}
        <motion.div
          variants={cardHoverVariants}
          whileHover='hover'
          className='relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:bg-zinc-900 dark:border-zinc-700'
        >
          <motion.div
            className='absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 dark:from-blue-600/5 dark:to-purple-600/5'
            style={{
              maskImage:
                'radial-gradient(circle at 100% 100%, transparent 25%, black)',
            }}
          />
          <div className='flex items-center mb-2'>
            <UserCheck className='h-5 w-5 text-purple-500 dark:text-purple-400 mr-2' />
            <h3 className='text-sm font-medium text-gray-700 dark:text-zinc-300'>
              Verified Customers
            </h3>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
              {(stats?.totalVerified || 0).toLocaleString()}
            </div>
            <div className='flex items-center text-sm text-red-500 dark:text-red-400'>
              <ChevronDown className='w-4 h-4 mr-1' />
              8% vs last month
            </div>
          </div>
        </motion.div>
        <motion.div
          variants={cardHoverVariants}
          whileHover='hover'
          className='relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:bg-zinc-900 dark:border-zinc-700'
        >
          <motion.div
            className='absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 dark:from-blue-600/5 dark:to-purple-600/5'
            style={{
              maskImage:
                'radial-gradient(circle at 100% 100%, transparent 25%, black)',
            }}
          />
          <div className='flex items-center mb-2'>
            <User className='h-5 w-5 text-blue-500 mr-2' />
            <h3 className='text-sm font-medium text-gray-700 dark:text-zinc-300'>
              Active Users
            </h3>
          </div>
          <div className='flex flex-col'>
            <div className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
              {stats?.activeUsers || 0}
            </div>
            <motion.div
              className='flex mt-2'
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                staggerChildren: 0.1,
                delayChildren: 0.2,
              }}
            >
              {Array.from({
                length: Math.min(10, stats?.activeUsers || 0),
              }).map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Avatar
                    key={idx}
                    className='w-8 h-8 border-2 border-white dark:border-zinc-900 -ml-2 first:ml-0 shadow-sm'
                  >
                    <AvatarFallback className='bg-gradient-to-br from-blue-600 to-purple-600 text-white'>
                      {idx + 1}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      {/* Customer List */}
      <motion.div variants={itemVariants}>
        <Card className='overflow-hidden border border-gray-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950/70'>
          <CardHeader className='border-b border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/50'>
            <CardTitle className='text-xl font-semibold text-gray-800 dark:text-white'>
              Customer List
            </CardTitle>
            <CardDescription className='text-gray-500 dark:text-zinc-400'>
              A list of all registered customers in the system.
            </CardDescription>
          </CardHeader>
          <CardContent className='p-0'>
            <div className='relative overflow-x-auto'>
              <Table>
                {' '}
                <TableHeader>
                  <TableRow className='border-gray-200 bg-gray-100 hover:bg-gray-200/60 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/20'>
                    <TableHead className='w-[50px] text-gray-600 dark:text-zinc-300'></TableHead>
                    <TableHead className='text-gray-600 dark:text-zinc-300'>
                      Name
                    </TableHead>
                    <TableHead className='text-gray-600 dark:text-zinc-300'>
                      Email
                    </TableHead>
                    <TableHead className='text-gray-600 dark:text-zinc-300'>
                      Verification
                    </TableHead>
                    <TableHead className='text-gray-600 dark:text-zinc-300'>
                      Risk Level
                    </TableHead>
                    <TableHead className='text-right text-gray-600 dark:text-zinc-300'>
                      Risk Score
                    </TableHead>
                    <TableHead className='text-right text-gray-600 dark:text-zinc-300'>
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className='h-24 text-center text-gray-500 dark:text-zinc-400'
                        >
                          No customers found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map((customer, index) => (
                        <motion.tr
                          key={customer.id}
                          className='border-b border-gray-200 hover:bg-blue-50/70 dark:border-zinc-700 dark:hover:bg-zinc-800/20'
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{
                            backgroundColor: 'rgba(79, 70, 229, 0.05)',
                          }}
                        >
                          <TableCell>
                            <Avatar className='w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 border border-gray-200 dark:from-blue-600/20 dark:to-purple-600/20 dark:border-zinc-700'>
                              <AvatarFallback className='bg-white text-blue-700 dark:bg-zinc-900 dark:text-white'>
                                {customer.fullName
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className='font-medium text-white dark:text-zinc-100'>
                            {customer.fullName}
                          </TableCell>
                          <TableCell className='text-zinc-300 dark:text-zinc-300'>
                            {customer.email}
                          </TableCell>
                          <TableCell>
                            {customer.isVerified ? (
                              <Badge className='bg-gradient-to-r from-green-700/30 to-green-600/30 text-green-400 border border-green-800/50'>
                                Verified
                              </Badge>
                            ) : (
                              <Badge className='bg-gradient-to-r from-yellow-700/30 to-yellow-600/30 text-yellow-400 border border-yellow-800/50'>
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <RiskLevelBadge riskLevel={customer.riskLevel} />
                          </TableCell>
                          <TableCell className='text-right'>
                            <div className='flex items-center justify-end gap-2'>
                              <div className='w-full max-w-[80px]'>
                                <Progress
                                  value={customer.riskScore || 0}
                                  className='h-2 bg-zinc-800 dark:bg-zinc-700'
                                  indicatorClassName={
                                    customer.riskLevel === RiskLevel.High
                                      ? 'bg-gradient-to-r from-red-600 to-red-500'
                                      : customer.riskLevel === RiskLevel.Medium
                                      ? 'bg-gradient-to-r from-yellow-600 to-yellow-500'
                                      : 'bg-gradient-to-r from-green-600 to-green-500'
                                  }
                                />
                              </div>
                              <span className='text-sm font-medium text-zinc-300 dark:text-zinc-300'>
                                {customer.riskScore || 0}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className='text-right'>
                            <div className='flex gap-2 justify-end'>
                              <AssessRiskButton customerId={customer.id} />
                              <Link href={`/customers/${customer.id}`}>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className='py-1 px-3 text-sm bg-zinc-900 border border-zinc-700 rounded-md hover:bg-zinc-800 text-white dark:bg-zinc-800 dark:border-zinc-600 dark:hover:bg-zinc-700'
                                >
                                  Details
                                </motion.button>
                              </Link>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className='flex justify-between border-t border-gray-200 bg-gray-50 py-4 dark:border-zinc-700 dark:bg-zinc-800/50'>
            <p className='text-sm text-gray-500 dark:text-zinc-400'>
              Showing {filteredCustomers.length} of {customers.length} customers
            </p>
            <div className='flex space-x-2'>
              <Button
                variant='outline'
                size='sm'
                className='border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700'
                disabled
              >
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700'
                disabled
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// Helper component for risk level badges
function RiskLevelBadge({ riskLevel }: { riskLevel: RiskLevel }) {
  switch (riskLevel) {
    case RiskLevel.Low:
      return (
        <Badge className='bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200 dark:bg-gradient-to-r dark:from-green-700/30 dark:to-green-600/30 dark:text-green-400 dark:border-green-800/50'>
          <Shield className='w-3 h-3 mr-1' />
          Low
        </Badge>
      );
    case RiskLevel.Medium:
      return (
        <Badge className='bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-gradient-to-r dark:from-yellow-700/30 dark:to-yellow-600/30 dark:text-yellow-400 dark:border-yellow-800/50'>
          <AlertTriangle className='w-3 h-3 mr-1' />
          Medium
        </Badge>
      );
    case RiskLevel.High:
      return (
        <Badge className='bg-gradient-to-r from-red-700/30 to-red-600/30 text-red-400 border border-red-800/50'>
          <AlertTriangle className='w-3 h-3 mr-1' />
          High
        </Badge>
      );
    default:
      return (
        <Badge className='bg-zinc-700/30 text-zinc-400 border border-zinc-800/50'>
          Unknown
        </Badge>
      );
  }
}

// Component for risk assessment button
function AssessRiskButton({ customerId }: { customerId: string }) {
  const assessRiskMutation = useAssessCustomerRisk();

  const handleAssessRisk = async () => {
    try {
      await assessRiskMutation.mutateAsync(customerId);
    } catch (error) {
      console.error('Error assessing risk:', error);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`py-1 px-3 text-sm rounded-md ${
        assessRiskMutation.isPending
          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
      }`}
      onClick={handleAssessRisk}
      disabled={assessRiskMutation.isPending}
    >
      {assessRiskMutation.isPending ? 'Assessing...' : 'Assess Risk'}
    </motion.button>
  );
}
