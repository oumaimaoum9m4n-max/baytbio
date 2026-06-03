"use client";

import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface StoryAccordionProps {
  items: FaqItem[];
}

export default function StoryAccordion({ items }: StoryAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-12 border-t border-linen pt-12">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.question} className="border-b border-linen py-5">
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between border-none bg-transparent p-0 font-sans text-[0.82rem] font-normal uppercase tracking-[0.1em] text-brown transition-colors hover:text-terracotta"
            >
              <span>{item.question}</span>
              <span
                className={`text-base transition-transform duration-300 ${open ? "rotate-45" : ""}`}
              >
                +
              </span>
            </button>
            <div
              className={`overflow-hidden transition-[max-height,padding] duration-500 [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)] ${
                open ? "max-h-[300px] pt-4" : "max-h-0"
              }`}
            >
              <p className="font-sans text-[0.86rem] font-light leading-[1.85] text-sand">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
