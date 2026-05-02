import Fastify from "fastify";
import sensible from "@fastify/sensible";
import { registerHealthRoute } from "./routes/health.js";
import { registerDebugRoute } from "./routes/debug.js";
import { registerEstimateRoute } from "./routes/estimate.js";
import { registerEstimateByIdRoute } from "./routes/estimate-by-id.js";
import { createSupabaseServerClient } from "./adapters/supabase-client.js";

export function buildApp() {
  const app = Fastify({ logger: true });

  app.decorate("supabase", createSupabaseServerClient());
  app.register(sensible);
  registerHealthRoute(app);
  registerDebugRoute(app);
  registerEstimateRoute(app);
  registerEstimateByIdRoute(app);

  return app;
}
