import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        {/* <ProblemSolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection /> */}
      </main>
      <Footer />
    </div>
  );
}
