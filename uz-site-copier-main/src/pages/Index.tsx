import NeonNavbar from "@/components/NeonNavbar";
import NeonHero from "@/components/NeonHero";
import NeonFeatures from "@/components/NeonFeatures";
import NeonGames from "@/components/NeonGames";
import NeonHowItWorks from "@/components/NeonHowItWorks";
import NeonFAQ from "@/components/NeonFAQ";
import { NeonCTA, NeonFooter } from "@/components/NeonFooterCTA";

const Index = () => (
  <div className="min-h-screen">
    <NeonNavbar />
    <NeonHero />
    <NeonFeatures />
    <NeonGames />
    <NeonHowItWorks />
    <NeonFAQ />
    <NeonCTA />
    <NeonFooter />
  </div>
);

export default Index;
