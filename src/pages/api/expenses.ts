import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "@prisma/client";
import type { Session } from "next-auth";
import { ExpensesService } from "./lib/services/expensesService";
import { UsersService } from "./lib/services/usersService";
import { GetExpensesSchema } from "./schemas/schemas";

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Handler = (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>;

interface AuthenticatedRequest extends NextApiRequest {
  session: Session;
  user: User;
}

const handlers: Record<HttpMethod, Handler> = {
  GET: async (req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.user) {
      // TODO: util function to parse query and return error 
      const parsed = GetExpensesSchema.safeParse(req.query);
      if (!parsed.success) {
        console.log("Error parsing query", parsed.error);
        return res.status(400).json({
          error: 'Invalid query params',
          details: parsed.error.flatten(),
        });
      }
      const query = parsed.data;
      const expenses = await ExpensesService.getExpenses(req.user, query);
      res.status(200).send(expenses);
    } else {
      res.status(400).json({ message: "User not found" });
    }
  },
  POST: async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const expense = req.body;
    const expenseCreated = await ExpensesService.createExpense(expense, req.user);
    res.status(201).json({ message: "Expense created", expense: expenseCreated });
  },
  PUT: async (req, res) => {
    const expenseToUpdate = req.body
    const expenseUpdated = await ExpensesService.updateExpense(expenseToUpdate, req.user);
    res.status(200).json({ message: "Expense updated", expense: expenseUpdated });
  },
  DELETE: async (req, res) => {
    res.status(200).json({ message: "DELETE request handled" });
  },
}

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  req.user = await UsersService.getUserSession(req, res);
  if (!req.user) {
    return res.status(403).send({message: "Unauthorized"})
  }
  const method = req.method as HttpMethod;
  if (method && handlers[method]) {
    await handlers[method](req, res);
  } else {
    res.setHeader("Allow", Object.keys(handlers));
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
