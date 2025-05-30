"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAddCustomer } from "@/lib/api/customer-hooks";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AddCustomerForm({ onSuccess }: { onSuccess?: () => void }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        street: "",
        city: "",
        region: "",
        postalCode: "",
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
            // Create full address string
            const address = [
                formData.street,
                formData.city,
                formData.region,
                formData.postalCode
            ].filter(Boolean).join(", ");

            // Add the customer first
            const customer = await addCustomerMutation.mutateAsync({
                ...formData,
                address,
                riskLevel: 0, // Will be updated after KYC analysis
                riskScore: 0,
                transactions: [],
                loginActivities: [],
            });

            if (onSuccess) {
                onSuccess();
            }

            // Navigate to KYC analysis page with customer information
            const params = new URLSearchParams({
                customerId: customer.id,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phoneNumber,
                street: formData.street,
                city: formData.city,
                region: formData.region,
                postalCode: formData.postalCode,
            });

            router.push(`/customers/kyc-analysis?${params.toString()}`);
        } catch (error) {
            setFormError(`Error adding customer: ${(error as Error).message}`);
        }
    }; return (
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Add New Customer
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                    Fill out the form below to add a new customer to the system.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
                {formError && (
                    <div className="text-sm text-red-600 p-3 bg-red-50 rounded-lg border border-red-200 flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        {formError}
                    </div>
                )}

                {/* Personal Information Section */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <h4 className="font-semibold text-gray-800">Personal Information</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                                className="h-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                required
                                className="h-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="+1234567890"
                                className="h-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="nationalIdNumber" className="text-sm font-medium text-gray-700">
                                National ID Number
                            </label>
                            <Input
                                id="nationalIdNumber"
                                name="nationalIdNumber"
                                value={formData.nationalIdNumber}
                                onChange={handleChange}
                                placeholder="ID12345678"
                                className="h-10"
                            />
                        </div>
                    </div>
                </div>

                {/* Address Section */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <h4 className="font-semibold text-gray-800">Address Information</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 space-y-2">
                            <label htmlFor="street" className="text-sm font-medium text-gray-700">
                                Street Address
                            </label>
                            <Input
                                id="street"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                placeholder="123 Main St"
                                className="h-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="city" className="text-sm font-medium text-gray-700">
                                City
                            </label>
                            <Input
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                                className="h-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="region" className="text-sm font-medium text-gray-700">
                                Region/State
                            </label>
                            <Input
                                id="region"
                                name="region"
                                value={formData.region}
                                onChange={handleChange}
                                placeholder="Region"
                                className="h-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                                Postal Code
                            </label>
                            <Input
                                id="postalCode"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                placeholder="12345"
                                className="h-10"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="documentType" className="text-sm font-medium text-gray-700">
                                Document Type
                            </label>
                            <Input
                                id="documentType"
                                name="documentType"
                                value={formData.documentType}
                                onChange={handleChange}
                                placeholder="Passport"
                                className="h-10"
                            />
                        </div>
                    </div>
                </div>

                {/* Verification Section */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <h4 className="font-semibold text-gray-800">Verification Status</h4>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <input
                            id="isVerified"
                            name="isVerified"
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            checked={formData.isVerified}
                            onChange={handleChange}
                        />
                        <label htmlFor="isVerified" className="text-sm font-medium text-gray-700">
                            Mark as Verified Customer
                        </label>
                        {formData.isVerified && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                                Verified
                            </Badge>
                        )}
                    </div>
                </div>
            </form>            <DialogFooter className="pt-6 border-t border-gray-200">
                <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={addCustomerMutation.isPending}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    {addCustomerMutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Adding Customer & Starting KYC Analysis...
                        </>
                    ) : (
                        <>
                            <span className="mr-2">🚀</span>
                            Add Customer & Start KYC Analysis
                        </>
                    )}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
