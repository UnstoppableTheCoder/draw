"use client";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signup } from "../../api/auth-api";
import { useSetUser } from "../../store/selectors";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(60, "Name cannot exceed 60 characters."),
    email: z.email("Please enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(100),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type FormValues = z.infer<typeof formSchema>;

export default function SignupPage() {
  const router = useRouter();
  const setUser = useSetUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const data = await signup({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      setUser(data.user);

      router.replace("/dashboard");
    } catch (error) {
      console.error(error);

      // toast.error(...)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="mb-6 inline-block text-2xl font-bold text-primary"
          >
            Board
          </Link>

          <h1 className="mb-2 text-3xl font-bold">Get Started</h1>

          <p className="text-muted-foreground">
            Create an account to start collaborating
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 rounded-lg border bg-card p-8"
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />

                  <input
                    {...field}
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    className={`w-full rounded-md border bg-background py-2 pl-10 pr-4 outline-none transition focus:ring-2 focus:ring-primary ${
                      fieldState.invalid ? "border-destructive" : "border-input"
                    }`}
                  />
                </div>

                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />

                  <input
                    {...field}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`w-full rounded-md border bg-background py-2 pl-10 pr-4 outline-none transition focus:ring-2 focus:ring-primary ${
                      fieldState.invalid ? "border-destructive" : "border-input"
                    }`}
                  />
                </div>

                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />

                  <input
                    {...field}
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={`w-full rounded-md border bg-background py-2 pl-10 pr-4 outline-none transition focus:ring-2 focus:ring-primary ${
                      fieldState.invalid ? "border-destructive" : "border-input"
                    }`}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  At least 8 characters
                </p>

                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />

                  <input
                    {...field}
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={`w-full rounded-md border bg-background py-2 pl-10 pr-4 outline-none transition focus:ring-2 focus:ring-primary ${
                      fieldState.invalid ? "border-destructive" : "border-input"
                    }`}
                  />
                </div>

                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Creating Account..."
              : "Create Account"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>

          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* OAuth */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="w-full">
            Google
          </Button>

          <Button variant="outline" className="w-full">
            GitHub
          </Button>
        </div>

        {/* Login */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
