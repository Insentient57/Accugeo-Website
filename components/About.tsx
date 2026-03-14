"use client";

import { useEffect, useRef, useState } from "react";
import Squares from "./Squares";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-black min-h-screen py-20 relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <Squares
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="#271E37"
          hoverFillColor="#222"
        />
      </div>
      <style>{`#about canvas { z-index: 0 !important; pointer-events: none !important; }`}</style>
      <div className="container mx-auto px-6 w-full relative z-10">
        <h2
          className={`text-5xl md:text-6xl font-bold text-left mb-12 text-white ${isVisible ? "fade-up" : "opacity-0"}`}
          style={{ animationDelay: isVisible ? "0.05s" : undefined }}
        >
          About
        </h2>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <img
              src="/about-image.png"
              alt="About Accugeo"
              width={420}
              height={280}
              loading={isVisible ? "eager" : "lazy"}
              className={`w-full max-w-xs mx-auto md:mx-0 rounded-lg shadow-lg ${isVisible ? "fade-up fade-up-delay-1" : "opacity-0"}`}
              style={{ animationDelay: isVisible ? "0.15s" : undefined }}
            />
          </div>
          <div className="flex-1 text-gray-300 leading-relaxed text-left">
            <p
              className={`mb-4 text-xl ${isVisible ? "fade-up fade-up-delay-2" : "opacity-0"}`}
              style={{ animationDelay: isVisible ? "0.25s" : undefined }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
              consequat nulla eget elit. Duis consequat nulla eget elit. Duis
              consequat nulla eget elit. Duis consequat nulla eget elit. Duis
              consequat nulla eget elit. Duis consequat nulla eget elit. Duis
              consequat nulla eget elit.
            </p>
            <p
              className={`text-xl ${isVisible ? "fade-up fade-up-delay-3" : "opacity-0"}`}
              style={{ animationDelay: isVisible ? "0.35s" : undefined }}
            >
              Duis consequat nulla eget elit. Duis consequat nulla eget elit.
              Duis consequat nulla eget elit. Duis consequat nulla eget elit.
              Duis consequat nulla eget elit. Duis consequat nulla eget elit.
              Duis consequat nulla eget elit. Duis consequat nulla eget elit.
              Duis consequat nulla eget elit.
            </p>
          </div>
        </div>
      </div>
      <noscript>
        <style>{`.fade-up { opacity: 1 !important; animation: none !important; }`}</style>
      </noscript>
    </section>
  );
}
