import type { FastifyInstance } from "fastify";

export function registerDebugRoute(app: FastifyInstance) {
  app.get("/debug", async () => ({
    service: "api-hermes",
    env: process.env.NODE_ENV ?? "development",
    hasSupabaseUrl: Boolean(process.env.SUPABASE_URL),
    hasMcpBaseUrl: Boolean(process.env.MCP_CARBONE_BASE_URL)
  }));
}
