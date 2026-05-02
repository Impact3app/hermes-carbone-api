import type { FastifyInstance } from "fastify";
import { estimateRequestSchema } from "../schemas/estimate.schema.js";
import { runEstimate } from "../services/estimate-service.js";

export function registerEstimateRoute(app: FastifyInstance) {
  app.post("/estimate", async (request, reply) => {
    const payload = estimateRequestSchema.parse(request.body);
    const result = await runEstimate(app.supabase, payload);
    return reply.send(result);
  });
}
