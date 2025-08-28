export default function Footer() {
  const footerLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Get Started', href: '#get-started' },
    { name: 'Support', href: 'mailto:hello@trainwisestudio.com' },
  ];

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 text-2xl font-bold text-primary">TrainWiseStudio</div>
            <p className="mb-6 text-background/70">
              Transform your life through personalized fitness, nutrition, and mental wellness coaching.
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📱</span>
                <a 
                  href="https://instagram.com/trainwisestudio" 
                  className="transition-colors text-muted-foreground hover:text-primary" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  @trainwisestudio
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✉️</span>
                <a 
                  href="mailto:hello@trainwisestudio.com" 
                  className="transition-colors text-muted-foreground hover:text-primary"
                >
                  hello@trainwisestudio.com
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Quick Links</h3>
            <div className="space-y-2">
              {footerLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block transition-colors text-muted-foreground hover:text-primary"
                  onClick={(e) => {
                    if (link.href.startsWith('#')) {
                      e.preventDefault();
                      const el = document.querySelector(link.href);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Legal</h3>
            <div className="space-y-2">
              <a href="/terms" className="block transition-colors text-muted-foreground hover:text-primary">
                Terms of Service
              </a>
              <a href="/privacy" className="block transition-colors text-muted-foreground hover:text-primary">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-muted/30 pt-8 text-center">
          <p className="text-muted-foreground">© TrainWiseStudio 2025. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
