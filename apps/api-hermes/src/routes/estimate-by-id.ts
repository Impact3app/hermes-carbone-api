import type { FastifyInstance } from "fastify";

export function registerEstimateByIdRoute(app: FastifyInstance) {
  app.get("/estimate/:id", async (request, reply) => {
    const params = request.params as { id: string };

    const { data: requestRow, error: requestError } = await app.supabase
      .from("estimate_requests")
      .select("*")
      .eq("id", params.id)
      .maybeSingle();

    if (requestError) {
      return reply.status(500).send({ code: "DB_ERROR", message: requestError.message });
    }

    if (!requestRow) {
      return reply.status(404).send({ code: "NOT_FOUND", message: "Estimation introuvable." });
    }

    const [{ data: inputs }, { data: runs }, { data: results }, { data: versions }] = await Promise.all([
      app.supabase.from("estimate_inputs").select("*").eq("request_id", params.id),
      app.supabase.from("estimate_runs").select("*").eq("request_id", params.id).order("attempt_no"),
      app.supabase.from("estimate_results").select("*").eq("request_id", params.id).maybeSingle(),
      app.supabase.from("estimate_versions").select("*").eq("request_id", params.id).order("version_no")
    ]);

    return reply.send({
      request: requestRow,
      inputs: inputs ?? [],
      runs: runs ?? [],
      result: results ?? null,
      versions: versions ?? []
    });
  });
}
