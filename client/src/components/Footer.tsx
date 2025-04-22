import Logo from './Logo';
import {
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  LucideProps,
} from 'lucide-react/';
import { ComponentType } from 'react';

const socialLinks: {
  id: string;
  icon: ComponentType<LucideProps>;
  link: string;
}[] = [
  {
    id: '1',
    icon: Twitter,
    link: '',
  },
  {
    id: '2',
    icon: Linkedin,
    link: '',
  },
  {
    id: '2',
    icon: Instagram,
    link: '',
  },
  {
    id: '3',
    icon: Facebook,
    link: '',
  },
];

const Footer = () => {
  return (
    <div
      id="footer"
      className="h-[320px] w-full bg-secondary px-4 text-white md:px-[120px]"
    >
      <div className="flex flex-col-reverse md:h-full md:flex-row md:items-center md:justify-between">
        <div className="flex gap-5">
          <div className="">
            <Logo />
          </div>
          <div className="">
            <div className="flex flex-col space-y-2">
              <h1 className="text-[#FFD45C]">Gaana Nritya Academy</h1>
              <p className="text-balance">
                Tharangini Raktheshwari,
                <br /> Nagar Kottara Chowki, Mangaluru,
                <br /> Karnataka - 575006
              </p>
              <p>9986563999</p>
              <p>gaananritya@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex space-x-12">
            <ul className="list-none space-y-4">
              <h1 className="text-base font-semibold text-[#FFD45C]">
                Classes
              </h1>
              <li>Bharatanatyam</li>
              <li>Carnatic Music</li>
              <li>Worshops</li>
              <li>Registrations</li>
            </ul>
            <ul className="list-none space-y-4">
              <h1 className="text-base font-semibold text-[#FFD45C]">Media</h1>
              <li>Gallery</li>
              <li>Videos</li>
              <li>Press</li>
              <li>Registrations</li>
            </ul>
            <ul className="list-none space-y-4">
              <h1 className="text-base font-semibold text-[#FFD45C]">Events</h1>
              <li>Upcoming Events</li>
              <li>Productions</li>
              <li>Past Events</li>
              <li>Festivals</li>
            </ul>
            <ul className="list-none space-y-4">
              <h1 className="text-base font-semibold text-[#FFD45C]">Home</h1>
              <li>Founder</li>
              <li>Achievements</li>
              <li>Contact Form</li>
              <li>Faq</li>
            </ul>
          </div>
          <div className="mt-4 flex space-x-4">
            {socialLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <div key={link.id}>
                  <a href={link.link} target="_blank" rel="noopener noreferrer">
                    {IconComponent && (
                      <IconComponent size={24} className="text-[#FFD45C]" />
                    )}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
