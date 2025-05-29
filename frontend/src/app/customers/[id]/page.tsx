import { Metadata } from 'next';
import CustomerDetails from './customer-details';

export const metadata: Metadata = {
  title: 'Customer Details - CredInsight',
  description: 'View customer details and risk assessment',
};

export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className='container mx-auto py-8'>
      <CustomerDetails id={id} />
    </div>
  );
}
