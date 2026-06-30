import { db } from "@/lib/db";

export class PageService {
  static async getAllPages() {
    try {
      // return await db.page.findMany();
      return [
        { id: "1", title: "Home Page", slug: "/", status: "Published" },
        { id: "2", title: "About Us", slug: "/about", status: "Draft" },
      ];
    } catch (error) {
      console.error("PageService.getAllPages failed", error);
      throw new Error("Could not fetch pages");
    }
  }

  static async getPageById(id: string) {
    try {
      // return await db.page.findUnique({ where: { id } });
      return { id, title: "Home Page", slug: "/", status: "Published", description: "Home page SEO description" };
    } catch (error) {
      console.error(`PageService.getPageById failed for ${id}`, error);
      throw new Error("Could not find page");
    }
  }

  static async createPage(data: { title: string; slug: string; description?: string; status: string }) {
    try {
      // return await db.page.create({ data });
      return { id: Date.now().toString(), ...data };
    } catch (error) {
      console.error("PageService.createPage failed", error);
      throw new Error("Could not create page");
    }
  }
}
