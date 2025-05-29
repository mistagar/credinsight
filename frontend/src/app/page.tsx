import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <main className='flex flex-col items-center justify-center px-4 pt-32 sm:py-0'>
        <HeroSection />
        {/* <ProblemSolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection /> */}

        <div className='container mx-auto py-12 text-center'>
          <h2 className='text-3xl font-bold tracking-tight mb-4'>
            Manage Your Customers
          </h2>
          <p className='text-xl text-muted-foreground mb-8'>
            Access the customer dashboard to view and manage all customers
          </p>
          <Link href='/customers'>
            <Button size='lg'>Go to Customer Dashboard</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
