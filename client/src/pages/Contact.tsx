import { useState, useEffect } from 'react';
import axiosInstance from '@/helper/axiosInstance';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

import contactImg from '@/assets/contact.png';

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

  useEffect(() => {
    if (submitStatus?.success) {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

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

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

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
      await axiosInstance.post('/api/v1/contact', formData);

      setSubmitStatus({
        success: true,
        message:
          'Your message has been sent successfully! We will get back to you soon.',
      });

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
    <div className="relative min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
      {/* Heading Section */}
      {/* <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="container mx-auto px-4 pb-8 pt-16 text-center md:pb-12 md:pt-20"
      >
        <h1 className="mb-3 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
          Get in <span className="text-secondary1">Touch</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          We'd love to hear from you! Send us a message and we'll respond as
          soon as possible.
        </p>
      </motion.div> */}

      <div className="lg:flex">
        {/* Image Section - Full-bleed on left side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="w-full lg:sticky lg:top-0 lg:w-6/12"
        >
          <div className="h-[300px] overflow-hidden md:h-[800px] lg:h-full">
            <img
              src={contactImg}
              alt="Contact Us"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="w-full px-4 py-10 lg:w-1/2 lg:py-16"
        >
          <div className="mx-auto max-w-lg">
            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-xl backdrop-blur-sm md:p-10">
              <h2 className="mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                <h1 className="text-center text-3xl font-bold text-secondary1">
                  Get in Touch
                </h1>
                <h2 className="mt-2 text-balance text-center text-sm">
                  We'd love to hear from you! Send us a message and we'll
                  respond as soon as possible.
                </h2>
              </h2>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="group">
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        className={
                          errors.name
                            ? 'border-red-500 ring-1 ring-red-500'
                            : ''
                        }
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 flex items-center text-sm text-red-500"
                        >
                          <svg
                            className="mr-1 h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          {errors.name}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div className="group">
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        className={
                          errors.email
                            ? 'border-red-500 ring-1 ring-red-500'
                            : ''
                        }
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 flex items-center text-sm text-red-500"
                        >
                          <svg
                            className="mr-1 h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          {errors.email}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      id="subject"
                      name="subject"
                      className={
                        errors.subject
                          ? 'border-red-500 ring-1 ring-red-500'
                          : ''
                      }
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                    />
                    {errors.subject && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 flex items-center text-sm text-red-500"
                      >
                        <svg
                          className="mr-1 h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        {errors.subject}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="group">
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      className={
                        errors.message
                          ? 'border-red-500 ring-1 ring-red-500'
                          : ''
                      }
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleInputChange}
                    />
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 flex items-center text-sm text-red-500"
                      >
                        <svg
                          className="mr-1 h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        {errors.message}
                      </motion.p>
                    )}
                  </div>
                </div>

                {submitStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-lg ${
                      submitStatus.success ? 'bg-green-50' : 'bg-red-50'
                    } border-2 p-4 ${
                      submitStatus.success
                        ? 'border-green-200'
                        : 'border-red-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {submitStatus.success ? (
                          <svg
                            className="h-6 w-6 text-green-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-6 w-6 text-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <p
                          className={`text-sm font-medium ${
                            submitStatus.success
                              ? 'text-green-800'
                              : 'text-red-800'
                          }`}
                        >
                          {submitStatus.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <Button
                  variant="secondary"
                  size="lg"
                  type="submit"
                  className="w-full font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="mr-2 h-5 w-5 animate-spin text-white"
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
                      Sending Message...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </Button>

                <p className="text-center text-sm text-gray-500">
                  By submitting this form, you agree to our{' '}
                  <a href="#" className="text-secondary hover:underline">
                    privacy policy
                  </a>
                  .
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
