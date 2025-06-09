import { useEffect, useState } from 'react';
import { CgClose, CgMenuRight } from 'react-icons/cg';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { scrollToElement, useScrollToHash } from '@/lib/utils';

const useScrollDirection = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDir = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setVisible(true);
      }

      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return visible;
};

const navbarItems = [
  { id: '1', title: 'Home', link: '/' },
  { id: '2', title: 'Classes', link: '/classes' },
  { id: '3', title: 'Events', link: '/events' },
  { id: '4', title: 'Media', link: '/media' },
  { id: '5', title: 'Contact', link: '/contact' },
  { id: '6', title: 'Blog', link: '/blogs' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isVisible = useScrollDirection();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useScrollToHash();

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(storedIsLoggedIn);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleScrollToSection = (link: string) => {
    const hashIndex = link.indexOf('#');

    if (hashIndex === -1) {
      navigate(link);
      return;
    }

    const path = link.substring(0, hashIndex);
    const hash = link.substring(hashIndex + 1);

    if (
      location.pathname === path ||
      (path === '' && location.pathname === '/') ||
      (location.pathname.endsWith('/') &&
        path === location.pathname.slice(0, -1))
    ) {
      scrollToElement(hash);
    } else {
      navigate(link);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsOpen(false);
    navigate('/');
    window.location.reload();
  };

  const linkClasses = (link: string) => {
    const isActive = location.pathname === link;
    return isActive
      ? 'text-navlinkcolor font-semibold transition-colors duration-200'
      : 'text-primary1 hover:text-navlinkcolor transition-colors duration-200';
  };

  return (
    <>
      <header
        className={`sticky top-0 z-30 w-full bg-white transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <nav className="px-2 py-4 md:px-12 lg:px-20">
          <div className="flex items-center justify-between">
            {/* Logo Section - Improved for mobile */}
            <Link to="/" className="flex max-w-[70%] items-center">
              <img
                src="/logo.svg"
                alt="logo"
                className="mr-1 h-10 w-auto object-contain sm:mr-2 sm:h-12 md:h-16 lg:h-20"
              />
              <div className="flex items-center">
                <p className="whitespace-nowrap text-[14px] font-medium sm:text-xs md:text-sm lg:text-base xl:text-lg">
                  Gaana Nritya Academy&reg;,&nbsp;
                </p>
                <p className="text-[14px] font-medium sm:text-xs md:text-sm lg:text-base xl:text-lg">
                  Mangalore
                </p>
              </div>
            </Link>

            {/* Hamburger Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                className="relative z-50 rounded-full p-2 transition-colors duration-200 hover:bg-gray-100"
                onClick={handleClick}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? (
                  <CgClose className="text-2xl" />
                ) : (
                  <CgMenuRight className="text-2xl" />
                )}
              </button>
            </div>

            {/* Desktop Menu */}
            <ul className="hidden items-center gap-6 md:flex">
              {navbarItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.link}
                    className={`${linkClasses(item.link)} text-lg`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollToSection(item.link);
                    }}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              {isLoggedIn && (
                <li>
                  <Button
                    size={'sm'}
                    onClick={handleLogout}
                    className="rounded-md bg-secondary text-white transition-colors duration-200 hover:bg-secondary/90"
                  >
                    Logout
                  </Button>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile Menu - Moved outside header for better stacking */}
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out md:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        id="mobile-menu"
        className={`fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button inside mobile menu */}
        <div className="absolute right-4 top-4">
          <Button
            className="rounded-full p-2 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <CgClose className="text-2xl" />
          </Button>
        </div>

        {/* Menu content */}
        <div className="flex h-full flex-col px-6 pb-6 pt-16">
          <div className="flex-1 overflow-y-auto">
            <ul className="flex flex-col space-y-4">
              {navbarItems.map((item) => {
                const isActive = location.pathname === item.link;
                return (
                  <li key={item.id}>
                    <Link
                      to={item.link}
                      className={`block rounded-md px-2 py-3 text-lg ${
                        isActive
                          ? 'bg-gray-50 font-semibold text-navlinkcolor'
                          : 'text-primary1 hover:bg-gray-50'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleScrollToSection(item.link);
                        setIsOpen(false);
                      }}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {isLoggedIn && (
            <div className="mt-auto border-t border-gray-100 pt-4">
              <Button
                size={'sm'}
                onClick={handleLogout}
                className="w-full rounded-md bg-secondary font-medium text-white transition-colors hover:bg-secondary/90"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
