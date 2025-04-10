import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "What is GitaSpeaks?",
    answer: "GitaSpeaks is an AI-powered spiritual guide that provides wisdom and guidance based on the teachings of the Bhagavad Gita. It helps you navigate life's challenges with insights from this ancient sacred text."
  },
  {
    question: "How does GitaSpeaks work?",
    answer: "Simply type your question or concern, and our AI, trained on the Bhagavad Gita, will respond with relevant wisdom and guidance. The responses include references to specific chapters and verses from the Gita."
  },
  {
    question: "Is GitaSpeaks a substitute for professional advice?",
    answer: "No, GitaSpeaks is not a substitute for professional mental health, medical, legal, or financial advice. While the wisdom of the Bhagavad Gita can provide spiritual guidance, please consult appropriate professionals for specific advice in these areas."
  },
  {
    question: "Do I need to know about the Bhagavad Gita to use GitaSpeaks?",
    answer: "Not at all! GitaSpeaks is designed for everyone, whether you're familiar with the Bhagavad Gita or completely new to its teachings. Our AI explains concepts clearly and in accessible language."
  },
  {
    question: "Can I read the original Bhagavad Gita text?",
    answer: "Yes! GitaSpeaks provides access to the complete Bhagavad Gita text. You can explore the PDF version to read the original verses and deepen your understanding of the teachings."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-10 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-serif text-gray-700 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about GitaSpeaks and the wisdom of the Bhagavad Gita
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="mb-4 border border-amber-200 rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <button
                className="w-full text-left p-4 flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-serif text-gray-700">{faq.question}</span>
                {openIndex === index ? (
                  <FiChevronUp className="text-[#973B00]" />
                ) : (
                  <FiChevronDown className="text-[#973B00]" />
                )}
              </button>
              <div 
                className={`px-4 transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? 'max-h-96 pb-4' : 'max-h-0'
                }`}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-2 mt-12">
          <div className="h-[1px] w-12 bg-gray-300"></div>
          <div className="text-2xl">✧</div>
          <div className="h-[1px] w-12 bg-gray-300"></div>
        </div>
      </div>
    </section>
  );
} 