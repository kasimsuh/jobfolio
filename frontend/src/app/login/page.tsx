"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Button, Input, Card } from "@/components/ui";
import { Briefcase } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, isAuthenticated, clearError } =
    useAuthStore();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("1. Form submitted");
    console.log("2. Credentials:", credentials);
    clearError();

    try {
      console.log("3. Calling login...");
      await login(credentials);
      console.log("4. Login successful");
      router.push("/");
    } catch (err) {
      // Error is handled by the store
      console.error("5. Login error:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const fillDemoCredentials = () => {
    setCredentials({
      email: "default@cooptracker.com",
      password: "password123",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">JobFolio</h1>
          <p className="text-gray-600 mt-2">
            Sign in to manage your job applications
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={credentials.email}
              onChange={handleChange}
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Quick Access</span>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={fillDemoCredentials}
            disabled={isLoading}
          >
            Use Demo Account
          </Button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Demo credentials will be auto-filled
          </p>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Create one
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}
