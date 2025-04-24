import Logo from './Logo';
import {
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  LucideProps,
} from 'lucide-react/';
import { ComponentType } from 'react';

interface SocialLink {
  id: string;
  icon: ComponentType<LucideProps>;
  link: string;
  label: string;
}

interface FooterLinkSection {
  title: string;
  links: { name: string; href: string }[];
}

const socialLinks: SocialLink[] = [
  {
    id: 'twitter',
    icon: Twitter,
    link: '#',
    label: 'Twitter',
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    link: '#',
    label: 'LinkedIn',
  },
  {
    id: 'instagram',
    icon: Instagram,
    link: '#',
    label: 'Instagram',
  },
  {
    id: 'facebook',
    icon: Facebook,
    link: '#',
    label: 'Facebook',
  },
];

const footerSections: FooterLinkSection[] = [
  {
    title: 'Classes',
    links: [
      { name: 'Bharatanatyam', href: '#' },
      { name: 'Carnatic Music', href: '#' },
      { name: 'Workshops', href: '#' },
      { name: 'Registrations', href: '#' },
    ],
  },
  {
    title: 'Media',
    links: [
      { name: 'Gallery', href: '#' },
      { name: 'Videos', href: '#' },
      { name: 'Press', href: '#' },
    ],
  },
  {
    title: 'Events',
    links: [
      { name: 'Upcoming Events', href: '#' },
      { name: 'Productions', href: '#' },
      { name: 'Past Events', href: '#' },
      { name: 'Festivals', href: '#' },
    ],
  },
  {
    title: 'Home',
    links: [
      { name: 'Founder', href: '#' },
      { name: 'Achievements', href: '#' },
      { name: 'Contact Form', href: '#' },
      { name: 'FAQ', href: '#' },
    ],
  },
];

const Footer = () => {
  return (
    <footer
      id="footer"
      className="w-full bg-secondary px-4 py-8 text-white sm:px-6 md:px-[120px] md:py-10"
    >
      <div className="mx-auto flex max-w-screen-xl flex-col gap-8 md:flex-row md:justify-between">
        {/* Logo and Address Section */}
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-5">
          <div className="shrink-0">
            <Logo />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-[#FFD45C]">
              Gaana Nritya Academy
            </h3>
            <address className="not-italic">
              <p className="text-sm leading-relaxed">
                Tharangini Raktheshwari,
                <br /> Nagar Kottara Chowki, Mangaluru,
                <br /> Karnataka - 575006
              </p>
              <p className="mt-2 text-sm">
                <a href="tel:9986563999" className="hover:text-[#FFD45C]">
                  9986563999
                </a>
              </p>
              <p className="mt-1 text-sm">
                <a
                  href="mailto:gaananritya@gmail.com"
                  className="hover:text-[#FFD45C]"
                >
                  gaananritya@gmail.com
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Navigation Links Section */}
        <div className="flex flex-col items-center gap-6 md:items-end">
          <nav className="hidden grid-cols-2 gap-x-8 gap-y-6 md:grid md:grid-cols-4 md:gap-x-12">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="mb-3 text-base font-semibold text-[#FFD45C]">
                  {section.title}
                </h4>
                <ul className="list-none space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm hover:text-[#FFD45C]"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Social Links Section */}
          <div className="mt-4 flex space-x-4">
            {socialLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={link.id}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="text-[#FFD45C] transition-opacity hover:opacity-80"
                >
                  {IconComponent && <IconComponent size={24} />}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-xs text-gray-400 md:mt-10">
        © {new Date().getFullYear()} Gaana Nritya Academy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
