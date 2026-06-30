"use server";

import { revalidatePath } from "next/cache";

export async function createPage(data: { title: string; slug: string; description?: string; status: string }) {
  try {
    console.log("Server Action: Creating page", data);
    
    revalidatePath("/pages");
    return { success: true, page: { id: Date.now().toString(), ...data } };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create page" };
  }
}

export async function updatePage(id: string, data: { title?: string; slug?: string; description?: string; status?: string }) {
  try {
    console.log(`Server Action: Updating page ${id}`, data);
    
    revalidatePath("/pages");
    revalidatePath(`/pages/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update page" };
  }
}

export async function deletePage(id: string) {
  try {
    console.log(`Server Action: Deleting page ${id}`);
    
    revalidatePath("/pages");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete page" };
  }
}
