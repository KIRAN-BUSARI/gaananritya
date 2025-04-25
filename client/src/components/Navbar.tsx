import { useEffect, useState } from 'react';
import { CgClose, CgMenuRight } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';

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
    link: '/',
  },
  {
    id: '2',
    title: 'Classes',
    link: '/classes',
    name: 'classes',
  },
  {
    id: '3',
    title: 'Events',
    link: '/events',
    name: 'events',
  },
  {
    id: '4',
    title: 'Gallery',
    link: '/gallery',
    name: 'gallery',
  },
  {
    id: '5',
    title: 'contact',
    link: '/contact',
    name: 'contact',
  },
  {
    id: '6',
    title: 'blog',
    link: '/blog',
    name: 'blog',
  },
];

interface UserData {
  role: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const isVisible = useScrollDirection();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
      const storedUserData = localStorage.getItem('user');

      setIsLoggedIn(storedIsLoggedIn === 'true');

      if (storedUserData) {
        try {
          const userData: UserData = JSON.parse(storedUserData);
          setUserRole(userData?.role || null);
        } catch (e) {
          console.error('Failed to parse user data from localStorage:', e);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    }
  }, []);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
    setIsOpen(false);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('accessToken');
      setIsLoggedIn(false);
      setUserRole(null);
      setIsOpen(false);
      navigate('/');
      location.reload();
    }
  };

  const linkClasses = (link: string) =>
    link === activeLink ? 'text-navlinkcolor' : 'text-primary1';

  const isAdmin = isLoggedIn && userRole === 'ADMIN';

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

          {isOpen && (
            <div className="fixed right-0 top-[80px] w-full font-medium md:hidden">
              <div className="absolute mt-0 flex h-auto w-full flex-col items-end text-end">
                <div className="block list-none rounded-bl-lg bg-white px-5 py-5 text-base shadow-lg">
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
                    {isAdmin && (
                      <li className="capitalize">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left text-secondary hover:text-secondary/90"
                        >
                          Logout
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="hidden list-none text-lg md:block">
            <ul className="flex items-center gap-6">
              {navbarItems.map((item) => (
                <li key={item.id} className="font-medium capitalize">
                  <a
                    href={item.link}
                    onClick={() => handleLinkClick(item.name || '')}
                    className={`${linkClasses(item.name || '')} transition-colors hover:text-navlinkcolor`}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
              {isAdmin && (
                <li className="flex items-center font-medium capitalize">
                  <button
                    onClick={handleLogout}
                    className="rounded bg-secondary px-3 py-1 text-sm text-white hover:bg-secondary/90"
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
