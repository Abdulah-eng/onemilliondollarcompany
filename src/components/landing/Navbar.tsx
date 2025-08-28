// src/components/landing/Navbar.tsx
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const anchorLinks = [
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Testimonials', href: '#testimonials' },
];

const routeButtons = [
  { name: 'Login', href: '/login', variant: 'ghost' as const },
  { name: 'Get Started', href: '/get-started', variant: 'default' as const },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        hasScrolled
          ? 'bg-white/20 backdrop-blur-md border-b border-white/30 text-white'
          : 'bg-transparent text-white'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-2xl font-bold hover:text-white/80 transition-colors"
          >
            TrainWise
          </Link>

          {/* Desktop Menu Links */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex items-baseline space-x-6">
              {anchorLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="text-sm font-medium hover:text-white/80 transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {routeButtons.map((btn) => (
              <Button key={btn.name} variant={btn.variant} size="sm" asChild>
                <Link to={btn.href}>{btn.name}</Link>
              </Button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-white/30 bg-white/20 backdrop-blur-md text-white">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {anchorLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-white/80"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="border-t border-white/30 px-2 pt-3 pb-4 space-y-2">
            {routeButtons.map((btn) => (
              <Button key={btn.name} variant={btn.variant} className="w-full" asChild>
                <Link to={btn.href} onClick={() => setIsOpen(false)}>
                  {btn.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
