import { ArrowLeft } from 'lucide-react';
import blogimg1 from '@/assets/heroSection0.png';
import blogimg2 from '@/assets/heroSection0.png';
import blogimg3 from '@/assets/heroSection0.png';
import blogimg4 from '@/assets/heroSection0.png';
import blogimg5 from '@/assets/heroSection0.png';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface Blog {
  id: number;
  image: string;
  date: string;
  title: string;
  title_paragraph: string;
  content: {
    title: string;
    paragraph: string;
  }[];
}

const sideBlogs: Blog[] = [
  {
    id: 1,
    image: blogimg1,
    date: '15th August, 2024',
    title:
      'Celebrate Krishna Janmashtami with Vastraa: Dress to Impress and Embrace the Divine Spirit',
    title_paragraph:
      'As we approach the divine celebration of Krishna’s birth, it’s the perfect time to infuse your festivities with an air of magic and tradition. At Vastraa, we specialize in turning every event into a memorable experience with our exceptional costumes and event services. This year, let us help you celebrate Krishna’s leela (divine play) in a way that’s as enchanting and vibrant as the festival itself.',
    content: [
      {
        title: 'Why Choose Vastraa for Krishna’s Celebration?',
        paragraph:
          "Divinely Inspired Costumes: Our collection of Krishna-themed costumes is designed to capture the essence of this beloved deity. From the charming peacock-feathered crowns to the resplendent silk dhotis and vibrant, hand-embroidered kurtas, each piece is crafted with intricate attention to detail. Whether you're organizing a traditional puja, a grand procession, or a themed party, our costumes will add a touch of divine grace and splendor.",
      },
      {
        title: 'Cultural Performances and Entertainment:',
        paragraph:
          'Elevate your event with traditional performances, including devotional dances and music that honor Krishna’s playful and loving nature. Our network of talented performers and entertainers can bring the joy of Krishna’s stories to life, ensuring a captivating experience for all attendees.',
      },
      {
        title: 'Custom Event Planning Services:',
        paragraph:
          'From managing guest lists to coordinating schedules, our expert event planners handle every detail with precision and care. We work closely with you to tailor every aspect of your celebration, ensuring that it reflects the joy and significance of Krishna’s arrival.',
      },
      {
        title: 'Memorable Photography and Videography:',
        paragraph:
          'Capture the beauty and excitement of your Krishna celebration with our professional photography and videography services. Our team ensures that every moment, from the elegant costumes to the joyous rituals, is preserved in high-quality imagery.',
      },
      {
        title: 'How Vastraa Costumes & Events Makes a Difference:',
        paragraph:
          'At Vastraa, we understand that each celebration is unique, and we pride ourselves on providing personalized service that reflects your vision and values. Our commitment to quality and creativity ensures that every detail of your Krishna celebration will be extraordinary.',
      },
      {
        title: 'Join Us in Celebrating Krishna’s Divine Leela',
        paragraph:
          'As we prepare to honor Krishna, let Vastraa be your partner in creating a celebration that is as joyous and divine as the deity himself. Explore our collection of costumes, decorations, and event services to transform your festivities into an unforgettable experience. For more information and to start planning your extraordinary Krishna celebration with Vastraa, visit our website or contact our team today.',
      },
    ],
  },
  {
    id: 2,
    image: blogimg2,
    date: '15th August, 2024',
    title:
      "Celebrate India's Independence Day with Vastraa: Dress to Express Patriotism and Pride",
    title_paragraph:
      "As we approach the nation's most cherished day of freedom, Independence Day, it’s the perfect time to celebrate our heritage and pride with a blend of tradition, elegance, and modernity. At Vastraa, we offer costumes and event services that bring the spirit of India alive. Whether it’s for a grand ceremony, cultural event, or school performance, we ensure that your Independence Day celebrations are truly memorable.",
    content: [
      {
        title: 'Why Choose Vastraa for Your Independence Day Celebration?',
        paragraph:
          'Patriotic-Themed Costumes: Our collection of Independence Day costumes is designed to reflect the rich culture and diversity of India. From classic outfits in the tricolor to historically inspired attire representing the leaders and heroes of our nation, each costume is carefully crafted to honor the significance of this day. Perfect for flag-hoisting events, parades, or themed parties, our costumes embody the pride and unity that Independence Day represents.',
      },
      {
        title: 'Cultural Performances and Entertainment:',
        paragraph:
          'Elevate your event with patriotic songs, dances, and performances that celebrate India’s journey to freedom. We connect you with a wide range of artists who can bring the stories of India’s independence struggle to life through traditional dance forms, music, and theatre, ensuring a captivating experience for all.',
      },
      {
        title: 'Custom Event Planning Services:',
        paragraph:
          'Whether you’re organizing a community event, school celebration, or corporate gathering, our event planners ensure that every aspect of your Independence Day festivities is executed with precision. From coordinating schedules to setting up décor, we take care of all the details so you can focus on celebrating this important day.',
      },
      {
        title: 'Memorable Photography and Videography:',
        paragraph:
          'Capture the spirit of your Independence Day event with our professional photography and videography services. From patriotic performances to moments of flag hoisting and national anthems, we ensure that every significant moment is preserved with care and attention.',
      },
      {
        title: 'How Vastraa Costumes & Events Makes a Difference:',
        paragraph:
          'At Vastraa, we believe that every celebration deserves a touch of uniqueness. We are committed to offering personalized services that align with your vision and help you express your patriotic spirit in the best possible way.',
      },
      {
        title: 'Join Us in Celebrating India’s Independence',
        paragraph:
          'This Independence Day, let Vastraa be your partner in creating a celebration that reflects the pride, unity, and freedom of our great nation. With our exceptional costumes, entertainment, and event services, your celebration will be an unforgettable tribute to India’s glorious history. For more information and to plan your Independence Day event with Vastraa, visit our website or contact us today.',
      },
    ],
  },
  {
    id: 3,
    image: blogimg3,
    date: '15th August, 2024',
    title:
      'Celebrate Ganesh Chaturthi with Vastraa: Dress, Decorate, and Delight in the Spirit of Lord Ganesha',
    title_paragraph:
      'As we prepare to welcome Lord Ganesha into our homes and hearts, let Vastraa elevate your Ganesh Chaturthi celebrations with costumes, event services, and décor that embody the joy, devotion, and tradition of this auspicious occasion. Whether you are hosting an intimate family puja or organizing a grand public celebration, Vastraa is here to add a divine touch to your event.',
    content: [
      {
        title: 'Why Choose Vastraa for Ganesh Chaturthi?',
        paragraph:
          'Traditional Ganesh-Themed Costumes: Celebrate the arrival of Lord Ganesha in style with our exquisite range of traditional costumes. From dhotis and kurtas for men and boys, to vibrant sarees and lehengas for women and girls, our attire is designed to reflect the festive spirit. Each piece is crafted with intricate details, showcasing motifs that symbolize wisdom, prosperity, and devotion—just like Lord Ganesha himself.',
      },
      {
        title: 'Cultural Performances and Entertainment:',
        paragraph:
          'Enhance your Ganesh Chaturthi celebration with devotional performances that honor the divine remover of obstacles. Vastraa offers access to talented artists who perform classical dance, devotional songs, and traditional music, bringing the stories of Lord Ganesha to life and captivating all attendees.',
      },
      {
        title: 'Custom Event Planning Services:',
        paragraph:
          'Leave the planning to us! From decorating your pandal to organizing your puja, our expert event planners ensure that every detail is taken care of. We work closely with you to customize your Ganesh Chaturthi celebration according to your family’s traditions and preferences, ensuring a joyful and hassle-free experience.',
      },
      {
        title: 'Elegant Décor and Themed Decorations:',
        paragraph:
          'Vastraa provides a wide selection of Ganesh Chaturthi-themed décor, including beautiful rangolis, traditional torans, floral garlands, and handcrafted idols. Whether you want to create a stunning display for your home or a grand setting for a public celebration, our décor will add elegance and festive charm to your event.',
      },
      {
        title: 'Memorable Photography and Videography:',
        paragraph:
          'Capture every special moment of your Ganesh Chaturthi celebration with our professional photography and videography services. From the preparation of the idol to the grand visarjan, our team will preserve these precious memories with high-quality visuals that you’ll cherish for years to come.',
      },
      {
        title: 'How Vastraa Costumes & Events Makes a Difference:',
        paragraph:
          'At Vastraa, we understand the spiritual and cultural significance of Ganesh Chaturthi. Our personalized service, attention to detail, and creative approach ensure that your celebration is as unique and special as the festival itself. We take pride in making your Ganesh Chaturthi not just an event, but a divine experience.',
      },
      {
        title:
          'Welcome Lord Ganesha with Vastraa’s Touch of Tradition and Elegance',
        paragraph:
          'This Ganesh Chaturthi, let Vastraa be your partner in creating a celebration filled with devotion, joy, and beauty. Explore our collection of traditional costumes, décor, and event services to ensure that your festivities are truly blessed and memorable. For more information and to plan your Ganesh Chaturthi celebration with Vastraa, visit our website or contact our team today.',
      },
    ],
  },
  {
    id: 4,
    image: blogimg4,
    date: '15th August, 2024',
    title:
      'Spooktacular Halloween with Vastraa: Unleash Your Creativity and Embrace the Thrill!',
    title_paragraph:
      "Get ready to make this Halloween an unforgettable experience with Vastraa’s incredible costumes and event services! Whether you're hosting a haunted house, planning a spooky-themed party, or simply want to stand out with a unique look, we've got you covered. This year, let Vastraa help you turn heads and create chills with our creative, high-quality costumes and event planning expertise.",
    content: [
      {
        title: 'Why Choose Vastraa for Halloween?',
        paragraph:
          'Frighteningly Fabulous Costumes: Our collection of Halloween costumes is designed to help you channel your inner ghoul, witch, or any iconic character of your choice! From eerie skeletons to glamorous witches, mythical monsters to classic horror characters, our costumes are meticulously crafted to bring your Halloween look to life. Whether you want to make people scream or laugh, we have something for everyone!',
      },
      {
        title: 'Spooky Entertainment and Thrilling Performances:',
        paragraph:
          "Elevate your Halloween party with spine-chilling performances and entertainment! Our talented performers can help you set the perfect eerie atmosphere with haunted storytelling, creepy dance routines, and even ghostly musical performances. Get ready to send shivers down your guests' spines with unforgettable acts!",
      },
      {
        title: 'Custom Event Planning for the Ultimate Haunted Experience:',
        paragraph:
          'Want to throw the spookiest Halloween bash of the year? Vastraa’s event planners are here to bring your ideas to life. From haunted house setups to creepy décor, we’ll ensure every detail is frightfully perfect. We’ll handle everything, including themed games, haunted mazes, and scare zones, making sure your event is filled with spooky fun and surprises.',
      },
      {
        title: 'Breathtaking Décor and Haunted Setups:',
        paragraph:
          'Transform your space into a haunted wonderland with our eerie décor and thematic installations. From cobwebs and fog machines to blood-red lighting and skeletons peeking out from dark corners, we’ll create the perfect spooky vibe for your Halloween night. Whether it’s a haunted house or a party venue, our décor will immerse your guests in a world of chills and thrills.',
      },
      {
        title: 'Professional Photography and Videography:',
        paragraph:
          'Capture the magic, mystery, and mayhem of your Halloween event with our professional photography and videography services. From guests in amazing costumes to the creepy ambiance of your event, we’ll make sure no moment is missed.',
      },
      {
        title: 'Why Vastraa is Your Halloween Partner:',
        paragraph:
          'At Vastraa, we go beyond the traditional. Our ability to blend creativity, attention to detail, and top-notch service ensures that your Halloween celebration is filled with imagination and unforgettable moments. We personalize every aspect to suit your vision, guaranteeing a spooky, spectacular experience.',
      },
      {
        title: 'Prepare for a Night of Chills and Thrills with Vastraa!',
        paragraph:
          'This Halloween, let Vastraa help you create a hauntingly memorable experience with the best costumes, entertainment, and event services. Whether you’re planning a casual gathering or a large-scale spooky affair, we’ve got everything you need to make it a night to remember. To start planning your Halloween adventure, visit our website or contact us today!',
      },
    ],
  },
  {
    id: 5,
    image: blogimg5,
    date: '15th August, 2024',
    title:
      'Dance Your Heart Out with Vastraa This Garba Season: Grace, Elegance, and Vibrance',
    title_paragraph:
      "It’s time to don your dandiya sticks, slip into vibrant attire, and immerse yourself in the rhythm of Garba and Dandiya Raas! At Vastraa, we bring you an exciting collection of traditional costumes and event services that capture the joyous spirit of Navratri. Whether you're attending a Garba night, hosting a community event, or participating in Dandiya Raas, Vastraa ensures you stand out in style and grace.",
    content: [
      {
        title: 'Why Choose Vastraa for Garba and Navratri?',
        paragraph:
          'Vibrant Garba and Dandiya Costumes:Celebrate the colors and vibrancy of Garba with our stunning collection of traditional Navratri outfits. From beautifully embroidered chaniya cholis for women to intricately designed kediyus and dhotis for men, our costumes are crafted to enhance your elegance as you twirl to the beats of Garba. Every detail, from mirror work to bright fabrics, reflects the vibrance and energy of the festival.',
      },
      {
        title: 'Dandiya Performances and Entertainment:',
        paragraph:
          'Elevate your Garba nights with live performances and entertainment! Vastraa provides access to skilled folk dancers, singers, and musicians who can fill your event with the infectious joy of Garba and Dandiya Raas. Whether you’re hosting a community Garba or a private Navratri party, our entertainers will keep your guests dancing all night long.',
      },
      {
        title: 'Custom Event Planning for Navratri Nights:',
        paragraph:
          'Hosting a Garba or Dandiya event requires careful planning and coordination. With Vastraa’s event planning services, we take care of everything, from managing guest lists and setting up themed décor to organizing traditional dandiya games and competitions. We ensure your Garba night is filled with excitement, energy, and elegance.',
      },
      {
        title: 'Traditional Décor and Lighting:',
        paragraph:
          'Create the perfect festive ambiance for your Navratri celebrations with Vastraa’s traditional décor and lighting solutions. From colorful drapes and floral garlands to ambient lighting that complements the Garba mood, we’ll transform your venue into a vibrant, energetic space that enhances the spirit of the dance.',
      },
      {
        title: 'Capture Every Moment with Photography and Videography:',
        paragraph:
          'Don’t miss a beat of your Garba celebration! With our professional photography and videography services, you can relive every twirl, every smile, and every joyous moment long after the festival is over. Our team ensures that the colors, movements, and emotions of your Garba night are beautifully captured.',
      },
      {
        title: 'Why Vastraa is Perfect for Your Navratri Celebrations:',
        paragraph:
          'At Vastraa, we believe in celebrating festivals with passion, creativity, and attention to detail. Our personalized services, vibrant costumes, and expert event planning ensure that your Navratri celebrations are not only memorable but also full of joy and energy.',
      },
      {
        title:
          'Dance into the Night with Vastraa’s Touch of Tradition and Festivity',
        paragraph:
          'This Navratri, let Vastraa help you make your Garba nights truly special. From the finest traditional costumes to meticulously planned events, we’re here to ensure that your celebrations are filled with color, grace, and endless dancing. To start planning your Garba or Navratri event, visit our website or contact our team today!',
      },
    ],
  },
];

function Blogs() {
  const [mainBlog, setMainBlog] = useState(sideBlogs[0]);
  const [sideBlogsData, setSideBlogsData] = useState(sideBlogs.slice(1));

  const handleClick = (clickedBlog: Blog) => {
    const newMainBlog = clickedBlog;
    const newSideBlogs = sideBlogsData.map((blog) =>
      blog.id === clickedBlog.id ? mainBlog : blog,
    );

    setMainBlog(newMainBlog);
    setSideBlogsData(newSideBlogs);
  };

  return (
    <section id="blogs" className="my-24 min-h-[calc(100vh-100px)]">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold md:text-4xl md:font-semibold">
          Blogs
        </h1>
        <Link to="/">
          <i className="cursor-pointer">
            <ArrowLeft />
          </i>
        </Link>
      </div>
      <div className="mt-5 grid-cols-12 gap-2 space-y-10 lg:grid lg:space-y-0">
        <div className="col-span-7 flex flex-col space-y-7">
          <div className="space-y-3">
            <img src={mainBlog.image} alt="mainblogimg" />
            <p className="text-sm font-normal text-secondary1">
              {mainBlog.date}
            </p>
          </div>
          <div className="space-y-3">
            <h1 className="text-xl font-bold md:text-2xl md:font-semibold">
              {mainBlog.title}
            </h1>
            <p className="text-base font-normal leading-[140%]">
              {mainBlog.title_paragraph}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-8">
              {mainBlog.content.map((content) => (
                <div className="space-y-3">
                  <h3 className="text-xl font-bold md:text-xl md:font-semibold">
                    {content.title}
                  </h3>
                  <p className="text-base font-normal leading-[140%]">
                    {content.paragraph}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-1 md:flex md:justify-center">
          <hr className="bg-gray-300 md:my-auto md:h-full md:w-[1px]" />
        </div>

        <SideBlogs sideBlogsData={sideBlogsData} handleClick={handleClick} />
      </div>
    </section>
  );
}

export default Blogs;

interface SideBlogsProps {
  sideBlogsData: Blog[];
  handleClick: (blog: Blog) => void;
}

function SideBlogs({ sideBlogsData, handleClick }: SideBlogsProps) {
  return (
    <ScrollArea className="col-span-4 m-0 h-auto space-y-10 rounded-lg md:space-y-20">
      <div className="p-4">
        {sideBlogsData.map((blog) => (
          <div className="flex flex-col justify-center space-y-3" key={blog.id}>
            <img
              src={blog.image}
              alt="blogimg1"
              onClick={() => handleClick(blog)}
            />
            <p className="text-sm font-normal text-secondary1">{blog.date}</p>
            <p className="text-sm font-normal text-secondary1">{blog.title}</p>
          </div>
        ))}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}
