import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const anchorLinks = [
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Pricing', href: '#pricing' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navTextColor = hasScrolled ? "text-muted-foreground" : "text-white/80";
  const navTextHoverColor = hasScrolled ? "hover:text-foreground" : "hover:text-white";
  const logoColor = hasScrolled ? "text-foreground" : "text-white";

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        hasScrolled 
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm" 
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link
            to="/"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={cn("text-2xl font-bold transition-colors", logoColor)}
          >
            TrainWiseStudio
          </Link>

          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex items-baseline space-x-6">
              {anchorLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                  className={cn("text-sm font-medium transition-colors", navTextColor, navTextHoverColor)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {/* ✅ UPDATED LOGIN BUTTON LOGIC */}
            <Button asChild key="Login" variant="ghost" size="sm" className={cn("transition-colors", navTextColor, navTextHoverColor)}>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild key="Get Started" variant="default" size="sm" className={cn(!hasScrolled && "shadow-lg")}>
              <Link to="/get-started">Get Started</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle mobile menu" className={cn(logoColor, "hover:bg-white/10")}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className={cn("md:hidden border-t", hasScrolled ? "bg-background border-border" : "bg-black/80 backdrop-blur-lg border-white/20")}>
          <div className="space-y-1 px-2 pt-2 pb-3">
            {anchorLinks.map((item) => (
              <a key={item.name} href={item.href} onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                 className={cn("block px-3 py-2 rounded-md text-base font-medium transition-colors", navTextColor, navTextHoverColor, !hasScrolled && "hover:bg-white/10")}
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className={cn("px-2 pt-3 pb-4 space-y-2 border-t", hasScrolled ? "border-border" : "border-white/20")}>
            <Button variant="ghost" className={cn("w-full", navTextColor, navTextHoverColor)} asChild>
              <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
            </Button>
            <Button variant="default" className="w-full" asChild>
              <Link to="/get-started" onClick={() => setIsOpen(false)}>Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
