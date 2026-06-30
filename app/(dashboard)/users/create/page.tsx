"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

export default function CreateUserPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create user action will go here
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Create User
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Add a new user to access the management dashboard.
          </p>
        </div>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
            <CardDescription>
              Specify user credentials and authorization roles.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" required className="border-zinc-200 dark:border-zinc-800" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john@example.com" required className="border-zinc-200 dark:border-zinc-800" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select defaultValue="Viewer">
                <SelectTrigger className="border-zinc-200 dark:border-zinc-800">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Temporary Password</Label>
              <Input id="password" type="password" required className="border-zinc-200 dark:border-zinc-800" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-900 pt-6">
            <Button variant="outline" asChild>
              <Link href="/users">Cancel</Link>
            </Button>
            <Button type="submit" className="bg-[#043164] hover:bg-[#1A3268] text-white">
              Create User
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
