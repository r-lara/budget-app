import type { DashboardResponse } from "@/types/types";
import { http } from "../http/http";

export const fetchDashboardData = (month: number, year: number) => http<DashboardResponse>(`/api/dashboard?month=${month}&year=${year}`);