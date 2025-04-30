import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Faqs = [
  // Dance FAQs
  {
    question: 'What styles of classical dance do you teach?',
    answer:
      'We offer Bharatanatyam and Kathak classes, rooted in traditional training and modern understanding.',
  },
  {
    question: 'At what age can children start learning classical dance?',
    answer:
      'Children can begin as early as age 5, depending on their interest and motor coordination.',
  },
  {
    question: 'Do you provide certification or exams?',
    answer:
      'Yes, we prepare students for certifications under recognized boards and institutions.',
  },
  {
    question: 'How often are classes held?',
    answer:
      'Typically, classes are held weekly, with flexible options for beginners, intermediate, and advanced students.',
  },
  {
    question: 'What attire is required for dance classes?',
    answer:
      'Students are expected to wear traditional practice sarees/salwar or dance costumes depending on the style.',
  },
  {
    question: 'Can adults or beginners join your dance classes?',
    answer:
      "Absolutely! We offer beginner batches for all age groups — it's never too late to dance.",
  },
  // Music FAQs
  {
    question: 'What kind of music training do you offer?',
    answer:
      'We specialize in Carnatic vocal music and also offer keyboard-based training for interested learners.',
  },
  {
    question: 'Is it necessary to know music basics before joining?',
    answer:
      'Not at all. We welcome students at all levels, including complete beginners.',
  },
  {
    question: 'Do you conduct vocal exams or public performances?',
    answer:
      'Yes, students are encouraged to appear for music exams and participate in concerts and internal showcases.',
  },
  {
    question: 'Can I learn both music and dance at the academy?',
    answer:
      'Yes, many of our students pursue both. Timings are arranged accordingly.',
  },
  // Academy & General FAQs
  {
    question: 'Where is Gaana Nritya Academy located?',
    answer:
      'We are based in Karnataka, with multiple branches and outreach centers. Contact us for your nearest location.',
  },
  {
    question: 'Do you offer online classes?',
    answer:
      'Yes! We have online batches for both dance and music for national and international students.',
  },
  {
    question: 'Are there opportunities for stage performances?',
    answer:
      'Yes, we regularly organize festivals, events, and arangetrams where students can showcase their skills.',
  },
  {
    question: 'Who are the instructors or gurus?',
    answer:
      'Our classes are led by trained professionals under the guidance of Guru Vidyashree Radhakrishna, a Doordarshan-graded and ICCR-empaneled artiste.',
  },
  {
    question: 'Is prior experience necessary to join?',
    answer:
      'No. We welcome passionate learners of all skill levels and age groups.',
  },
  {
    question: 'How can I enroll or get more information?',
    answer:
      "Simply visit our Contact Us page or give us a call. We'll be happy to guide you through the process.",
  },
];

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-[32px] font-bold">Contact Us</h1>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Contact Form */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-6 text-2xl font-semibold">Get in Touch</h2>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#1d6d8d]"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#1d6d8d]"
                placeholder="Your Email"
              />
            </div>
            <div>
              <label
                htmlFor="subject"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#1d6d8d]"
                placeholder="Subject"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[#1d6d8d]"
                placeholder="Your Message"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-secondary px-4 py-2 text-white transition duration-300 hover:bg-secondary/80"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div>
          <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-6 text-2xl font-semibold">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-3 mt-1 text-secondary1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Address</h3>
                  <p className="text-gray-600">Karnataka, India</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-3 mt-1 text-secondary1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Phone</h3>
                  <p className="text-gray-600">+91 XXXXX XXXXX</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-3 mt-1 text-secondary1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Email</h3>
                  <p className="text-gray-600">info@gaananritya.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="mt-16">
        <h2 className="mb-10 text-center text-2xl font-bold">
          Frequently Asked Questions
        </h2>

        {/* Dance FAQs */}
        <div className="mb-12">
          <h3 className="mb-6 text-center text-2xl font-semibold">
            Dance FAQs
          </h3>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="space-y-4">
              {Faqs.slice(0, 6).map((faq, index) => (
                <AccordionItem
                  key={`dance-${index}`}
                  value={`dance-${index}`}
                  className="rounded-lg bg-white shadow-md"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Music FAQs */}
        <div className="mb-12">
          <h3 className="mb-6 text-center text-2xl font-semibold">
            Music FAQs
          </h3>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="space-y-4">
              {Faqs.slice(6, 10).map((faq, index) => (
                <AccordionItem
                  key={`music-${index}`}
                  value={`music-${index}`}
                  className="rounded-lg bg-white shadow-md"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-center text-2xl font-semibold">
            Academy & General FAQs
          </h3>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="space-y-4">
              {Faqs.slice(10).map((faq, index) => (
                <AccordionItem
                  key={`general-${index}`}
                  value={`general-${index}`}
                  className="rounded-lg bg-white shadow-md"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-2 text-secondary1">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
