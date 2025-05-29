"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <Button variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="w-9 h-9 rounded-full border-gray-300 bg-white/90 hover:bg-gray-100 hover:border-gray-400 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:bg-zinc-700 dark:hover:border-zinc-500"
            >
                <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400 dark:text-yellow-300 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] text-blue-400 dark:text-blue-300 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        </motion.div>
    )
}
