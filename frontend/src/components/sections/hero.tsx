"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations/fade-in"
import { ChevronRightIcon, CheckIcon, LightningBoltIcon, EyeOpenIcon } from "@radix-ui/react-icons"
import Link from "next/link"

export function HeroSection() {
    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
            {/* Background Animation */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full opacity-10"
                >
                    <div className="w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl" />
                </motion.div>
                <motion.div
                    animate={{
                        scale: [1.1, 1, 1.1],
                        rotate: [0, -5, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full opacity-10"
                >
                    <div className="w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl" />
                </motion.div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <FadeIn delay={0.2}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 mb-8"
                        >
                            <CheckIcon className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">AI-Powered KYC Assistant</span>
                            <motion.div
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <ChevronRightIcon className="w-4 h-4" />
                            </motion.div>
                        </motion.div>
                    </FadeIn>

                    <FadeIn delay={0.4}>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                                CredInsight
                            </span>
                            <br />
                            <span className="text-foreground">
                                Your AI-Powered
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                KYC Assistant
                            </span>
                        </h1>
                    </FadeIn>

                    <FadeIn delay={0.6}>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                            Real-time identity verification and fraud detection using advanced machine learning
                            algorithms to protect financial institutions from identity theft and suspicious activities.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.8}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg"
                            >
                                <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center gap-2"
                                >
                                    Get Started Free
                                    <ChevronRightIcon className="w-5 h-5" />
                                </motion.span>
                            </Button>
                            {/* <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                                <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center gap-2"
                                >
                                    <EyeOpenIcon className="w-5 h-5" />
                                    Watch Demo
                                </motion.span>
                            </Button> */}
                            <Link href='/customers'>
                                <Button size='lg'>Go to Customer Dashboard</Button>
                            </Link>
                        </div>
                    </FadeIn>

                    <FadeIn delay={1.0}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                            <motion.div
                                whileHover={{ scale: 1.05, y: -5 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm"
                            >
                                <LightningBoltIcon className="w-8 h-8 text-blue-600 mb-3" />
                                <h3 className="font-semibold mb-2">Real-Time Analysis</h3>
                                <p className="text-sm text-muted-foreground text-center">
                                    Instant identity verification and risk assessment
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05, y: -5 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm"
                            >
                                <CheckIcon className="w-8 h-8 text-purple-600 mb-3" />
                                <h3 className="font-semibold mb-2">Fraud Detection</h3>
                                <p className="text-sm text-muted-foreground text-center">
                                    Advanced ML algorithms to detect suspicious patterns
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05, y: -5 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm"
                            >
                                <EyeOpenIcon className="w-8 h-8 text-pink-600 mb-3" />
                                <h3 className="font-semibold mb-2">Compliance Ready</h3>
                                <p className="text-sm text-muted-foreground text-center">
                                    Meet regulatory requirements automatically
                                </p>
                            </motion.div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    )
}
