import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const anchorLinks = [
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Pricing', href: '#pricing' },
];

const routeButtons = [
  { name: 'Login', href: '/login', variant: 'outline' as const },
  { name: 'Get Started', href: '/get-started', variant: 'default' as const },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const onScroll = () => {
      const sections = ['hero', 'features', 'how-it-works', 'pricing'];
      const y = window.scrollY + 100;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { offsetTop, offsetHeight } = el;
        if (y >= offsetTop && y < offsetTop + offsetHeight) { 
          setActiveSection(id); 
          break; 
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => (e.key === 'Escape' && setIsOpen(false));
    window.addEventListener('keydown', onKey);
    return () => { 
      window.removeEventListener('keydown', onKey); 
      document.body.style.overflow = ''; 
    };
  }, [isOpen]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); handleNavClick('#hero'); }}
            className="text-xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            TrainWiseStudio
          </a>

          <div className="hidden md:flex flex-1 items-center justify-between ml-10">
            <div className="flex items-baseline space-x-6">
              {anchorLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                  className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                    activeSection === item.href.slice(1) ? 'text-primary' : 'text-foreground/70'
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              {routeButtons.map((btn) => (
                <Button key={btn.name} variant={btn.variant} size="sm" className="btn-wellness-primary">
                  {btn.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div id="mobile-menu" role="dialog" aria-modal="true" className="md:hidden">
          <div className="space-y-1 border-b border-border bg-background px-2 pt-2 pb-3">
            {anchorLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                className={`block px-3 py-2 text-base font-medium transition-colors hover:text-primary ${
                  activeSection === item.href.slice(1) ? 'text-primary bg-primary/5' : 'text-foreground/70'
                }`}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-2 space-y-2">
              {routeButtons.map((btn) => (
                <Button 
                  key={btn.name} 
                  variant={btn.variant} 
                  size="sm" 
                  className="w-full btn-wellness-primary" 
                  onClick={() => setIsOpen(false)}
                >
                  {btn.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}