"use client"

import { motion } from "framer-motion"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer, staggerItem } from "@/components/animations/stagger-container"
import { ExclamationTriangleIcon, CheckCircledIcon, ArrowRightIcon } from "@radix-ui/react-icons"

export function ProblemSolutionSection() {
    const problems = [
        "Manual KYC checks are slow and inefficient",
        "Difficulty detecting sophisticated identity theft",
        "High false positive rates in fraud detection",
        "Lack of real-time monitoring capabilities",
        "Compliance challenges with evolving regulations"
    ]

    const solutions = [
        "Automated real-time identity verification",
        "Advanced ML algorithms for pattern recognition",
        "Behavioral analysis for accurate risk assessment",
        "Continuous monitoring of customer activities",
        "Automated compliance reporting and alerts"
    ]

    return (
        <section id="solution" className="py-24 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn delay={0.2}>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                            From <span className="text-red-500">Problem</span> to{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Solution
                            </span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Financial institutions face critical challenges in identity verification.
                            CredInsight transforms these pain points into competitive advantages.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Problem Side */}
                    <FadeIn delay={0.4} direction="left">
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
                                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-red-600">Current Challenges</h3>
                            </div>

                            <StaggerContainer staggerDelay={0.1}>
                                {problems.map((problem, index) => (
                                    <motion.div
                                        key={index}
                                        variants={staggerItem}
                                        className="flex items-start gap-4 p-4 rounded-lg border border-red-200 dark:border-red-800/30 bg-red-50/50 dark:bg-red-900/10"
                                    >
                                        <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-muted-foreground">{problem}</p>
                                    </motion.div>
                                ))}
                            </StaggerContainer>
                        </div>
                    </FadeIn>

                    {/* Solution Side */}
                    <FadeIn delay={0.6} direction="right">
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                                    <CheckCircledIcon className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-green-600">Our Solutions</h3>
                            </div>

                            <StaggerContainer staggerDelay={0.1}>
                                {solutions.map((solution, index) => (
                                    <motion.div
                                        key={index}
                                        variants={staggerItem}
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        className="flex items-start gap-4 p-4 rounded-lg border border-green-200 dark:border-green-800/30 bg-green-50/50 dark:bg-green-900/10"
                                    >
                                        <CheckCircledIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-muted-foreground">{solution}</p>
                                    </motion.div>
                                ))}
                            </StaggerContainer>
                        </div>
                    </FadeIn>
                </div>

                {/* Arrow Animation */}
                <FadeIn delay={0.8}>
                    <div className="flex justify-center mt-16">
                        <motion.div
                            animate={{ x: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        >
                            <span className="font-semibold">Transform Your KYC Process</span>
                            <ArrowRightIcon className="w-5 h-5" />
                        </motion.div>
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}
