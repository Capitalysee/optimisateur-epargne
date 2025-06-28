import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {items.map((item, idx) => (
        <div key={idx} className="mb-3">
          <button
            className="w-full text-left bg-[#F5F6FA] rounded-xl px-4 py-3 font-semibold text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B7C9A8] transition-all"
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            {item.question}
          </button>
          {openIndex === idx && (
            <div className="bg-white rounded-b-xl px-4 py-3 text-gray-600 border-t border-[#B7C9A8]">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ; 