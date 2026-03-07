import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedPosts } from "@/components/sections/FeaturedPosts";
import { AboutBrief } from "@/components/sections/AboutBrief";
import { ConnectSection } from "@/components/sections/ConnectSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedPosts />
      <AboutBrief />
      <ConnectSection />
    </>
  );
}
