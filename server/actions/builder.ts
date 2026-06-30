"use server";

import { revalidatePath } from "next/cache";

interface BuilderBlock {
  id: string;
  type: string;
  title: string;
  content: string;
}

export async function savePageBlocks(pageId: string, blocks: BuilderBlock[]) {
  try {
    console.log(`Server Action: Saving ${blocks.length} blocks for page ${pageId}`);
    
    revalidatePath(`/builder`);
    revalidatePath(`/pages/${pageId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to save builder canvas" };
  }
}

export async function getPageBlocks(pageId: string) {
  try {
    console.log(`Server Action: Fetching blocks for page ${pageId}`);
    
    // Return sample layout blocks
    return {
      success: true,
      blocks: [
        { id: "1", type: "hero", title: "Hero Banner", content: "Hero banner text contents" },
      ],
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to retrieve builder canvas" };
  }
}
