"use client";

import { useEffect, useState, useRef } from "react";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ShineButton } from "@/components/ui/shine-button";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RiCheckboxCircleLine,
  RiArrowRightLine,
  RiCameraLine,
  RiEyeLine,
  RiShieldCheckLine,
  RiCarLine,
  RiParkingBoxLine,
  RiTimeLine,
  RiRadarLine,
  RiDashboardLine,
  RiAlertLine,
  RiStarFill,
  RiRocketLine,
  RiLineChartLine,
  RiBarChartBoxLine,
  RiSecurePaymentLine,
  RiCloudLine,
  RiSettings4Line
} from "react-icons/ri";
import { FaqSection } from "@/components/faq-section";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

// Updated testimonials for parking system
const parkingTestimonials = [
  {
    quote: "BSS Parking mengubah cara kami mengelola area parkir. Sistem ALPR-nya sangat akurat dan menghemat waktu operasional hingga 70%.",
    name: "Ahmad Sutanto",
    role: "Manajer Operasional, Plaza Indonesia"
  },
  {
    quote: "Monitoring real-time dan deteksi otomatis membuat pengelolaan parkir jauh lebih efisien. ROI tercapai dalam 6 bulan!",
    name: "Sari Dewi",
    role: "Direktur Operasional, Grand Indonesia"
  },
  {
    quote: "Interface yang user-friendly dan data analytics yang komprehensif membantu kami mengoptimalkan kapasitas parkir secara maksimal.",
    name: "Budi Prasetyo",
    role: "IT Manager, Senayan City"
  },
  {
    quote: "Sistem keamanan dan validasi plat nomor yang canggih memberikan rasa aman bagi pengunjung dan pengelola.",
    name: "Linda Kartini",
    role: "General Manager, Pacific Place"
  }
];

export default function Home() {
  const { user, isLoading } = useAuth();
  const isLoggedIn = !!user;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 md:py-32">
          <BackgroundGradient
            animate={true}
            className="opacity-20"
            containerClassName="absolute inset-0"
          />
          <div className="container relative z-10 mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium">
                🚗 Solusi Parkir Cerdas dengan ALPR Technology
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Kelola Parkir dengan{" "}
              <AnimatedGradientText>Teknologi ALPR Terdepan</AnimatedGradientText>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl"
            >
              BSS Parking menghadirkan sistem manajemen parkir otomatis dengan teknologi ALPR (Automatic License Plate Recognition) yang canggih. Monitor real-time, deteksi akurat, dan pengelolaan data terintegrasi untuk efisiensi maksimal.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              {isLoading ? (
                <Button size="lg" className="h-12 px-8" disabled>
                  Loading...
                </Button>
              ) : (
                <Link href={isLoggedIn ? "/dashboard" : "/signup"}>
                  <ShineButton size="lg" className="h-12 px-8">
                    {isLoggedIn ? "Go to Dashboard" : "Mulai Sekarang"}
                    <RiArrowRightLine className="ml-2 h-4 w-4" />
                  </ShineButton>
                </Link>
              )}
              <Link href="/dashboard/monitoring">
                <Button variant="outline" size="lg" className="h-12 px-8">
                  <RiEyeLine className="mr-2 h-4 w-4" />
                  Live Demo
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-3" variant="outline">
                HOW IT WORKS
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Cara Kerja BSS Parking
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Sistem ALPR otomatis yang menggunakan AI untuk mendeteksi, memvalidasi, dan mengelola data kendaraan secara real-time.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <RiCameraLine className="h-8 w-8" />,
                  title: "Deteksi Otomatis",
                  description:
                    "Kamera ALPR mendeteksi plat nomor kendaraan secara otomatis dengan akurasi tinggi saat masuk dan keluar area parkir.",
                  color: "from-blue-500 to-cyan-400",
                },
                {
                  icon: <RiRadarLine className="h-8 w-8" />,
                  title: "Validasi Real-time",
                  description:
                    "Sistem AI memvalidasi dan memverifikasi data plat nomor dengan confidence score untuk memastikan akurasi deteksi.",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  icon: <RiDashboardLine className="h-8 w-8" />,
                  title: "Monitoring Live",
                  description:
                    "Dashboard real-time menampilkan status kamera, deteksi terbaru, dan statistik parkir secara langsung.",
                  color: "from-amber-500 to-orange-500",
                },
                {
                  icon: <RiTimeLine className="h-8 w-8" />,
                  title: "Log & History",
                  description:
                    "Pencatatan otomatis semua aktivitas parkir dengan timestamp, durasi, dan status untuk analisis mendalam.",
                  color: "from-emerald-500 to-green-500",
                },
                {
                  icon: <RiAlertLine className="h-8 w-8" />,
                  title: "Alert System",
                  description:
                    "Notifikasi otomatis untuk pelanggaran, kamera offline, atau aktivitas mencurigakan di area parkir.",
                  color: "from-red-500 to-rose-500",
                },
                {
                  icon: <RiBarChartBoxLine className="h-8 w-8" />,
                  title: "Analytics & Reports",
                  description:
                    "Laporan komprehensif occupancy rate, peak hours, revenue tracking, dan insights untuk optimasi operasional.",
                  color: "from-indigo-500 to-violet-500",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="h-full"
                >
                  <Card className="pb-4 bg-background h-full border-2 hover:shadow-xl transition-all duration-100 hover:-translate-y-2 group overflow-hidden">
                    <div
                      className={`absolute h-1.5 inset-x-0 top-0 bg-gradient-to-r ${feature.color}`}
                    ></div>
                    <CardHeader className="pb-2">
                      <div className="mb-5 relative">
                        <div
                          className={`h-16 w-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feature.color} text-white`}
                        >
                          {feature.icon}
                        </div>
                      </div>
                      <CardTitle className="text-xl">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="mt-2 text-sm">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 relative">
          <div className="absolute inset-0 bg-primary/5 transform skew-y-3"></div>
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-3" variant="outline">
                TESTIMONIALS
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Dipercaya Berbagai Instansi
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Pengalaman nyata dari pengelola parkir yang telah merasakan manfaat BSS Parking System
              </p>
            </motion.div>

            <div className="relative px-8 md:px-12">
              <InfiniteMovingCards
                items={parkingTestimonials}
                direction="right"
                speed="slow"
              />
            </div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden">
          <BackgroundGradient
            animate={false}
            className="opacity-5"
            containerClassName="absolute inset-0"
          />
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="mb-3" variant="outline">
                PAKET BERLANGGANAN
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Pilih Paket Sesuai Kebutuhan
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Solusi fleksibel untuk berbagai skala operasional parkir. Dari mall kecil hingga kompleks besar.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
              {[
                {
                  title: "Basic",
                  subtitle: "Untuk area parkir kecil",
                  price: "Rp 2.5jt",
                  period: "bulan",
                  popular: false,
                  description:
                    "Cocok untuk mall kecil, ruko, atau area parkir dengan 1-2 kamera.",
                  features: [
                    "2 kamera ALPR",
                    "Dashboard monitoring dasar",
                    "Laporan bulanan",
                    "Email support",
                    "Storage 30 hari",
                    "Basic analytics",
                  ],
                  icon: <RiParkingBoxLine className="h-6 w-6" />,
                  ctaText: isLoggedIn ? "Upgrade ke Basic" : "Mulai Basic",
                },
                {
                  title: "Professional",
                  subtitle: "Untuk mall & office building",
                  price: "Rp 7.5jt",
                  period: "bulan",
                  popular: true,
                  description:
                    "Ideal untuk mall menengah, office building, atau kompleks dengan traffic tinggi.",
                  features: [
                    "5 kamera ALPR",
                    "Real-time monitoring",
                    "Advanced analytics & reports",
                    "Violation detection",
                    "Priority support 24/7",
                    "Storage 90 hari",
                    "API integration",
                    "Custom alerts",
                  ],
                  icon: <RiLineChartLine className="h-6 w-6" />,
                  ctaText: isLoggedIn ? "Upgrade ke Pro" : "Pilih Professional",
                  highlight: "Paling Populer",
                },
                {
                  title: "Enterprise",
                  subtitle: "Untuk kompleks besar",
                  price: "Rp 15jt",
                  period: "bulan",
                  popular: false,
                  description:
                    "Solusi lengkap untuk airport, mall besar, atau kompleks dengan kebutuhan kustomisasi.",
                  features: [
                    "Unlimited kamera ALPR",
                    "AI-powered analytics",
                    "Custom dashboard",
                    "Multi-location support",
                    "Dedicated support team",
                    "Storage unlimited",
                    "Full API access",
                    "White-label solution",
                    "On-premise deployment",
                  ],
                  icon: <RiBarChartBoxLine className="h-6 w-6" />,
                  ctaText: isLoggedIn ? "Upgrade ke Enterprise" : "Hubungi Sales",
                },
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    type: plan.popular ? "spring" : "easeOut",
                    stiffness: plan.popular ? 200 : 100,
                  }}
                  viewport={{ once: true }}
                  className="h-full"
                >
                  <Card
                    className={cn(
                      "h-full flex flex-col relative bg-background overflow-hidden",
                      plan.popular
                        ? "border-primary shadow-xl md:scale-110 md:-my-4 z-10"
                        : "border-border hover:-translate-y-1 transition-transform duration-300"
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute right-0 top-0">
                        <div className="text-xs font-semibold bg-primary text-primary-foreground py-1 px-3 rounded-bl-lg shadow-md">
                          {plan.highlight}
                        </div>
                      </div>
                    )}

                    <CardHeader
                      className={cn("pb-2", plan.popular ? "bg-primary/5" : "")}
                    >
                      <div className="flex items-center mb-2">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center mr-3",
                            plan.popular
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          )}
                        >
                          {plan.icon}
                        </div>
                        <div>
                          <CardTitle className="flex items-center">
                            {plan.title}
                          </CardTitle>
                          <CardDescription>{plan.subtitle}</CardDescription>
                        </div>
                      </div>

                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <span className="ml-1.5 text-sm text-muted-foreground">
                          /{plan.period}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {plan.description}
                      </p>
                    </CardHeader>

                    <CardContent className="flex-1 pt-4">
                      <div className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <div key={i} className="flex">
                            <RiCheckboxCircleLine
                              className={cn(
                                "h-5 w-5 shrink-0 mr-3",
                                plan.popular
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              )}
                            />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="pt-2 pb-5">
                      <Link
                        href={isLoggedIn ? "https://bssparking.com/" : "/signup"}
                        className="w-full"
                      >
                        <Button
                          className={cn(
                            "w-full",
                            plan.popular
                              ? "bg-primary hover:bg-primary/90"
                              : "bg-muted-foreground/10 text-foreground hover:bg-muted-foreground/20"
                          )}
                          variant={plan.popular ? "default" : "outline"}
                        >
                          {plan.ctaText}
                          {plan.popular && (
                            <RiArrowRightLine className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-16 bg-card border rounded-xl p-6 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6"
            >
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <RiShieldCheckLine className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    Garansi Kepuasan 100%
                  </h3>
                  <p className="text-muted-foreground">
                    Tidak puas? Dapatkan refund penuh dalam 30 hari pertama, tanpa pertanyaan.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <FaqSection />

        <section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-primary/5 p-8 md:p-12 lg:p-16 relative overflow-hidden"
            >
              <BackgroundGradient
                animate={false}
                className="opacity-30"
                containerClassName="absolute inset-0"
              />
              <div className="relative z-10 mx-auto max-w-2xl text-center">
                <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                  Siap mengoptimalkan sistem parkir Anda?
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Bergabunglah dengan ratusan pengelola parkir yang telah merasakan efisiensi BSS Parking System.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={isLoggedIn ? "/dashboard" : "/signup"}>
                    <ShineButton size="lg" className="h-12 px-8">
                      {isLoggedIn ? "Go to Dashboard" : "Mulai Gratis"}
                      <RiArrowRightLine className="ml-2 h-4 w-4" />
                    </ShineButton>
                  </Link>
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    <RiCarLine className="mr-2 h-4 w-4" />
                    Request Demo
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}