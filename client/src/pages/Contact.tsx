import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useState } from 'react';
import axiosInstance from '@/helper/axiosInstance';
import { toast } from 'sonner';

import contactImg from '@/assets/contact.png';

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

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Reset submit status when user starts typing again
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Using axiosInstance to make the API call with correct endpoint
      await axiosInstance.post('/api/v1/contact', formData);

      setSubmitStatus({
        success: true,
        message:
          'Your message has been sent successfully! We will get back to you soon.',
      });

      // Clear form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus({
        success: false,
        message:
          'Failed to send your message. Please try again later or contact us directly.',
      });

      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <div className="md:flex">
        <div className="mr-20">
          <img
            src={contactImg}
            alt="contact"
            className="max-h-[800px] w-[750px] object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="md:my-auto">
            {/* Contact Form */}
            <div className="mb-8 max-w-md rounded-lg bg-white p-6 shadow-md">
              <h2 className="mb-6 text-center text-2xl font-semibold">
                Get in Touch
              </h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
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
                    name="name"
                    className={`w-full rounded-md border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } p-2 focus:outline-none focus:ring-2 focus:ring-[#1d6d8d]`}
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
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
                    name="email"
                    className={`w-full rounded-md border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } p-2 focus:outline-none focus:ring-2 focus:ring-[#1d6d8d]`}
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
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
                    name="subject"
                    className={`w-full rounded-md border ${
                      errors.subject ? 'border-red-500' : 'border-gray-300'
                    } p-2 focus:outline-none focus:ring-2 focus:ring-[#1d6d8d]`}
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.subject}
                    </p>
                  )}
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
                    name="message"
                    rows={5}
                    className={`w-full rounded-md border ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    } p-2 focus:outline-none focus:ring-2 focus:ring-[#1d6d8d]`}
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleInputChange}
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.message}
                    </p>
                  )}
                </div>
                {submitStatus && (
                  <div
                    className={`rounded-md ${
                      submitStatus.success ? 'bg-green-50' : 'bg-red-50'
                    } p-3`}
                  >
                    <p
                      className={`text-sm ${
                        submitStatus.success ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {submitStatus.message}
                    </p>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full rounded-md bg-secondary px-4 py-2 text-white transition duration-300 hover:bg-secondary/80 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="mr-2 h-4 w-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>{' '}
          </div>
        </div>
      </div>
      {/* FAQs Section */}
      <div className="my-20 px-4 md:px-10 lg:px-20">
        <h2 className="mb-10 text-center text-2xl font-bold">
          Frequently Asked Questions
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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

export default Contact;
