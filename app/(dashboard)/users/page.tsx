"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function UsersPage() {
  const users = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Editor",
      status: "Active",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Viewer",
      status: "Inactive",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Users
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage user accounts, roles, and administrative permissions.
          </p>
        </div>
        <Button asChild className="bg-[#043164] hover:bg-[#1A3268] text-white shadow-sm">
          <Link href="/users/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/55 dark:bg-zinc-900/50">
            <TableRow>
              <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">Name</TableHead>
              <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">Email</TableHead>
              <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">Role</TableHead>
              <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">Status</TableHead>
              <TableHead className="text-right font-semibold text-zinc-700 dark:text-zinc-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">{user.name}</TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-400">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      user.status === "Active"
                        ? "border-[#043164]/20 bg-[#043164]/10 text-[#043164] dark:border-[#c5a742]/20 dark:bg-[#c5a742]/10 dark:text-[#c5a742]"
                        : "border-zinc-200 bg-zinc-50 text-zinc-650 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/users/${user.id}`}>
                        <Edit className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
