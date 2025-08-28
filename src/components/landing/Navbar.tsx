// src/components/landing/Navbar.tsx

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            onClick={(e) => { e.preventDefault(); handleNavClick('#hero'); }}
            className="text-xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            TrainWiseStudio
          </Link>

          <div className="hidden md:flex flex-1 items-center justify-between ml-10">
            <div className="flex items-baseline space-x-6">
              {anchorLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                  className="text-foreground/70 hover:text-primary transition-colors font-medium"
                >
                  {item.name}
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              {routeButtons.map((btn) => (
                <Button key={btn.name} variant={btn.variant} size="sm" asChild>
                  <Link to={btn.href}>{btn.name}</Link>
                </Button>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-primary" />}
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
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-primary hover:bg-muted transition-colors"
              >
                {item.name}
              </a>
            ))}
            <div className="pt-2 space-y-2">
              {routeButtons.map((btn) => (
                <Button key={btn.name} variant={btn.variant} size="sm" className="w-full" asChild>
                  <Link to={btn.href} onClick={() => setIsOpen(false)}>{btn.name}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
