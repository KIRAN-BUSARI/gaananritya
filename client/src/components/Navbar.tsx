import { useEffect, useState } from 'react';
import { CgClose, CgMenuRight } from 'react-icons/cg';

const useScrollDirection = () => {
  const [, setScrollY] = useState(0);
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
      setScrollY(window.scrollY);
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

const navbarItems: {
  id: string;
  title: string;
  link: string;
  name?: string;
}[] = [
  {
    id: '1',
    title: 'Home',
    link: '#',
  },
  {
    id: '2',
    title: 'Classes',
    link: '#classes',
    name: 'classes',
  },
  {
    id: '3',
    title: 'About Us',
    link: '#aboutus',
    name: 'aboutus',
  },
  {
    id: '4',
    title: 'Events',
    link: '#events',
    name: 'events',
  },
  {
    id: '5',
    title: 'Gallery',
    link: '#gallery',
    name: 'gallery',
  },
  {
    id: '6',
    title: 'contact',
    link: '#footer',
    name: 'contact',
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const isVisible = useScrollDirection();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
    setIsOpen(false);
  };

  const linkClasses = (link: string) =>
    link === activeLink ? 'text-navlinkcolor' : 'text-primary1';

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md transition-all duration-300 ${
        !isVisible ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <nav className="px-4 py-[16px] md:px-[120px] lg:ml-0 lg:mr-0">
        <div className="flex w-full items-center justify-between">
          <a href={'/'}>
            <div className="flex items-center">
              <img src="/logo.png" alt="logo" className="size-12 md:size-16" />
              <p className="text-sm font-medium capitalize md:text-xl">
                Gaana Nritya Academy&reg;,&nbsp;
                <span className="">Manglore</span>
              </p>
            </div>
          </a>

          <button className="relative -mr-2 md:hidden" onClick={handleClick}>
            {isOpen ? (
              <CgClose className="text-2xl" />
            ) : (
              <CgMenuRight className="size-7" />
            )}
          </button>

          {isOpen ? (
            // Mobile Menu
            <>
              <div className="fixed right-0 w-full font-medium md:hidden">
                <div className="absolute mt-5 flex h-48 w-full flex-col items-end text-end">
                  <div className="block list-none bg-white px-5 py-5 text-base md:hidden">
                    <ul className="mr-5 flex flex-col gap-5">
                      {navbarItems.map((item) => (
                        <li key={item.id} className="capitalize">
                          <a
                            href={item.link}
                            onClick={() => handleLinkClick(item.name || '')}
                            className={linkClasses(item.name || '')}
                          >
                            {item.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Desktop Menu
            <div className="hidden list-none text-lg md:block">
              <ul className="flex gap-10">
                {navbarItems.map((item) => (
                  <li key={item.id} className="font-medium capitalize">
                    <a
                      href={item.link}
                      onClick={() => handleLinkClick(item.name || '')}
                      className={`${linkClasses(item.name || '')}`}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
