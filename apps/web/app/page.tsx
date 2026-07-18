"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Users, Lock, Layers } from "lucide-react";
import { useAuth } from "@/features/auth/store/selectors";

export default function LandingPage() {
  const auth = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">Board</div>
          <div className="flex gap-6 items-center">
            <Link
              href="/signin"
              className="text-foreground hover:text-primary transition"
            >
              Sign In
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground text-balance">
            Collaborate in Real-Time
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Create, design, and brainstorm together on infinite canvas. Perfect
            for teams, designers, and creators.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/signup">
              <Button size="lg">
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-card py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16 text-balance">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-background p-6 rounded-lg border border-border hover:border-primary/50 transition">
              <Zap className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground text-sm">
                Instant rendering and real-time sync for seamless collaboration
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border border-border hover:border-accent/50 transition">
              <Users className="h-8 w-8 text-accent mb-4" />
              <h3 className="font-semibold text-lg mb-2">Team Collaboration</h3>
              <p className="text-muted-foreground text-sm">
                See cursors, edits, and comments from team members in real-time
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border border-border hover:border-primary/50 transition">
              <Lock className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
              <p className="text-muted-foreground text-sm">
                Enterprise-grade security with role-based access control
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border border-border hover:border-accent/50 transition">
              <Layers className="h-8 w-8 text-accent mb-4" />
              <h3 className="font-semibold text-lg mb-2">Infinite Layers</h3>
              <p className="text-muted-foreground text-sm">
                Organize your ideas with unlimited pages and layers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-bold text-balance">
            Ready to collaborate?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of teams already using Board to create amazing work
            together.
          </p>
          <Link href="/signup">
            <Button size="lg">Create Your First Board</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2024 Board. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
