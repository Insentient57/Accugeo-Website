"use client";

import React, { useEffect, useRef, useState } from "react";

type Service = {
  title: string;
  description: string;
  image: string;
  alt?: string;
};

const services: Service[] = [
  {
    title: "Material Testing",
    description:
      "Comprehensive laboratory testing for concrete, soil, aggregate and asphalt to ensure project compliance and performance.",
    image: "/service1.png",
    alt: "Laboratory testing equipment and concrete samples",
  },
  {
    title: "Quality Inspection",
    description:
      "On-site inspection and reporting to maintain quality control through all phases of construction and material delivery.",
    image: "/service2.png",
    alt: "Inspector checking construction materials on site",
  },
  {
    title: "Consulting & Reporting",
    description:
      "Technical consulting, tailored specifications, and clear, timely reports to help teams make informed decisions.",
    image: "/service3.png",
    alt: "Engineer preparing a technical report",
  },
];

/**
 * ServicesOverview
 * - A compact 3-card summary suitable for scan-readers.
 * - Reduced typography scale and restrained visual weight.
 */
function ServicesOverview({ items }: { items: Service[] }) {
  return (
    <section aria-labelledby="services-overview-title" className="py-12">
      <div className="container mx-auto px-6">
        <h3
          id="services-overview-title"
          className="text-2xl md:text-3xl font-semibold text-center mb-8"
        >
          Our Core Services
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((s, i) => (
            <article
              key={s.title}
              className="bg-gray-900/60 border border-gray-800 rounded-lg p-6 flex flex-col items-start gap-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4 w-full">
                <div className="w-16 h-16 rounded-md bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {/* Using simple <img> to avoid build-time image config issues.
                      Include reasonable attributes to reduce layout shift. */}
                  <img
                    src={s.image}
                    alt={s.alt ?? s.title}
                    className="w-full h-full object-contain"
                    width={64}
                    height={64}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </div>
                <h4 className="text-lg font-medium">{s.title}</h4>
              </div>

              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                {s.description}
              </p>

              <div className="mt-auto">
                <a
                  href="#contact"
                  className="inline-block mt-2 text-sm font-semibold text-white bg-brand-red px-3 py-2 rounded-md hover:brightness-110 focus-visible:outline-2 focus-visible:outline focus-visible:outline-offset-2"
                >
                  Contact us
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * ServicesShowcase
 * - Controlled carousel with accessible controls and keyboard support.
 * - Uses smaller, calmer hero heading than previous design.
 */
function ServicesShowcase({ items }: { items: Service[] }) {
  const [index, setIndex] = useState(0);
  const regionRef = useRef<HTMLDivElement | null>(null);
  const liveRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // announce slide change for screen readers
    if (liveRef.current) {
      liveRef.current.textContent = `${items[index].title}: ${items[index].description}`;
    }
  }, [index, items]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Allow left/right navigation when focus is inside the region
      if (!regionRef.current) return;
      if (!regionRef.current.contains(document.activeElement)) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIndex((prev) => (prev - 1 + items.length) % items.length);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setIndex((prev) => (prev + 1) % items.length);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [items.length]);

  const goTo = (i: number) =>
    setIndex(((i % items.length) + items.length) % items.length);

  return (
    <section
      aria-labelledby="services-showcase-title"
      className="py-12 bg-black/60"
      ref={regionRef}
    >
      <div className="container mx-auto px-6">
        <h2
          id="services-showcase-title"
          className="text-4xl md:text-5xl font-bold text-center mb-8"
        >
          What We Offer
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Visual */}
          <div className="rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center relative">
            <img
              src={items[index].image}
              alt={items[index].alt ?? items[index].title}
              className="w-full h-64 md:h-96 object-cover"
              width={1200}
              height={700}
              loading={index === 0 ? "eager" : "lazy"}
            />

            {/* Prev / Next controls */}
            <button
              aria-label="Previous slide"
              onClick={() =>
                setIndex((i) => (i - 1 + items.length) % items.length)
              }
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 p-2 rounded-full focus-visible:outline-2 focus-visible:outline focus-visible:outline-offset-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              aria-label="Next slide"
              onClick={() => setIndex((i) => (i + 1) % items.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 p-2 rounded-full focus-visible:outline-2 focus-visible:outline focus-visible:outline-offset-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Text + Thumbnails */}
          <div>
            <div className="mb-4">
              <h3 className="text-2xl md:text-3xl font-semibold">
                {items[index].title}
              </h3>
              <p className="text-gray-300 mt-3">{items[index].description}</p>
            </div>

            <div className="mt-6">
              <p className="sr-only" aria-live="polite" ref={liveRef} />
              <div className="flex gap-3">
                {items.map((s, i) => (
                  <button
                    key={s.title}
                    onClick={() => goTo(i)}
                    className={`relative rounded-md overflow-hidden border ${
                      i === index ? "ring-2 ring-brand-red" : "border-gray-700"
                    } focus-visible:outline-2 focus-visible:outline focus-visible:outline-offset-2`}
                    aria-label={`Show ${s.title}`}
                    aria-current={i === index ? "true" : undefined}
                  >
                    <img
                      src={s.image}
                      alt={s.alt ?? s.title}
                      className="w-24 h-24 object-cover block"
                      width={96}
                      height={96}
                      loading={i === index ? "eager" : "lazy"}
                    />
                    {i === index && (
                      <span className="sr-only">Currently selected</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <a
                href="#contact"
                className="inline-block text-sm font-semibold text-white bg-brand-red px-4 py-2 rounded-md hover:brightness-110 focus-visible:outline-2 focus-visible:outline focus-visible:outline-offset-2"
              >
                Get a quote
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Default exported Services section
 * - Presents a scoped, less-dominant layout:
 *   1) Overview (cards)
 *   2) Showcase (carousel spotlight)
 *
 * This splits the responsibilities so users can scan quickly (overview)
 * and dive deeper (showcase) without duplicate content or overwhelming scale.
 */
export default function Services() {
  return (
    <section id="services" className="bg-black text-white">
      <div className="container mx-auto px-6 pt-16">
        {/* Small contextual heading to introduce the section */}
        <header className="max-w-4xl mx-auto text-center mb-6">
          <p className="text-sm uppercase tracking-wide text-gray-400">
            Services
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Professional testing & inspection
          </h1>
          <p className="text-gray-300 mt-3">
            Practical, accurate, and timely laboratory and field services to
            support construction quality and compliance.
          </p>
        </header>
      </div>

      <ServicesOverview items={services} />
      <ServicesShowcase items={services} />

      {/* subtle divider — avoids the previous high-contrast diagonal stripe */}
      <div className="h-12" />

      {/* Noscript fallback: ensure content is visible when JS is disabled */}
      <noscript>
        <style>{`.fade-up { opacity: 1 !important; animation: none !important; }`}</style>
      </noscript>
    </section>
  );
}
