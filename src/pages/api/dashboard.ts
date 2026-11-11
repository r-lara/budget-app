import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { UsersService } from "./lib/services/usersService";
import { GetExpensesSchema } from "./schemas/schemas";
import { ExpensesService } from "./lib/services/expensesService";
import type { User } from "@prisma/client";
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Handler = (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>;

interface AuthenticatedRequest extends NextApiRequest {
  session: Session;
  user: User;
}

const handlers: Record<HttpMethod, Handler> = {
  GET: async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const parsed = GetExpensesSchema.safeParse(req.query);
    if (!parsed.success) {
      console.log("Error parsing query", parsed.error);
      return res.status(400).json({
        error: 'Invalid query params',
        details: parsed.error.flatten(),
      });
    }
    const query = parsed.data;
    // const [categories, expenses, totalExpenses] =  await Promise.all([
    //   CategoriesService.getCategorySpending(req.user, query),
    //   ExpensesService.getExpenses(req.user, query),
    //   ExpensesService.getExpensesTotalAmount(req.user, query)
    // ]);
    //Expenses from month with categories
    const data = await ExpensesService.getExpensesDashboard(req.user, query);

    res.status(200).send(data);
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
  if (method && handlers[method]) {
    await handlers[method](req, res);
  } else {
    res.setHeader("Allow", Object.keys(handlers));
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}