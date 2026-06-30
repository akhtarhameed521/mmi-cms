import { db } from "@/lib/db";

export class PageRepository {
  static async findById(id: string) {
    // return await db.page.findUnique({ where: { id } });
    return null;
  }

  static async findBySlug(slug: string) {
    // return await db.page.findUnique({ where: { slug } });
    return null;
  }

  static async listAll() {
    // return await db.page.findMany();
    return [];
  }

  static async create(data: any) {
    // return await db.page.create({ data });
    return null;
  }

  static async update(id: string, data: any) {
    // return await db.page.update({ where: { id }, data });
    return null;
  }

  static async delete(id: string) {
    // return await db.page.delete({ where: { id } });
    return null;
  }
}
