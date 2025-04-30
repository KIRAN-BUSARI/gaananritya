import Logo from './Logo';
import {
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  LucideProps,
} from 'lucide-react/';
import { ComponentType } from 'react';
import { Link } from 'react-router-dom';

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
      { name: 'Bharatanatyam', href: '/classes' },
      { name: 'Carnatic Music', href: '/classes' },
      { name: 'Workshops', href: '/classes' },
      { name: 'Registrations', href: '/classes' },
    ],
  },
  {
    title: 'Media',
    links: [
      { name: 'Gallery', href: '/gallery' },
      { name: 'Videos', href: '/gallery/videos' },
      { name: 'Press', href: '/press' },
    ],
  },
  {
    title: 'Events',
    links: [
      { name: 'Upcoming Events', href: '/events/upcoming' },
      { name: 'Productions', href: '/events/productions' },
      { name: 'Past Events', href: '/events/past' },
      { name: 'Festivals', href: '/events/festivals' },
    ],
  },
  {
    title: 'Home',
    links: [
      { name: 'Founder', href: '/founder' },
      { name: 'Achievements', href: '/achievements' },
      { name: 'Contact Form', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
    ],
  },
];

const Footer = () => {
  return (
    <footer
      id="footer"
      className="w-full bg-secondary px-4 py-8 text-white md:py-10"
    >
      <div className="mx-auto flex max-w-screen-xl flex-col gap-8 md:flex-row md:justify-between">
        {/* Logo and Address Section */}
        <div className="flex flex-col items-center text-center md:flex-row md:items-start md:gap-5 md:text-left">
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
                <a
                  href="tel:9986563999"
                  className="transition-colors hover:text-[#FFD45C]"
                >
                  9986563999
                </a>
              </p>
              <p className="mt-1 text-sm">
                <a
                  href="mailto:gaananritya@gmail.com"
                  className="transition-colors hover:text-[#FFD45C]"
                >
                  gaananritya@gmail.com
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Navigation Links Section */}
        <div className="flex flex-col items-center gap-6 md:items-end">
          {/* Desktop Navigation */}
          <nav className="hidden md:grid md:grid-cols-4 md:gap-x-12">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="mb-3 text-base font-semibold text-[#FFD45C]">
                  {section.title}
                </h4>
                <ul className="list-none space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm transition-colors hover:text-[#FFD45C]"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Social Links Section */}
          <div className="mt-6 flex space-x-5">
            {socialLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={link.id}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="text-[#FFD45C] transition-all hover:scale-110 hover:opacity-80"
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
        <div>
          © {new Date().getFullYear()} Gaana Nritya Academy. All rights
          reserved.
        </div>
        <div className="mt-1">
          Designed & Developed by{' '}
          <a
            href="https://pixelcrew.in"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[#FFD45C]"
          >
            PIXELCREW
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
