'use client';

import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { Page } from '@/app/lib/types';
import { Footer } from '@/app/components/layout/Footer';
import { HeroSection } from '@/app/components/sections/HeroSection';
import { AboutSection } from '@/app/components/sections/AboutSection';
import { ServicesSection } from '@/app/components/sections/ServicesSection';
import { TestimonialsSection } from '@/app/components/sections/TestimonialsSection';
import { FAQSection } from '@/app/components/sections/FAQSection';
import { WhyChooseUsSection } from '@/app/components/sections/WhyChooseUsSection';
import { CompanyDetailSection } from '@/app/components/sections/CompanyDetailSection';
import { ProjectsSection } from '@/app/components/sections/ProjectsSection';
import { BlogSection } from '@/app/components/sections/BlogSection';
import { ContactSection } from './components/sections/ContactSection';
import { CTASection } from '@/app/components/sections/CTASection';
import { GallerySection } from '@/app/components/sections/GallerySection';
import { ServingAreasSection } from '@/app/components/sections/ServingAreasSection';
import { getThemeColors } from '@/app/lib/themeBuilder';

export default function HomeClient() {
  const { site, pages, loading } = useWebBuilder();

  const themeColors = getThemeColors(site);
  const themeFonts = {
    heading: site?.theme?.headingFont,
    body: site?.theme?.bodyFont,
  };

  const displayPage = pages.find((p: Page) => p.pageType === 'home');

  // No spinner / empty-state screens — wait silently until home content is ready.
  if (loading || !displayPage) return null;

  return (
    <div
      className="min-h-screen selection:bg-black/10 selection:text-inherit"
      style={{
        backgroundColor: themeColors.pageBackground,
        color: themeColors.mainText,
        fontFamily: themeFonts.body,
      }}
    >

      <div>
        <HeroSection hero={displayPage.hero} page={displayPage} />
        <AboutSection aboutSection={displayPage.aboutSection} page={displayPage} />
        <ServicesSection
          servicesSection={displayPage.servicesSection}
          companyDetailSection={displayPage.companyDetailSection}
          ctaSection={displayPage.ctaSection}
          page={displayPage}
        />
        <CompanyDetailSection companyDetailSection={displayPage.companyDetailSection} />
        <CTASection ctaSection={displayPage.ctaSection} />
        <BlogSection blogSection={displayPage.blogSection} />
        <ProjectsSection
          projectSection={displayPage.projectSection}
          projectsSection={displayPage.projectsSection}
          projectsLimit={3}
        />
        <GallerySection gallerySection={displayPage.gallerySection} />
        <WhyChooseUsSection whyChooseUsSection={displayPage.whyChooseUsSection} />
        <FAQSection faqSection={displayPage.faqSection} />
        <TestimonialsSection testimonialsSection={displayPage.testimonialsSection} />
        <ServingAreasSection
          servingAreasSection={displayPage.servingAreasSection ?? { enabled: true }}
        />
        <ContactSection contactSection={displayPage.contactSection} />
      </div>
      <Footer />
    </div>
  );
}
