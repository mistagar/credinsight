import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Customer Management - CredInsight",
    description: "Manage and monitor customer profiles and risk assessments",
};

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function CustomersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white text-zinc-800 dark:bg-zinc-950 dark:text-white">
            <div className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-zinc-900/80">
                <div className="container px-4 mx-auto flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center mr-4">
                            <ArrowLeft className="w-4 h-4 mr-2 text-zinc-700 dark:text-zinc-300" />                            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xs">CI</span>
                            </div>
                            <span className="ml-2 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CredInsight</span>
                        </Link>
                        <span className="mx-2 text-zinc-500 dark:text-zinc-500">/</span>
                        <span className="text-zinc-600 dark:text-zinc-500">Customer Portal</span>
                    </div>
                    <div>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
            <div className="container px-4 mx-auto py-8">
                {children}
            </div>
        </div>
    );
}
