import React from 'react';
import NavbarColis from '@/components/colis/NavbarColis';
import ColisHeroSection from '@/components/colis/ColisHeroSection';
import ColisCoverageSection from '@/components/colis/ColisCoverageSection';
import ColisFeaturesSection from '@/components/colis/ColisFeaturesSection';
import ColisGuaranteesSection from '@/components/colis/ColisGuaranteesSection';
import ColisTeamSection from '@/components/colis/ColisTeamSection';
import ColisPricingSection from '@/components/colis/ColisPricingSection';
import ColisTestimonialsSection from '@/components/colis/ColisTestimonialsSection';
import ColisSupportSection from '@/components/colis/ColisSupportSection';
import ColisCTASection from '@/components/colis/ColisCTASection';

const ColisLanding: React.FC = () => {
  return (
    <div className="bg-white">
      <NavbarColis />
      <ColisHeroSection />
      <ColisCoverageSection />
      <ColisFeaturesSection />
      <ColisGuaranteesSection />
      <ColisTeamSection />
      <ColisPricingSection />
      <ColisTestimonialsSection />
      <ColisSupportSection />
      <ColisCTASection />
    </div>
  );
};

export default ColisLanding;