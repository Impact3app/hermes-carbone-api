import type { SupabaseClient } from "@supabase/supabase-js";
import type { HermesDatabase } from "../types/hermes-database.js";

declare module "fastify" {
  interface FastifyInstance {
    supabase: SupabaseClient<HermesDatabase, "hermes">;
  }
}
