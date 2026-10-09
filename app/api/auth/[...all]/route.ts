import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

export const GET = handlers.GET;

export async function POST(request: Request) {
  try {
    return await handlers.POST(request);
  } catch (error) {
    logger.error("Better Auth request failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return Response.json({ error: "Authentication request failed" }, { status: 500 });
  }
}
