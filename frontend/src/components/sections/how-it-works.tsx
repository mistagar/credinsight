"use client"

import { motion } from "framer-motion"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer, staggerItem } from "@/components/animations/stagger-container"
import { ArrowRightIcon, PersonIcon, MagnifyingGlassIcon, CheckCircledIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons"

export function HowItWorksSection() {
    const steps = [
        {
            number: "01",
            title: "Data Collection",
            description: "Customer submits identity documents and personal information during onboarding",
            icon: PersonIcon,
            color: "from-blue-500 to-cyan-500"
        },
        {
            number: "02",
            title: "AI Analysis",
            description: "Our ML algorithms analyze documents, biometrics, and behavioral patterns in real-time",
            icon: MagnifyingGlassIcon,
            color: "from-purple-500 to-pink-500"
        },
        {
            number: "03",
            title: "Risk Assessment",
            description: "System cross-references data with historical patterns and external databases",
            icon: ExclamationTriangleIcon,
            color: "from-orange-500 to-red-500"
        },
        {
            number: "04",
            title: "Instant Decision",
            description: "Automated approval or flagging with detailed risk scoring and compliance reporting",
            icon: CheckCircledIcon,
            color: "from-green-500 to-emerald-500"
        }
    ]

    return (
        <section id="how-it-works" className="py-24 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn delay={0.2}>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                            How{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                It Works
                            </span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Our streamlined process ensures accurate identity verification
                            while maintaining speed and user experience.
                        </p>
                    </div>
                </FadeIn>

                <div className="max-w-6xl mx-auto">
                    <StaggerContainer className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => {
                            const IconComponent = step.icon
                            const isLast = index === steps.length - 1

                            return (
                                <div key={index} className="relative">
                                    <motion.div
                                        variants={staggerItem}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        className="relative z-10"
                                    >
                                        {/* Step Card */}
                                        <div className="text-center p-6 rounded-xl bg-card border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300">
                                            {/* Step Number */}
                                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${step.color} mb-4 text-white font-bold text-lg`}>
                                                {step.number}
                                            </div>

                                            {/* Icon */}
                                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${step.color} mb-4`}>
                                                <IconComponent className="w-6 h-6 text-white" />
                                            </div>

                                            {/* Content */}
                                            <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* Connecting Arrow */}
                                    {!isLast && (
                                        <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-0">
                                            <motion.div
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                className="text-muted-foreground"
                                            >
                                                <ArrowRightIcon className="w-8 h-8" />
                                            </motion.div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </StaggerContainer>

                    {/* Process Flow Visualization */}
                    <FadeIn delay={0.8}>
                        <div className="mt-16 p-8 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-border/50">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold mb-4">Process Timeline</h3>
                                <p className="text-muted-foreground">Complete verification in under 30 seconds</p>
                            </div>

                            <div className="flex items-center justify-between max-w-4xl mx-auto">
                                <div className="text-center">
                                    <div className="w-4 h-4 bg-blue-500 rounded-full mb-2 mx-auto" />
                                    <p className="text-sm font-medium">Start</p>
                                    <p className="text-xs text-muted-foreground">0s</p>
                                </div>

                                <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 mx-4" />

                                <div className="text-center">
                                    <div className="w-4 h-4 bg-purple-500 rounded-full mb-2 mx-auto" />
                                    <p className="text-sm font-medium">Analysis</p>
                                    <p className="text-xs text-muted-foreground">5s</p>
                                </div>

                                <div className="flex-1 h-0.5 bg-gradient-to-r from-purple-500 to-green-500 mx-4" />

                                <div className="text-center">
                                    <div className="w-4 h-4 bg-orange-500 rounded-full mb-2 mx-auto" />
                                    <p className="text-sm font-medium">Verification</p>
                                    <p className="text-xs text-muted-foreground">15s</p>
                                </div>

                                <div className="flex-1 h-0.5 bg-gradient-to-r from-orange-500 to-green-500 mx-4" />

                                <div className="text-center">
                                    <div className="w-4 h-4 bg-green-500 rounded-full mb-2 mx-auto" />
                                    <p className="text-sm font-medium">Decision</p>
                                    <p className="text-xs text-muted-foreground">30s</p>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    )
}
