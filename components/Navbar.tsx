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
  if (element) {
    const targetPosition = element.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 900;
    let start: number | null = null;
    const easeInOutCubic = (t: number): number =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const animation = (currentTime: number) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      window.scrollTo(0, startPosition + distance * ease);
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };
    requestAnimationFrame(animation);
  }
}

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 text-white shadow-lg"
      style={{
        backgroundImage: 'url(/NavBar-BG.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />
      <div className="relative flex items-center justify-between py-2 px-4 z-10">
        <div className="flex items-center gap-4 ml-4 md:ml-16">
          <img src="/logo.png" alt="Accugeo Logo" className="h-20 md:h-28" />
          <div className="flex flex-col text-white">
            <span className="text-xl md:text-2xl font-semibold leading-tight">Accugeo Construction</span>
            <span className="text-lg md:text-xl leading-tight">Materials and Testing Center</span>
          </div>
        </div>
        <NavigationMenu className="hidden md:flex mr-4 md:mr-16">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className="text-lg font-bold px-4 py-2 hover:bg-muted/30 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:outline-none cursor-pointer"
                onClick={() => scrollToSection('home')}
              >
                <span>Home</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className="text-lg font-bold px-4 py-2 hover:bg-muted/30 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:outline-none cursor-pointer"
                onClick={() => scrollToSection('about')}
              >
                <span>About</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className="text-lg font-bold px-4 py-2 hover:bg-muted/30 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:outline-none cursor-pointer"
                onClick={() => scrollToSection('services')}
              >
                <span>Services</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className="text-lg font-bold px-4 py-2 hover:bg-muted/30 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:outline-none cursor-pointer"
                onClick={() => scrollToSection('contact')}
              >
                <span>Contact</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuIndicator />
          <NavigationMenuViewport />
        </NavigationMenu>
      </div>
    </nav>
  );
}
