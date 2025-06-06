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
  RiSparklingLine,
  RiLineChartLine,
  RiTentLine,
  RiTeamLine,
  RiBarChartBoxLine,
  RiLightbulbLine,
  RiStarFill,
  RiPriceTag3Line,
  RiShieldCheckLine,
  RiRocketLine,
  RiArrowLeftLine,
  RiArrowRightSLine,
  RiArrowLeftSLine,
} from "react-icons/ri";
import { FaqSection } from "@/components/faq-section";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { testimonials } from "./contants";

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
                Discover Your Next Venture
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Kelola Parkir dengan{" "}
              <AnimatedGradientText>Teknologi Terdepan</AnimatedGradientText>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl"
            >
              BSS Parking menganalisis kebutuhan parkir, perilaku pengguna, dan data lokasi secara real-time untuk menghadirkan solusi parkir cerdas yang efisien, aman, dan sesuai dengan kebutuhan Anda.
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
                    {isLoggedIn ? "Go to Dashboard" : "Get Started"}
                    <RiArrowRightLine className="ml-2 h-4 w-4" />
                  </ShineButton>
                </Link>
              )}
              <Link href="/signup">
                <Button variant="outline" size="lg" className="h-12 px-8">
                  SIgn up now
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
                How GapMap AI Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Our AI-powered platform analyzes real-time market data to find
                the perfect business opportunity for you.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <RiTentLine className="h-8 w-8" />,
                  title: "Personalized Analysis",
                  description:
                    "We analyze your skills, interests, and constraints to find opportunities that match your profile.",
                  color: "from-blue-500 to-cyan-400",
                },
                {
                  icon: <RiLineChartLine className="h-8 w-8" />,
                  title: "Market Research",
                  description:
                    "Our AI scans market trends, consumer needs, and competition to identify gaps in the market.",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  icon: <RiLightbulbLine className="h-8 w-8" />,
                  title: "Business Ideas",
                  description:
                    "Get detailed business ideas with market analysis, startup costs, and potential ROI.",
                  color: "from-amber-500 to-orange-500",
                },
                {
                  icon: <RiBarChartBoxLine className="h-8 w-8" />,
                  title: "Detailed Analysis",
                  description:
                    "Receive SWOT analysis, competitor insights, and market positioning strategies.",
                  color: "from-emerald-500 to-green-500",
                },
                {
                  icon: <RiTeamLine className="h-8 w-8" />,
                  title: "Implementation Guide",
                  description:
                    "Step-by-step guidance on how to set up and grow your business from day one.",
                  color: "from-red-500 to-rose-500",
                },
                {
                  icon: <RiSparklingLine className="h-8 w-8" />,
                  title: "AI Assistant",
                  description:
                    "Ongoing support from your AI business assistant to answer questions and provide guidance.",
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
                  <Card className=" pb-4 bg-background h-full border-2 hover:shadow-xl transition-all duration-100 hover:-translate-y-2 group overflow-hidden">
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
                      <CardTitle className={`text-xl `}>
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

        <section className="py-20 relative ">
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
                Success Stories
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Real entrepreneurs sharing their journey to business success
                with GapMap AI
              </p>
            </motion.div>

            <div className="relative px-8 md:px-12">
              <InfiniteMovingCards
                items={testimonials}
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
                PRICING PLANS
              </Badge>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Transparent, Value-Based Pricing
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that works best for your business journey. No
                hidden fees, cancel anytime.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
              {[
                {
                  title: "Starter",
                  subtitle: "For new entrepreneurs",
                  price: "$29",
                  period: "monthly",
                  popular: false,
                  description:
                    "Perfect for those just testing the waters with a business idea.",
                  features: [
                    "1 business opportunity search",
                    "Basic market analysis",
                    "Email support within 48 hours",
                    "Business idea validation",
                    "Simple competitor analysis",
                  ],
                  icon: <RiRocketLine className="h-6 w-6" />,
                  ctaText: isLoggedIn
                    ? "Upgrade to Starter"
                    : "Start Your Journey",
                },
                {
                  title: "Professional",
                  subtitle: "For serious founders",
                  price: "$79",
                  period: "monthly",
                  popular: true,
                  description:
                    "For entrepreneurs ready to launch and grow their business.",
                  features: [
                    "3 business opportunity searches",
                    "Detailed market analysis",
                    "SWOT analysis & positioning",
                    "Implementation guide & roadmap",
                    "Priority support within 24 hours",
                    "Monthly strategy consultation",
                  ],
                  icon: <RiLineChartLine className="h-6 w-6" />,
                  ctaText: isLoggedIn ? "Upgrade to Pro" : "Go Professional",
                  highlight: "Most Popular",
                },
                {
                  title: "Enterprise",
                  subtitle: "For maximum growth",
                  price: "$199",
                  period: "monthly",
                  popular: false,
                  description:
                    "For businesses looking to dominate their market segment.",
                  features: [
                    "Unlimited business searches",
                    "Advanced market analysis",
                    "Competitor intelligence reports",
                    "Financial projections & modeling",
                    "Custom implementation roadmap",
                    "24/7 priority support access",
                    "Weekly strategy consultations",
                    "Growth hacking workshops",
                  ],
                  icon: <RiBarChartBoxLine className="h-6 w-6" />,
                  ctaText: isLoggedIn
                    ? "Upgrade to Enterprise"
                    : "Scale Faster",
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
                        <span className="text-4xl font-bold">{plan.price}</span>
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
                        href={isLoggedIn ? "/dashboard/billing" : "/signup"}
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
                    100% Satisfaction Guarantee
                  </h3>
                  <p className="text-muted-foreground">
                    Not satisfied? Get a full refund within 14 days, no
                    questions asked.
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
                  Ready to discover your perfect business opportunity?
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Join thousands of entrepreneurs who have found success with
                  GapMap AI.
                </p>
                <div className="mt-8">
                  <Link
                    href={isLoggedIn ? "/dashboard/new-project" : "/signup"}
                  >
                    <ShineButton size="lg" className="h-12 px-8">
                      {isLoggedIn ? "Create New Project" : "Get Started Today"}
                      <RiArrowRightLine className="ml-2 h-4 w-4" />
                    </ShineButton>
                  </Link>
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
