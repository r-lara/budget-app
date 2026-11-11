import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Resolved } from "@/test/types";
import { UsersService } from "./usersService";
import { UsersRepo } from "../repositories/usersRepo";

vi.mock("../repositories/usersRepo", () => ({
  UsersRepo: {
    getUserSession: vi.fn(),
    createUser: vi.fn(),
    getUser: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("UsersService.registerUser", () => {
  it("creates the user when all fields are provided", async () => {
    const created = { id: 1, name: "Ada", email: "ada@example.com" };
    vi.mocked(UsersRepo.createUser).mockResolvedValue(
      created as Resolved<typeof UsersRepo.createUser>
    );

    const result = await UsersService.registerUser("Ada", "ada@example.com", "secret");

    expect(UsersRepo.createUser).toHaveBeenCalledWith("Ada", "ada@example.com", "secret");
    expect(result).toBe(created);
  });

  it.each([
    ["name", "", "ada@example.com", "secret"],
    ["email", "Ada", "", "secret"],
    ["password", "Ada", "ada@example.com", ""],
  ])("returns an error instead of calling the repo when %s is missing", async (_field, name, email, password) => {
    const result = await UsersService.registerUser(name, email, password);

    expect(UsersRepo.createUser).not.toHaveBeenCalled();
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toBe("Email, password and name are required");
  });

  it("returns (does not throw) the repo's error when creation fails", async () => {
    const dbError = new Error("Email already exists");
    vi.mocked(UsersRepo.createUser).mockRejectedValue(dbError);

    const result = await UsersService.registerUser("Ada", "ada@example.com", "secret");

    expect(result).toBe(dbError);
  });
});

describe("UsersService.getUser", () => {
  it("returns null when no user is found", async () => {
    vi.mocked(UsersRepo.getUser).mockResolvedValue(null);

    const result = await UsersService.getUser("missing@example.com");

    expect(result).toBeNull();
  });

  it("returns the user with id coerced to a string when found", async () => {
    vi.mocked(UsersRepo.getUser).mockResolvedValue({
      id: 42,
      email: "ada@example.com",
    } as Resolved<typeof UsersRepo.getUser>);

    const result = await UsersService.getUser("ada@example.com");

    expect(result).toEqual({ id: "42", email: "ada@example.com" });
  });

  it("wraps repo failures in a generic error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(UsersRepo.getUser).mockRejectedValue(new Error("connection lost"));

    await expect(UsersService.getUser("ada@example.com")).rejects.toThrow(
      "Failed to fetch user."
    );
  });
});

describe("UsersService.getUserSession", () => {
  it("delegates to the repository with the same req/res", async () => {
    const req = {} as NextApiRequest;
    const res = {} as NextApiResponse;
    const session = { id: 1 };
    vi.mocked(UsersRepo.getUserSession).mockResolvedValue(
      session as Resolved<typeof UsersRepo.getUserSession>
    );

    const result = await UsersService.getUserSession(req, res);

    expect(UsersRepo.getUserSession).toHaveBeenCalledWith(req, res);
    expect(result).toBe(session);
  });
});
