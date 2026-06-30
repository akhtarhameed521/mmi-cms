import { db } from "@/lib/db";

export class UserRepository {
  static async findById(id: string) {
    // return await db.user.findUnique({ where: { id } });
    return null;
  }

  static async findByEmail(email: string) {
    // return await db.user.findUnique({ where: { email } });
    return null;
  }

  static async listAll() {
    // return await db.user.findMany();
    return [];
  }

  static async create(data: any) {
    // return await db.user.create({ data });
    return null;
  }

  static async update(id: string, data: any) {
    // return await db.user.update({ where: { id }, data });
    return null;
  }

  static async delete(id: string) {
    // return await db.user.delete({ where: { id } });
    return null;
  }
}
