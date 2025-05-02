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

const Faq = () => {
  return (
    <div>
      <div className="mb-20 mt-16 px-4 md:mt-24 md:px-10 lg:mt-32 lg:px-20">
        <h2 className="mb-10 text-center text-2xl font-bold">
          Frequently Asked Questions
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {/* Dance FAQs */}
          <div className="mb-12 md:mb-0">
            <h3 className="mb-6 text-center text-xl font-semibold">
              Dance FAQs
            </h3>
            <div>
              <Accordion type="single" collapsible className="space-y-4">
                {Faqs.slice(0, 6).map((faq, index) => (
                  <AccordionItem
                    key={`dance-${index}`}
                    value={`dance-${index}`}
                    className="rounded-lg bg-white shadow-md"
                  >
                    <AccordionTrigger className="px-4 py-3 text-left text-sm font-medium hover:no-underline md:px-6 md:py-4 md:text-base">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3 pt-2 text-sm text-gray-600 md:px-6 md:pb-4 md:text-base">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Music FAQs */}
          <div className="mb-12 md:mb-0">
            <h3 className="mb-6 text-center text-xl font-semibold">
              Music FAQs
            </h3>
            <div>
              <Accordion type="single" collapsible className="space-y-4">
                {Faqs.slice(6, 10).map((faq, index) => (
                  <AccordionItem
                    key={`music-${index}`}
                    value={`music-${index}`}
                    className="rounded-lg bg-white shadow-md"
                  >
                    <AccordionTrigger className="px-4 py-3 text-left text-sm font-medium hover:no-underline md:px-6 md:py-4 md:text-base">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3 pt-2 text-sm text-gray-600 md:px-6 md:pb-4 md:text-base">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Academy & General FAQs */}
          <div>
            <h3 className="mb-6 text-center text-xl font-semibold">
              Academy & General FAQs
            </h3>
            <div>
              <Accordion type="single" collapsible className="space-y-4">
                {Faqs.slice(10).map((faq, index) => (
                  <AccordionItem
                    key={`general-${index}`}
                    value={`general-${index}`}
                    className="rounded-lg bg-white shadow-md"
                  >
                    <AccordionTrigger className="px-4 py-3 text-left text-sm font-medium hover:no-underline md:px-6 md:py-4 md:text-base">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3 pt-2 text-sm text-gray-600 md:px-6 md:pb-4 md:text-base">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
