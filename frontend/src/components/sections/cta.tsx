"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations/fade-in"
import { ChevronRightIcon, EnvelopeClosedIcon, ChatBubbleIcon } from "@radix-ui/react-icons"

export function CTASection() {
    return (
        <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full opacity-10"
                >
                    <div className="w-96 h-96 bg-white rounded-full blur-3xl" />
                </motion.div>
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full opacity-10"
                >
                    <div className="w-96 h-96 bg-white rounded-full blur-3xl" />
                </motion.div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <FadeIn delay={0.2}>
                    <div className="text-center text-white">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                            Ready to Transform Your
                            <br />
                            <span className="text-yellow-300">KYC Process?</span>
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                            Join leading financial institutions who trust CredInsight to protect
                            against fraud while ensuring seamless customer onboarding.
                        </p>
                    </div>
                </FadeIn>

                <FadeIn delay={0.4}>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Button
                                size="lg"
                                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                            >
                                <motion.span
                                    className="flex items-center gap-2"
                                >
                                    Start Free Trial
                                    <ChevronRightIcon className="w-5 h-5" />
                                </motion.span>
                            </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
                            >
                                <motion.span
                                    className="flex items-center gap-2"
                                >
                                    <ChatBubbleIcon className="w-5 h-5" />
                                    Schedule Demo
                                </motion.span>
                            </Button>
                        </motion.div>
                    </div>
                </FadeIn>

                <FadeIn delay={0.6}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center text-white">
                        <motion.div
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                        >
                            <div className="text-3xl font-bold mb-2">99.7%</div>
                            <div className="text-blue-100">Accuracy Rate</div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                        >
                            <div className="text-3xl font-bold mb-2">&lt;30s</div>
                            <div className="text-blue-100">Verification Time</div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                        >
                            <div className="text-3xl font-bold mb-2">500+</div>
                            <div className="text-blue-100">Institutions Trust Us</div>
                        </motion.div>
                    </div>
                </FadeIn>

                <FadeIn delay={0.8}>
                    <div className="mt-16 text-center">
                        <p className="text-blue-100 mb-4">Questions? We&apos;re here to help.</p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-2 text-white hover:text-yellow-300 transition-colors cursor-pointer"
                        >
                            <EnvelopeClosedIcon className="w-5 h-5" />
                            <span className="font-semibold">contact@credinsight.ai</span>
                        </motion.div>
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}
