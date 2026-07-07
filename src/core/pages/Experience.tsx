import { ExperienceHero } from "@/core/components/experience/ExperienceHero";
import { CharacterAudioIntro } from "@/core/components/experience/CharacterAudioIntro";
import { CharacterPreviewCarousel } from "@/core/components/experience/CharacterPreviewCarousel";
import { JourneyTransformation } from "@/core/components/experience/JourneyTransformation";
import { ExperienceCTA } from "@/core/components/experience/ExperienceCTA";

const Experience = () => {
  return (
    <>
      {/* Hero Section */}
      <ExperienceHero />

      {/* Character Audio Introduction */}
      <CharacterAudioIntro />

      {/* Interactive Preview Carousel */}
      <CharacterPreviewCarousel />

      {/* Journey Transformation Section */}
      <JourneyTransformation />

      {/* Call-to-Action Section */}
      <ExperienceCTA />
    </>
  );
};

export default Experience;
