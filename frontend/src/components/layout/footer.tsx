"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { FadeIn } from "@/components/animations/fade-in"
import { TwitterLogoIcon, LinkedInLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons"

export function Footer() {
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        product: [
            { name: "Features", href: "#features" },
            { name: "How It Works", href: "#how-it-works" },
            { name: "Pricing", href: "#pricing" },
            { name: "API Documentation", href: "/docs" }
        ],
        company: [
            { name: "About Us", href: "/about" },
            { name: "Careers", href: "/careers" },
            { name: "Blog", href: "/blog" },
            { name: "Contact", href: "/contact" }
        ],
        legal: [
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Compliance", href: "/compliance" },
            { name: "Security", href: "/security" }
        ]
    }

    const socialLinks = [
        { name: "Twitter", icon: TwitterLogoIcon, href: "https://twitter.com/credinsight" },
        { name: "LinkedIn", icon: LinkedInLogoIcon, href: "https://linkedin.com/company/credinsight" },
        { name: "GitHub", icon: GitHubLogoIcon, href: "https://github.com/credinsight" }
    ]

    return (
        <footer className="bg-muted/30 border-t border-border/40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Brand Section */}
                    <FadeIn delay={0.1} className="lg:col-span-2">
                        <div className="space-y-4">
                            <Link href="/" className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">CI</span>
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    CredInsight
                                </span>
                            </Link>
                            <p className="text-muted-foreground max-w-md">
                                AI-powered KYC assistant helping financial institutions detect fraud
                                and verify identities in real-time with unmatched accuracy.
                            </p>
                            <div className="flex space-x-4">
                                {socialLinks.map((social) => {
                                    const IconComponent = social.icon
                                    return (
                                        <motion.a
                                            key={social.name}
                                            href={social.href}
                                            whileHover={{ scale: 1.1, y: -2 }}
                                            className="w-10 h-10 rounded-full bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-all duration-200"
                                        >
                                            <IconComponent className="w-5 h-5" />
                                        </motion.a>
                                    )
                                })}
                            </div>
                        </div>
                    </FadeIn>

                    {/* Product Links */}
                    <FadeIn delay={0.2}>
                        <div>
                            <h3 className="font-semibold mb-4">Product</h3>
                            <ul className="space-y-3">
                                {footerLinks.product.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </FadeIn>

                    {/* Company Links */}
                    <FadeIn delay={0.3}>
                        <div>
                            <h3 className="font-semibold mb-4">Company</h3>
                            <ul className="space-y-3">
                                {footerLinks.company.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </FadeIn>

                    {/* Legal Links */}
                    <FadeIn delay={0.4}>
                        <div>
                            <h3 className="font-semibold mb-4">Legal</h3>
                            <ul className="space-y-3">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </FadeIn>
                </div>

                {/* Bottom Section */}
                <FadeIn delay={0.5}>
                    <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center">
                        <p className="text-muted-foreground text-sm">
                            © {currentYear} CredInsight. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-6 mt-4 sm:mt-0">
                            <span className="text-sm text-muted-foreground">
                                Built with security and compliance in mind
                            </span>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-sm text-muted-foreground">System Status: Operational</span>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </footer>
    )
}
