"use client"

import { motion } from "framer-motion"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer, staggerItem } from "@/components/animations/stagger-container"
import {
    LightningBoltIcon,
    CheckIcon,
    EyeOpenIcon,
    PersonIcon,
    BarChartIcon,
    LockClosedIcon,
    ClockIcon,
    GlobeIcon
} from "@radix-ui/react-icons"

export function FeaturesSection() {
    const features = [
        {
            icon: LightningBoltIcon,
            title: "Real-Time Processing",
            description: "Instant identity verification and risk assessment within milliseconds",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: CheckIcon,
            title: "Identity Verification",
            description: "Confirm if the person submitting details is truly the owner of that identity",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: BarChartIcon,
            title: "Behavioral Analysis",
            description: "Analyze customer behavior and compare with historical patterns",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: EyeOpenIcon,
            title: "Fraud Detection",
            description: "Flag mismatches or signs of identity theft instantly using ML algorithms",
            color: "from-red-500 to-orange-500"
        },
        {
            icon: LockClosedIcon,
            title: "Compliance Ready",
            description: "Help institutions stay compliant with KYC regulations automatically",
            color: "from-indigo-500 to-purple-500"
        },
        {
            icon: ClockIcon,
            title: "24/7 Monitoring",
            description: "Continuous monitoring of customer activities and risk factors",
            color: "from-teal-500 to-green-500"
        },
        {
            icon: PersonIcon,
            title: "Customer Onboarding",
            description: "Streamlined onboarding process with enhanced security measures",
            color: "from-yellow-500 to-orange-500"
        },
        {
            icon: GlobeIcon,
            title: "Global Coverage",
            description: "Support for international identity verification and compliance standards",
            color: "from-cyan-500 to-blue-500"
        }
    ]

    return (
        <section id="features" className="py-24 bg-gradient-to-b from-muted/20 to-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn delay={0.2}>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                            Powerful{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Features
                            </span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Advanced AI capabilities designed to revolutionize your KYC process
                            with unmatched accuracy and speed.
                        </p>
                    </div>
                </FadeIn>

                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon
                        return (
                            <motion.div
                                key={index}
                                variants={staggerItem}
                                whileHover={{
                                    scale: 1.05,
                                    y: -10,
                                    transition: { duration: 0.3 }
                                }}
                                className="group relative p-6 rounded-xl bg-card border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300"
                            >
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                                    style={{
                                        backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                                    }}
                                />

                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} mb-4`}>
                                    <IconComponent className="w-6 h-6 text-white" />
                                </div>

                                <h3 className="text-lg font-semibold mb-2 group-hover:text-foreground transition-colors">
                                    {feature.title}
                                </h3>

                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {feature.description}
                                </p>

                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "100%" }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    className={`h-0.5 bg-gradient-to-r ${feature.color} mt-4 rounded-full`}
                                />
                            </motion.div>
                        )
                    })}
                </StaggerContainer>

                <FadeIn delay={0.8}>
                    <div className="mt-16 text-center">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold"
                        >
                            <span>Experience All Features</span>
                            <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                →
                            </motion.div>
                        </motion.div>
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}
