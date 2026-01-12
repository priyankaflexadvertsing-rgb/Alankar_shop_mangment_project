import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="relative bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 overflow-hidden select-none">
      {/* Wave background SVG - changes color with theme */}
      <svg 
        className="absolute bottom-0 left-0 w-full h-40 opacity-10 dark:opacity-15 transition-opacity duration-700" 
        viewBox="0 0 1440 320" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path 
          fill="currentColor" 
          fillOpacity="0.05" 
          className="text-slate-900 dark:text-white" 
          d="M0,160L60,165.3C120,171,240,181,360,181.3C480,181,600,171,720,149.3C840,128,960,96,1080,85.3C1200,75,1320,85,1380,90.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" 
        />
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10"
      >
        {/* Logo + About */}
        <div>
          <img 
            src="/path-to-printify-logo.png" 
            alt="Printify Logo" 
            className="w-28 mb-6"
          />
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
           Printify Advertising & Flex Printing offers premium printing solutions in Damoh, Madhya Pradesh. Our services include flex banners, business cards, wedding & shadi cards, one-way vision, GSB boards, LED vinyl printing, and more.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white dark:text-blue-400 font-semibold mb-6">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            {[
              { label: 'Home', href: '/' },
              { label: 'Products & Services', href: '/products-services' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
              { label: 'Privacy Policy', href: '/privacy-policy' }
            ].map(({label, href}) => (
              <li key={label}>
                <a
                  href={href}
                  className="hover:text-blue-500 focus:text-blue-500 focus:outline-none transition-colors duration-200"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white dark:text-blue-400 font-semibold mb-6">Contact Us</h3>
          <address className="not-italic text-sm space-y-2 text-slate-600 dark:text-slate-400">
            <p><strong>Printify Advertising & Flex Printing</strong></p>
            <p>Damoh m.p.</p>
            <p> Damoh, Madhya Pradesh 470661</p>
            <p>
              Phone:{' '}
              <a
                href="tel:"
                className="hover:text-blue-500 focus:text-blue-500 focus:outline-none transition-colors duration-200"
              >
                +91 8770970506
              </a>
            </p>
          </address>
        </div>

        {/* Google Map */}
        <div>
          <iframe
            title="Printify Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.904129132443!2d79.1347293154323!3d23.832674184558133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39823eb9c1453063%3A0x73f88f7a43416864!2sAlankar%20Flex%20Printing%20%26%20Advertisers%20Damoh!5e0!3m2!1sen!2sin!4v1685171640582!5m2!1sen!2sin"
            width="100%"
            height="200"
            className="rounded-xl border border-slate-700 dark:border-slate-600"
            style={{ border: 0 }}
            
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="border-t border-slate-300 dark:border-slate-700 text-center py-6 text-xs text-slate-500 dark:text-slate-400 relative z-10 select-text"
      >
        © 2026 Printify Advertising & Flex Printing Damoh. Built by{' '}
        <a
          href="https://grexa.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-500 focus:text-blue-500 focus:outline-none transition-colors duration-200"
        >
          Grexa
        </a>.
      </motion.div>
    </footer>
  );
};

export default Footer;
