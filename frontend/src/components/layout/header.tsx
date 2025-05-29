"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function Header() {
    return (
        <motion.header
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed top-0 w-full z-50 backdrop-blur-md bg-background/80 border-b border-border/40"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex-shrink-0"
                    >
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">CI</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                CredInsight
                            </span>
                        </Link>
                    </motion.div>

                    <motion.nav
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="hidden md:block"
                    >
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link
                                href="/customers"
                                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                            >
                                Customers
                            </Link>
                            <Link
                                href="#features"
                                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                            >
                                Features
                            </Link>
                            <Link
                                href="#solution"
                                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                            >
                                Solution
                            </Link>
                            <Link
                                href="#how-it-works"
                                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                            >
                                How It Works
                            </Link>
                            <Link
                                href="#contact"
                                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                            >
                                Contact
                            </Link>
                        </div>
                    </motion.nav>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex items-center space-x-4"
                    >
                        <ThemeToggle />
                        <Button variant="outline" size="sm">
                            Sign In
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            Get Started
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.header>
    )
}
