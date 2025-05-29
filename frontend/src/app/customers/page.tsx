import { Metadata } from "next";
import CustomerDashboard from "./customer-dashboard";

export const metadata: Metadata = {
    title: "Customer Dashboard - CredInsight",
    description: "View and manage customers and their risk assessments",
};

export default function CustomersPage() {
    return (
        <div className="container mx-auto py-8">
            <CustomerDashboard />
        </div>
    );
}
