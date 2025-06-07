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
    question: "Apa itu BSS Parking dan bagaimana cara kerjanya?",
    answer:
      "BSS Parking adalah sistem parkir cerdas yang membantu pengguna menemukan dan memesan tempat parkir secara real-time. Dengan bantuan sensor dan aplikasi mobile/web, pengguna dapat melihat ketersediaan parkir, memesan tempat, dan melakukan pembayaran secara digital.",
    icon: "🅿️",
  },
  {
    question: "Apakah saya bisa melihat ketersediaan parkir sebelum sampai lokasi?",
    answer:
      "Ya, BSS Parking menyediakan informasi ketersediaan parkir secara real-time sehingga Anda dapat mengetahui apakah tempat parkir tersedia sebelum tiba di lokasi.",
    icon: "📍",
  },
  {
    question: "Bagaimana sistem pembayarannya?",
    answer:
      "Pembayaran dapat dilakukan secara digital melalui aplikasi BSS Parking menggunakan e-wallet, kartu kredit, atau metode pembayaran lainnya yang tersedia.",
    icon: "💳",
  },
  {
    question: "Apakah sistem ini hanya tersedia di kota tertentu?",
    answer:
      "Untuk saat ini, BSS Parking tersedia di beberapa kota besar dan terus diperluas ke wilayah lain. Anda dapat melihat daftar lokasi yang tersedia di dalam aplikasi.",
    icon: "🌐",
  },
  {
    question: "Apakah aman meninggalkan kendaraan di area parkir BSS?",
    answer:
      "Kami bekerja sama dengan penyedia parkir yang terpercaya dan dilengkapi dengan sistem keamanan seperti CCTV dan petugas keamanan. Namun, selalu disarankan untuk mengunci kendaraan dengan benar.",
    icon: "🔒",
  },
  {
    question: "Bisakah saya membatalkan reservasi parkir?",
    answer:
      "Ya, Anda bisa membatalkan reservasi parkir sebelum waktu parkir dimulai melalui aplikasi. Syarat dan ketentuan pembatalan berlaku.",
    icon: "❌",
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
            Find answers to common questions about BSS Parking and how it can help
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
            <Link href="mailto:anthonyef09@gmail.com">
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
