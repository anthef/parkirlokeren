"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  RiQuestionAnswerLine,
  RiSearchLine,
  RiArrowRightLine,
} from "react-icons/ri";
import Link from "next/link";

const faqs = [
  {
    question: "How does GapMap AI find business opportunities?",
    answer:
      "GapMap AI uses advanced algorithms and real-time market data from Sonar API to analyze market trends, consumer needs, and competition. It then matches these opportunities with your personal profile, skills, and preferences to find the perfect business match.",
    icon: "📊",
  },
  {
    question: "How accurate are the business opportunities provided?",
    answer:
      "Our AI analyzes thousands of data points from reliable sources with clear citations. While we can't guarantee success (no business is risk-free), our recommendations are based on comprehensive market research and real-world data.",
    icon: "🎯",
  },
  {
    question: "Can I use GapMap AI for my existing business?",
    answer:
      "GapMap AI can analyze your existing business and identify growth opportunities, new market segments, product extensions, or operational improvements to help your business thrive.",
    icon: "🚀",
  },
  {
    question: "How much does it cost to start the businesses recommended?",
    answer:
      "The initial investment varies widely depending on the business type. We provide detailed financial projections including startup costs, operational expenses, and potential revenue for each opportunity so you can choose one that fits your budget.",
    icon: "💰",
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer:
      "Yes, we offer a 14-day money-back guarantee if you're not satisfied with our service. Simply contact our support team within 14 days of your purchase for a full refund.",
    icon: "🔄",
  },
  {
    question: "How often is the market data updated?",
    answer:
      "Our Sonar API integration provides real-time market data that is continuously updated. This ensures that the business opportunities we recommend are based on the latest market trends and consumer needs.",
    icon: "⏱️",
  },
];

export function FaqSection() {
  return (
    <section className="py-24 relative bg-gradient-to-b from-muted/50 to-background">
      <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,white,transparent)] dark:bg-grid-slate-700/25"></div>

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-3" variant="outline">
            SUPPORT
          </Badge>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about GapMap AI and how it can help
            you discover your perfect business opportunity.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto bg-card rounded-xl border shadow-sm overflow-hidden px-8 py-4">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border-b last:border-0 px-1"
                >
                  <AccordionTrigger className="text-left py-5 hover:no-underline group duration-300">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary shrink-0">
                        <span className="text-lg">{faq.icon}</span>
                      </div>
                      <span className="text-lg font-medium group-hover:text-primary transition-colors duration-300">
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pl-11">
                    <div className="pb-1">{faq.answer}</div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-muted rounded-xl p-8 max-w-3xl mx-auto">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <RiQuestionAnswerLine className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">
              Our dedicated support team is here to help you with any other
              questions you might have.
            </p>
            <Link href="mailto:m.azzam.azis@gmail.com">
              <Button className="px-6">
                Contact Support
                <RiArrowRightLine className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
