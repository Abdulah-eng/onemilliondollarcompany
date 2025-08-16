// src/components/landing/Navbar.tsx

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom'; // 👈 STEP 1: Import Link

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

  // ... (the useEffect hooks remain exactly the same)

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
            {/* Anchor links are unchanged */}
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

            {/* 👇 STEP 2: Update Desktop Route Buttons */}
            <div className="flex items-center space-x-3">
              {routeButtons.map((btn) => (
                <Link to={btn.href} key={btn.name}>
                  <Button variant={btn.variant} size="sm">
                    {btn.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button is unchanged */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
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
          {/* Mobile anchor links are unchanged */}
          <div className="space-y-1 border-b border-border bg-background px-2 pt-2 pb-3">
             {anchorLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                  className={`block rounded-md px-3 py-2 text-base font-medium transition-colors hover:text-primary ${
                    activeSection === item.href.slice(1) ? 'text-primary bg-primary/5' : 'text-foreground/70'
                  }`}
                >
                  {item.name}
                </a>
              ))}
            {/* 👇 STEP 3: Update Mobile Route Buttons */}
            <div className="pt-2 space-y-2">
              {routeButtons.map((btn) => (
                <Link to={btn.href} key={btn.name} onClick={() => setIsOpen(false)}>
                   <Button variant={btn.variant} size="sm" className="w-full">
                    {btn.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
