import { useMutation } from '@tanstack/react-query';

interface KYCAnalysisResult {
    healthStatus: 'mild' | 'moderate' | 'severe' | 'critical';
    suspicionLevel: 'mild' | 'moderate' | 'severe' | 'critical';
    emailAuthenticity: 'mild' | 'moderate' | 'severe' | 'critical';
    nameAuthenticity: 'mild' | 'moderate' | 'severe' | 'critical';
    phoneNumberAuthenticity: 'mild' | 'moderate' | 'severe' | 'critical';
    explanation: string;
}

interface CustomerKYCData {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    region: string;
    postalCode: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7020/api';

export function useKYCAnalysis() {
    return useMutation({
        mutationFn: async (data: CustomerKYCData): Promise<KYCAnalysisResult> => {
            const formattedData = `FullName: ${data.fullName}, Email: ${data.email}, Phone: ${data.phone}, Street: ${data.street}, City: ${data.city}, Region: ${data.region}, PostalCode: ${data.postalCode}`;

            const response = await fetch(`${API_BASE_URL}/AI/send-message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                throw new Error('Failed to perform KYC analysis');
            }

            return response.json();
        },
    });
}
