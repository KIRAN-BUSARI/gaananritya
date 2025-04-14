import facebook_logo from '@/assets/ion_logo-facebook.png';
import instagram_logo from '@/assets/ri_instagram-fill.png';
import gmail_logo from '@/assets/basil_gmail-solid.png';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const socialLinks: { id: number; icon: string; link: string }[] = [
  {
    id: 1,
    icon: facebook_logo,
    link: 'https://www.facebook.com/chinnu.archana/',
  },
  {
    id: 2,
    icon: instagram_logo,
    link: 'https://www.instagram.com/sanoopura_nrityalaya/',
  },
  {
    id: 5,
    icon: gmail_logo,
    link: 'mailto:sa@gmail.com',
  },
];

const footerItems: {
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
    title: 'Gallery',
    link: '#gallery',
    name: 'gallery',
  },
  {
    id: '3',
    title: 'Events',
    link: '#events',
    name: 'events',
  },
  {
    id: '4',
    title: 'About me',
    link: '#about',
    name: 'about',
  },
  // {
  //   id: "5",
  //   title: "team",
  //   link: "#team",
  //   name: "team",
  // },
  {
    id: '6',
    title: 'contact',
    link: '#footer',
    name: 'contact',
  },
];

const Footer = () => {
  return (
    <div
      id="footer"
      className="h-[320px] w-full bg-secondary px-4 text-white md:px-[120px]"
    >
      <div className="flex flex-col-reverse md:h-full md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-5">
          <div className="hidden md:block">
            <Logo />
          </div>
          <div className="flex space-x-5 pt-5 md:pt-0">
            {socialLinks.map((link) => (
              <Link to={link.link} target="_blank" key={link.id}>
                <img src={link.icon} alt={link.icon} />
              </Link>
            ))}
          </div>
        </div>
        <>
          <ul className="-mr-[400px] hidden flex-col space-y-2.5 text-white md:block">
            {footerItems.map((item) => (
              <li key={item.id} className="capitalize">
                <a href={item.link}>{item.title}</a>
              </li>
            ))}
          </ul>
        </>

        <div className="flex flex-col space-y-8 pt-8 md:pt-0">
          <div className="space-y-2">
            <h1 className="font-samarkan text-2xl font-medium md:text-[36px]">
              SANOOPURA NRITYALAYA
            </h1>
            <p className="text-sm font-normal md:text-base">
              No 341 Sai Sparsh 2nd Floor, 8th Main Rd,
              <br className="md:hidden" /> JHCS Layout,
              <br className="hidden md:block" />
              Uttarahalli Hobli, Bengaluru,
              <br className="md:hidden" /> Karnataka 560061.
            </p>
          </div>

          <h3 className="text-[24px] font-semibold">
            Contact: + 91-9611494919
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Footer;
