import { db } from "@/lib/db";

interface BuilderBlock {
  id: string;
  type: string;
  title: string;
  content: string;
}

export class BuilderService {
  static async saveLayout(pageId: string, blocks: BuilderBlock[]) {
    try {
      // return await db.block.createMany(...) or update page layouts
      console.log(`BuilderService: layout saved for page ${pageId}`);
      return { success: true };
    } catch (error) {
      console.error(`BuilderService.saveLayout failed for page ${pageId}`, error);
      throw new Error("Could not save layout");
    }
  }

  static async getLayoutByPageId(pageId: string) {
    try {
      // return await db.block.findMany({ where: { pageId } });
      return [
        { id: "1", type: "hero", title: "Hero Banner", content: "Hero banner text contents" },
        { id: "2", type: "features", title: "Features Grid", content: "Features block details" },
      ];
    } catch (error) {
      console.error(`BuilderService.getLayoutByPageId failed for page ${pageId}`, error);
      throw new Error("Could not fetch page layout");
    }
  }
}
