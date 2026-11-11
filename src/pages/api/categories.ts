import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { CategoriesService } from "./lib/services/categoriesService";
import { UsersService } from "./lib/services/usersService";
import type { User } from "@prisma/client";
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Handler = (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>;

interface AuthenticatedRequest extends NextApiRequest {
  session: Session;
  user: User;
}

const handlers: Record<HttpMethod, Handler> = {
    GET: async (req: AuthenticatedRequest, res: NextApiResponse) => {
        const categories = await CategoriesService.getUserCategories(req.user)
        res.status(200).send(categories);
    }, 
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
        const data = req.body;
        res.status(201).json({ message: "POST request handled", data });
    },
    PUT: async (req, res) => {
        res.status(200).json({ message: "PUT request handled" });
      },
    DELETE: async (req, res) => {
    res.status(200).json({ message: "DELETE request handled" });
    },
}

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    req.user = await UsersService.getUserSession(req, res);
    const method = req.method as HttpMethod;
    if (method && handlers[method] ) {
      await handlers[method](req, res);
    } else {
      res.setHeader("Allow", Object.keys(handlers));
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
