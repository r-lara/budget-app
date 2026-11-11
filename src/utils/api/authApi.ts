import type { User } from "@/types/types";
import { http } from "../http/http";

export const registerUser = (user: User) => 
  http<User>('/api/auth', {
    method: 'POST',
    body: user
  })