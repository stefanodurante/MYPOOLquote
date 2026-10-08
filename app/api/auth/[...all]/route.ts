import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

export const GET = handlers.GET;

export async function POST(request: Request) {
  try {
    return await handlers.POST(request);
  } catch (error) {
    console.error("Better Auth request failed:", error);
    return Response.json({ error: "Authentication request failed" }, { status: 500 });
  }
}
