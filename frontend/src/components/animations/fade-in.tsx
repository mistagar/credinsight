"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface FadeInProps {
    children: ReactNode
    delay?: number
    direction?: "up" | "down" | "left" | "right"
    className?: string
}

export function FadeIn({
    children,
    delay = 0,
    direction = "up",
    className = ""
}: FadeInProps) {
    const directions = {
        up: { y: 60, x: 0 },
        down: { y: -60, x: 0 },
        left: { y: 0, x: 60 },
        right: { y: 0, x: -60 }
    }

    return (
        <motion.div
            initial={{
                opacity: 0,
                ...directions[direction]
            }}
            whileInView={{
                opacity: 1,
                y: 0,
                x: 0
            }}
            viewport={{ once: true }}
            transition={{
                duration: 0.7,
                delay,
                ease: [0.25, 0.25, 0.25, 0.75]
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
