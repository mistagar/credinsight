"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAddCustomer } from "@/lib/api/customer-hooks";

export function AddCustomerForm({ onSuccess }: { onSuccess?: () => void }) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        address: "",
        nationalIdNumber: "",
        documentType: "Passport",
        isVerified: false,
    });

    const [formError, setFormError] = useState<string | null>(null);

    const addCustomerMutation = useAddCustomer();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        // Basic validation
        if (!formData.fullName || !formData.email) {
            setFormError("Name and email are required fields");
            return;
        }

        try {
            await addCustomerMutation.mutateAsync({
                ...formData,
                riskLevel: 0, // Default to Low
                riskScore: 0,
                transactions: [],
                loginActivities: [],
            });

            // Reset form and close dialog
            setFormData({
                fullName: "",
                email: "",
                phoneNumber: "",
                address: "",
                nationalIdNumber: "",
                documentType: "Passport",
                isVerified: false,
            });

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            setFormError(`Error adding customer: ${(error as Error).message}`);
        }
    };

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                    Fill out the form below to add a new customer to the system.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="grid w-full items-center gap-2">
                    <label htmlFor="fullName">Full Name *</label>
                    <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                    />
                </div>
                <div className="grid w-full items-center gap-2">
                    <label htmlFor="email">Email *</label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                    />
                </div>
                <div className="grid w-full items-center gap-2">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="1234567890"
                    />
                </div>
                <div className="grid w-full items-center gap-2">
                    <label htmlFor="address">Address</label>
                    <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Main St"
                    />
                </div>
                <div className="grid w-full items-center gap-2">
                    <label htmlFor="nationalIdNumber">National ID Number</label>
                    <Input
                        id="nationalIdNumber"
                        name="nationalIdNumber"
                        value={formData.nationalIdNumber}
                        onChange={handleChange}
                        placeholder="ID12345678"
                    />
                </div>
                <div className="grid w-full items-center gap-2">
                    <label htmlFor="documentType">Document Type</label>
                    <Input
                        id="documentType"
                        name="documentType"
                        value={formData.documentType}
                        onChange={handleChange}
                        placeholder="Passport"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Input
                        id="isVerified"
                        name="isVerified"
                        type="checkbox"
                        className="w-4 h-4"
                        checked={formData.isVerified}
                        onChange={handleChange}
                    />
                    <label htmlFor="isVerified">Verified Customer</label>
                </div>

                {formError && (
                    <div className="text-sm text-red-600 p-2 bg-red-50 rounded border border-red-200">
                        {formError}
                    </div>
                )}
            </form>
            <DialogFooter>
                <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={addCustomerMutation.isPending}
                >
                    {addCustomerMutation.isPending ? "Adding..." : "Add Customer"}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
