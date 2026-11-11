import type { NextApiResponse } from "next";
import { DatabaseError } from "../errors/DatabaseError";

export function handleApiError(err: unknown, res: NextApiResponse) {
  if (err instanceof DatabaseError) {
    return res.status(409).json({ message: err.message });
  }

  console.error('Unhandled API error:', err);
  return res.status(500).json({ message: 'Unexpected error' });
}