"use server";

import { revalidatePath } from "next/cache";

export async function createUser(data: { name: string; email: string; role: string }) {
  try {
    // Perform creation through services (mock action)
    console.log("Server Action: Creating user", data);
    
    revalidatePath("/users");
    return { success: true, user: { id: Date.now().toString(), ...data } };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create user" };
  }
}

export async function updateUser(id: string, data: { name?: string; email?: string; role?: string }) {
  try {
    // Perform update through services (mock action)
    console.log(`Server Action: Updating user ${id}`, data);
    
    revalidatePath("/users");
    revalidatePath(`/users/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update user" };
  }
}

export async function deleteUser(id: string) {
  try {
    // Perform deletion through services (mock action)
    console.log(`Server Action: Deleting user ${id}`);
    
    revalidatePath("/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete user" };
  }
}
