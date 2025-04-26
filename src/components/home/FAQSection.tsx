import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "What is GitaSpeaks?",
    answer: "GitaSpeaks is an AI-powered spiritual companion that provides personalized guidance based on the timeless wisdom of the Bhagavad Gita. It combines advanced AI technology with ancient spiritual knowledge to help you find clarity, purpose, and answers to life's deepest questions."
  },
  {
    question: "How does GitaSpeaks work?",
    answer: "GitaSpeaks uses advanced AI to understand your questions and concerns, then provides relevant guidance by drawing from the Bhagavad Gita's teachings. Each response is carefully crafted to include specific references to chapters and verses, making the wisdom both practical and authentic. You can ask questions about personal growth, dharma (duty), relationships, work-life balance, and spiritual development."
  },
  {
    question: "Is GitaSpeaks a substitute for professional advice?",
    answer: "No, GitaSpeaks is designed for spiritual guidance and self-reflection, not as a replacement for professional services. While it offers valuable insights from the Bhagavad Gita, please consult qualified professionals for medical, mental health, legal, or financial advice. GitaSpeaks works best as a complementary tool for spiritual growth alongside other forms of support."
  },
  {
    question: "Do I need to know about the Bhagavad Gita to use GitaSpeaks?",
    answer: "Not at all! GitaSpeaks is designed for everyone, from beginners to advanced practitioners. Our AI explains complex spiritual concepts in simple, accessible language. Whether you're new to spirituality or well-versed in Vedic knowledge, GitaSpeaks adapts its responses to your level of understanding while maintaining the authenticity of the teachings."
  },
  {
    question: "Can I access the original Bhagavad Gita text?",
    answer: "Yes! GitaSpeaks provides access to the complete Bhagavad Gita text in multiple formats. You can read the original Sanskrit verses with English translations, explore detailed commentaries, and access chapter summaries. We also provide a downloadable PDF version for offline study."
  },
  {
    question: "How accurate are the AI responses?",
    answer: "GitaSpeaks' responses are based on careful analysis of the Bhagavad Gita's teachings and verified by spiritual experts. While AI generates the responses, the underlying knowledge comes directly from authentic scriptural sources. We regularly update and refine our AI model to ensure accuracy and adherence to traditional interpretations."
  },
  {
    question: "Can I use GitaSpeaks for meditation and spiritual practices?",
    answer: "Absolutely! GitaSpeaks can guide you through various spiritual practices mentioned in the Gita, including meditation techniques, mantra recitation, and devotional practices. It can provide personalized suggestions based on your spiritual inclination and experience level, helping you develop a consistent spiritual practice."
  },
  {
    question: "Is my conversation with GitaSpeaks private?",
    answer: "Yes, your privacy is important to us. All conversations with GitaSpeaks are private and confidential. While we may use anonymous data to improve our service, personal information is never shared with third parties. You can engage in open, honest spiritual discussions without concerns about privacy."
  },
  {
    question: "How can I get the most out of GitaSpeaks?",
    answer: "To maximize your experience with GitaSpeaks: 1) Ask specific questions rather than general ones, 2) Reflect on the responses and try to apply them in your daily life, 3) Use the verse references to dive deeper into the original text, 4) Maintain a regular practice of consulting the wisdom, and 5) Share your experiences with our community to enhance collective learning."
  },
  {
    question: "What if I disagree with a response?",
    answer: "The Bhagavad Gita encourages questioning and personal reflection. If you disagree with a response, you can ask for clarification, request alternative perspectives, or explore the original verses yourself. Remember that spiritual understanding is a personal journey, and GitaSpeaks is here to guide, not dictate."
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
                <span className="text-lg font-serif dark:text-gray-700 text-gray-700">{faq.question}</span>
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
                <p className="dark:text-gray-600">{faq.answer}</p>
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