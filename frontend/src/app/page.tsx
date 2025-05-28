import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero"
import { ProblemSolutionSection } from "@/components/sections/problem-solution"
import { FeaturesSection } from "@/components/sections/features"
import { HowItWorksSection } from "@/components/sections/how-it-works"
import { CTASection } from "@/components/sections/cta"

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
