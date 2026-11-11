import type { NextApiRequest, NextApiResponse } from "next";
import { BudgetService } from "./lib/services/budgetService";
import type { Session } from "next-auth";
import { UsersService } from "./lib/services/usersService";
import { BudgetQuerySchema } from "./schemas/schemas";
import type { User } from "@prisma/client";
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Handler = (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>;

interface AuthenticatedRequest extends NextApiRequest {
  session: Session;
  user: User;
}

const handlers: Record<HttpMethod, Handler> = {
    GET: async (req: AuthenticatedRequest, res: NextApiResponse) => {
      const parsed = BudgetQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({
          error: 'Invalid query params',
          details: parsed.error.flatten(),
        });
      }
      const query = parsed.data;
      const budgets = await BudgetService.getUserBudgets(req.user, query);
      res.status(200).send(budgets)
    }, 
    POST: async (req: AuthenticatedRequest, res: NextApiResponse) => {
      const data = req.body;
      console.log("data", data)
      const newBudget = await BudgetService.createBudget(req.user, data)
      console.log("newBudget", newBudget)
      res.status(201).send(newBudget);
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
