import { getServerSession } from "next-auth";
import { prisma } from "../prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../../auth/[...nextauth]";
import bcrypt from "bcryptjs";
import { DatabaseError } from "../errors/DatabaseError";
import { Prisma } from "@prisma/client";

export class UsersRepo {
  static async getUserSession(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email ?? undefined }
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  static async createUser(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      return await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
    } catch (error) {
      console.log("error here =>", error)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new DatabaseError("Email already exists", error);
        }
      }
      throw new DatabaseError("Failed to create user", error)
    }
  }

  static async getUser(email: string) {
    return prisma.user.findFirst({ where: { email } });
  }
}