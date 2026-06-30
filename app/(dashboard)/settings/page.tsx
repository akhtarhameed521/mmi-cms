"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Shield, Settings, Heart, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const [siteName, setSiteName] = useState("Memon Medical Institute Hospital");
  const [siteUrl, setSiteUrl] = useState("https://mmi.unlockvpn.com");
  const [zakatGoal, setZakatGoal] = useState("6,000,000");
  const [emergencyPhone, setEmergencyPhone] = useState("+92 21 111 664 111");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Hospital system configurations updated successfully!");
  };

  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          Settings
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Manage MMI hospital profile identities, medical Zakat campaigns, and helpline configurations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <div className="flex items-center gap-2 text-[#043164]">
              <Settings className="h-5 w-5" />
              <CardTitle className="text-base font-bold">Hospital Site Identity</CardTitle>
            </div>
            <CardDescription>
              Basic naming conventions and public domain URL routing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Website Title</Label>
              <Input
                id="site-name"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="border-zinc-200 dark:border-zinc-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site-url">Production Domain URL</Label>
              <Input
                id="site-url"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                className="border-zinc-200 dark:border-zinc-800"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <div className="flex items-center gap-2 text-rose-650 text-rose-600">
              <Heart className="h-5 w-5" />
              <CardTitle className="text-base font-bold">Welfare & Campaign Targets</CardTitle>
            </div>
            <CardDescription>
              Set medical subsidies and emergency blood bank thresholds.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="zakat-val">Monthly Zakat Goal (PKR)</Label>
                <Input
                  id="zakat-val"
                  value={zakatGoal}
                  onChange={(e) => setZakatGoal(e.target.value)}
                  className="border-zinc-200 dark:border-zinc-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emer-phone">24/7 ER Helpline</Label>
                <Input
                  id="emer-phone"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="border-zinc-200 dark:border-zinc-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <div className="flex items-center gap-2 text-indigo-600">
              <Shield className="h-5 w-5" />
              <CardTitle className="text-base font-bold">System Performance & Caching</CardTitle>
            </div>
            <CardDescription>
              Performance controls for static frontend loading.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 max-w-[80%]">
                <Label className="text-sm font-semibold">Client-side LocalStorage Persistence</Label>
                <p className="text-xs text-zinc-400">
                  Allow browser storage caching to simulate database changes across CMS dashboard pages.
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900 pt-4">
              <div className="space-y-0.5 max-w-[80%]">
                <Label className="text-sm font-semibold">Log Dashboard Warnings</Label>
                <p className="text-xs text-zinc-400">
                  Print warning logs when blood bank collections dip below emergency threshold counts.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-900 pt-6">
            <Button type="submit" className="bg-[#043164] hover:bg-[#1A3268] text-white font-semibold">
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
