"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (!element) return;
  const nav = document.querySelector("nav");
  const navHeight = nav ? (nav as HTMLElement).offsetHeight : 0;
  const y =
    element.getBoundingClientRect().top + window.scrollY - navHeight - 8; // 8px gap
  window.scrollTo({ top: y, behavior: "smooth" });
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Prevent background scroll and manage focus when drawer opens/closes
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current =
        document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";
      // focus the close button once the drawer is in the DOM
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 0);
    } else {
      document.body.style.overflow = "";
      previouslyFocusedRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Key handling: Escape to close; simple focus trap (cycle focus inside drawer)
  useEffect(() => {
    function onKeyDown(ev: KeyboardEvent) {
      if (!isOpen) return;
      if (ev.key === "Escape") {
        ev.preventDefault();
        setIsOpen(false);
        return;
      }
      if (ev.key === "Tab" && drawerRef.current) {
        const focusable = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter(
          (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
        );
        if (focusable.length === 0) {
          ev.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (ev.shiftKey && document.activeElement === first) {
          ev.preventDefault();
          last.focus();
        } else if (!ev.shiftKey && document.activeElement === last) {
          ev.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 text-white shadow-lg"
      style={{
        backgroundImage: "url(/NavBar-BG.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backdropFilter: "blur(4px)",
      }}
    >
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />
      <div className="relative flex items-center justify-between py-2 px-4 z-10">
        <div className="flex items-center gap-4 ml-4 md:ml-16">
          <img src="/logo.png" alt="Accugeo Logo" className="h-20 md:h-28" />
          <div className="flex flex-col text-white">
            <span className="text-xl md:text-2xl font-semibold leading-tight">
              Accugeo Construction
            </span>
            <span className="text-lg md:text-xl leading-tight">
              Materials and Testing Center
            </span>
          </div>
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center md:hidden">
          <button
            ref={closeButtonRef}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            className="p-2 mr-4 focus-visible:outline-none"
            onClick={() => setIsOpen((s) => !s)}
          >
            {isOpen ? (
              // Close icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        <NavigationMenu className="hidden md:flex mr-4 md:mr-16">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className="text-lg font-bold px-4 py-2 hover:bg-muted/30 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:outline-none cursor-pointer"
                onClick={() => scrollToSection("home")}
              >
                <span>Home</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className="text-lg font-bold px-4 py-2 hover:bg-muted/30 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:outline-none cursor-pointer"
                onClick={() => scrollToSection("about")}
              >
                <span>About</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className="text-lg font-bold px-4 py-2 hover:bg-muted/30 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:outline-none cursor-pointer"
                onClick={() => scrollToSection("services")}
              >
                <span>Services</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className="text-lg font-bold px-4 py-2 hover:bg-muted/30 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:outline-none cursor-pointer"
                onClick={() => scrollToSection("contact")}
              >
                <span>Contact</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuIndicator />
          <NavigationMenuViewport />
        </NavigationMenu>
      </div>

      {/* Mobile off-canvas nav */}
      {isOpen && (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          ref={drawerRef}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col p-6 md:hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Accugeo Logo" className="h-12" />
              <div className="flex flex-col text-white">
                <span className="text-lg font-semibold">
                  Accugeo Construction
                </span>
                <span className="text-sm">Materials and Testing Center</span>
              </div>
            </div>
            <button
              aria-label="Close menu"
              className="p-2 focus-visible:outline-none"
              onClick={() => setIsOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            <button
              className="text-left text-2xl font-bold text-white p-2 focus-visible:ring-2 focus-visible:ring-brand-red"
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => scrollToSection("home"), 60);
              }}
            >
              Home
            </button>
            <button
              className="text-left text-2xl font-bold text-white p-2 focus-visible:ring-2 focus-visible:ring-brand-red"
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => scrollToSection("about"), 60);
              }}
            >
              About
            </button>
            <button
              className="text-left text-2xl font-bold text-white p-2 focus-visible:ring-2 focus-visible:ring-brand-red"
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => scrollToSection("services"), 60);
              }}
            >
              Services
            </button>
            <button
              className="text-left text-2xl font-bold text-white p-2 focus-visible:ring-2 focus-visible:ring-brand-red"
              onClick={() => {
                setIsOpen(false);
                setTimeout(() => scrollToSection("contact"), 60);
              }}
            >
              Contact
            </button>
          </nav>
        </div>
      )}
    </nav>
  );
}
