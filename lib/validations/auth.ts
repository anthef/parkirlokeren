import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string(),
});

export const signupSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const newProjectSchema = z.object({
  // Step 1: Personal Information
  location: z.string().min(2, { message: "Please enter your location" }),
  ageRange: z.string(),
  skills: z
    .string()
    .min(10, { message: "Please provide more details about your skills" }),
  education: z.string(),

  // Step 2: Business Preferences
  businessType: z.enum(["online", "offline", "both"]),
  industry: z.string(),
  timeAvailability: z.number().min(5).max(60),
  soloEntrepreneur: z.boolean(),
  hiringEmployees: z.boolean(),
  openToPartnerships: z.boolean(),

  // Step 3: Resources & Goals
  investmentBudget: z.string(),
  riskTolerance: z.number().min(1).max(5),
  businessGoal: z.enum(["income", "growth", "passion", "exit"]),
  additionalInfo: z.string().optional(),
});
