'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const categorizedFaqs = {
  Dance: [
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
  ],
  Music: [
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
  ],
  Academy: [
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
  ],
};

export default function FaqPage() {
  return (
    <section
      className="flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center px-6 py-10 text-secondary1"
      aria-labelledby="faq-heading"
    >
      <h1 id="faq-heading" className="mb-2 text-center text-5xl font-bold">
        Frequently asked questions
      </h1>
      <p className="mb-8 text-center text-base text-gray-400">
        Ask everything you need to know about our services
      </p>

      <Tabs defaultValue="Dance" className="w-full">
        <div className="flex flex-col gap-4 md:flex-row md:gap-8">
          <TabsList className="h-auto flex-wrap justify-start rounded-md bg-transparent p-0 md:flex md:w-48 md:flex-col">
            {Object.keys(categorizedFaqs).map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="w-auto rounded-md px-3 py-2 text-left text-sm data-[state=active]:bg-secondary data-[state=active]:text-white data-[state=inactive]:text-gray-400 md:w-full"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1">
            {Object.entries(categorizedFaqs).map(([category, faqs]) => (
              <TabsContent
                key={category}
                value={category}
                className="mt-0 border-0"
              >
                <h2
                  id={`${category.toLowerCase()}-faq-section`}
                  className="mb-4 text-xl font-semibold"
                >
                  {category} Questions
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${category}-item-${index}`}
                      className="border-b border-gray-800"
                    >
                      <AccordionTrigger className="py-3 text-left text-base font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-3 pt-1 text-sm">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </div>
        </div>
      </Tabs>
    </section>
  );
}
