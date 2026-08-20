"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  GraduationCap,
  Package,
  BarChart3,
  Users,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Zap,
} from "lucide-react";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await signIn.email({
      email,
      password,
      rememberMe,
    });

    setLoading(false);

    if (error) {
      if (error.status === 401 || error.code?.includes("INVALID")) {
        toast.error("Incorrect email or password. Please try again.");
      } else if (error.status === 403) {
        toast.error("Please verify your email address before logging in.");
      } else if (error.status === 0 || error.status === undefined) {
        toast.error("Network error. Check your connection and try again.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      return;
    }

    const name = data?.user?.name?.split(" ")[0] ?? "back";
    toast.success(`Welcome back, ${name}!`, { duration: 3000 });

    const role = (data?.user as { role?: string } | undefined)?.role;
    router.push(role === "admin" ? "/admin" : "/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[42%] flex-col justify-between bg-blue-700 text-white p-12">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-400">
              <Zap className="h-6 w-6 text-blue-900" fill="currentColor" />
            </div>
            <div>
              <p
                style={{ fontFamily: "var(--font-ubuntu)" }}
                className="text-lg font-bold leading-tight"
              >
                iLab Growth
              </p>
              <p className="text-xs text-blue-200">
                Empowering African Entrepreneurs
              </p>
            </div>
          </div>

          <h1
            style={{ fontFamily: "var(--font-ubuntu)" }}
            className="mt-10 text-4xl font-bold leading-tight"
          >
            Welcome Back
            <br />
            to iLab Growth
          </h1>

          <p className="mt-6 text-blue-100">
            Sign in to access your courses, downloads, and business toolkit —
            all in one place.
          </p>

          <ul className="mt-10 space-y-5">
            <li className="flex items-start gap-3">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-blue-600">
                <GraduationCap className="h-4 w-4" />
              </span>
              <span className="text-sm text-blue-50">
                Access 38+ online courses
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-blue-600">
                <Package className="h-4 w-4" />
              </span>
              <span className="text-sm text-blue-50">
                Download your purchased products
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-blue-600">
                <BarChart3 className="h-4 w-4" />
              </span>
              <span className="text-sm text-blue-50">
                Track your business progress
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-blue-600">
                <Users className="h-4 w-4" />
              </span>
              <span className="text-sm text-blue-50">
                Connect with 12,000+ entrepreneurs
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-10 h-64 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800" />
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-16">
        <div className="w-full max-w-md">
          <h2
            style={{ fontFamily: "var(--font-ubuntu)" }}
            className="text-2xl font-bold sm:text-3xl"
          >
            Sign In
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-700 underline">
              Create one for free
            </a>
          </p>

          <div className="mt-6 space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full justify-center gap-2"
              onClick={() => signIn.social({ provider: "google" })}
            >
              <GoogleIcon />
              Continue with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled
              title="Facebook sign-in coming soon"
              className="w-full justify-center gap-2 opacity-60"
            >
              <FacebookIcon />
              Continue with Facebook
            </Button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">
              or sign in with email
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="/forgot-password"
                  className="text-xs text-blue-700 underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-9 pr-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(v) => setRememberMe(v === true)}
              />
              <Label htmlFor="rememberMe" className="text-sm font-normal">
                Keep me signed in for 30 days
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </Button>

            <div className="flex items-start gap-2 rounded-lg border bg-muted/40 p-3">
              <Smartphone className="mt-0.5 h-4 w-4 flex-none text-muted-foreground" />
              <p
                style={{ fontFamily: "var(--font-mono)" }}
                className="text-xs text-muted-foreground"
              >
                Paying via M-Pesa? Sign in first to unlock your courses and
                downloads instantly after payment confirmation.
              </p>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              By signing in you agree to our{" "}
              <a href="/terms" className="text-blue-700 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-700 underline">
                Privacy Policy
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}