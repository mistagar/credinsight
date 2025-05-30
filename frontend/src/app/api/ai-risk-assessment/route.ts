import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7282/api';

export async function POST(req: NextRequest) {
    try {
        const { customerId } = await req.json();

        if (!customerId) {
            return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
        }

        // Fetch the AI risk assessment from the backend
        const response = await fetch(`${API_BASE_URL}/AI/assess-risk/${customerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Backend request failed: ${response.statusText}`);
        }

        const data = await response.json();

        // Return the AI analysis as a streaming response
        return new Response(data.aiAnalysis, {
            headers: {
                'Content-Type': 'text/plain',
                'X-Risk-Score': data.assessment.score.toString(),
                'X-Risk-Level': data.assessment.level.toString(),
                'X-Assessment-Id': data.assessment.id,
            },
        });

    } catch (error) {
        console.error('Error in AI risk assessment:', error);
        return NextResponse.json(
            { error: 'Failed to perform AI risk assessment' },
            { status: 500 }
        );
    }
}
