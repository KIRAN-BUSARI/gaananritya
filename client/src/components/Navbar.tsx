import { useState } from 'react';
import { CgClose, CgMenuRight } from 'react-icons/cg';

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
    <header className="sticky top-0 z-20 w-full bg-white">
      <nav className="px-4 py-[24px] md:px-[120px] lg:ml-0 lg:mr-0">
        <div className="flex w-full items-center justify-between">
          <a href={'/'}>
            <div className="flex flex-col items-center">
              <p className="bg-gradient-to-r from-[#1b1b1e] to-[#1b1b1e] bg-clip-text text-lg font-medium capitalize text-transparent dark:to-white">
                Gaana Nritya Academy, <br className="block md:hidden" />
                <span className="">Manglore</span>
              </p>
            </div>
          </a>

          <button className="relative -mr-2 md:hidden" onClick={handleClick}>
            {isOpen ? (
              <CgClose className="text-2xl" />
            ) : (
              <CgMenuRight className="size-8" />
            )}
          </button>

          {isOpen ? (
            <>
              <div className="fixed right-0 w-full font-semibold md:hidden">
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
            <div className="hidden list-none text-base font-normal md:block">
              <ul className="flex gap-10">
                {navbarItems.map((item) => (
                  <li key={item.id} className="font-semibold capitalize">
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
          )}
        </div>
      </nav>
    </header>
  );
}
