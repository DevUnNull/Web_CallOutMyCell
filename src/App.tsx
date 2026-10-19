import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import LifestyleSection from "./components/LifestyleSection";
import GameplaySection from "./components/GameplaySection";
import WorldSection from "./components/WorldSection";
import FeaturesSection from "./components/FeaturesSection";
import GallerySection from "./components/GallerySection";
import DownloadSection from "./components/DownloadSection";
import BuySection from "./components/BuySection";
import Footer from "./components/Footer";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function App() {
  const root = useRef<HTMLDivElement>(null);

  // Page-wide effects. Everything is skipped for prefers-reduced-motion, so content is visible by default.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-reveal]", { autoAlpha: 0, y: 40 });
        ScrollTrigger.batch("[data-reveal]", {
          start: "top 88%",
          once: true,
          onEnter: (els) =>
            gsap.to(els, { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.7, ease: "power3.out", overwrite: true }),
        });

        // Gentle bobbing for small SVG stickers only (never the screenshots).
        gsap.utils.toArray<SVGElement>(".js-float").forEach((el, i) => {
          gsap.to(el, {
            y: gsap.utils.random(-10, -4),
            rotate: gsap.utils.random(-8, 8),
            duration: gsap.utils.random(2.2, 3.4),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: i * 0.15,
          });
        });
      });

      // The browser tried to jump to #section before React rendered it; do it now.
      if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "instant" });

      // Screenshots load lazily and change layout height, so recalc trigger positions once they arrive.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh);
      return () => window.removeEventListener("load", refresh);
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <a className="skip-link" href="#noi-dung">
        Bỏ qua tới nội dung
      </a>
      <Navbar />
      <main id="noi-dung">
        <HeroSection />
        <AboutSection />
        <LifestyleSection />
        <GameplaySection />
        <WorldSection />
        <FeaturesSection />
        <GallerySection />
        <DownloadSection />
        <BuySection />
      </main>
      <Footer />
    </div>
  );
}
