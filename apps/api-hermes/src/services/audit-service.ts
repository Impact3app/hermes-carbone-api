import type { SupabaseClient } from "@supabase/supabase-js";
import type { EstimateRequest } from "../schemas/estimate.schema.js";
import type { HermesDatabase, Json } from "../types/hermes-database.js";

type HermesClient = SupabaseClient<HermesDatabase>;

type CreateRunParams = {
  requestId: string;
  attemptNo: number;
  toolName: string;
  toolPriority: number;
  isFallback: boolean;
  requestPayload: Json;
  responsePayload: Json | null;
  status: "success" | "error";
  errorMessage?: string;
  durationMs?: number;
};

type SaveResultParams = {
  requestId: string;
  emissionPerUnitKgco2e: number;
  totalEmissionTco2e?: number | null;
  confidenceLevel: "faible" | "moyen" | "eleve";
  qualityScoreGlobal: "A" | "B" | "C" | "D" | "E";
  displayPayload: Json;
};

function assertNoError(error: { message: string } | null, context: string) {
  if (error) {
    throw new Error(`${context}: ${error.message}`);
  }
}

function assertHasData<T>(data: T | null, context: string): T {
  if (data === null) {
    throw new Error(`${context}: empty response data`);
  }

  return data;
}

export async function createEstimateRequest(client: HermesClient, input: EstimateRequest) {
  const { data, error } = await client
    .from("estimate_requests")
    .insert({
      article_name: input.article_name,
      mode: input.mode,
      raw_payload: input as Json,
      scope_type: input.scope_type,
      source_context: input.source_context as Json,
      status: "processing",
      unit_label: input.unit_label
    } satisfies HermesDatabase["hermes"]["Tables"]["estimate_requests"]["Insert"])
    .select("id")
    .single();

  assertNoError(error, "create estimate request failed");
  return assertHasData(data, "create estimate request failed").id;
}

export async function createEstimateInputs(client: HermesClient, requestId: string, input: EstimateRequest) {
  const rows: HermesDatabase["hermes"]["Tables"]["estimate_inputs"]["Insert"][] = [
    ...input.materials.map((item) => ({
      request_id: requestId,
      input_type: "material" as const,
      label: item.label,
      unit: "kg",
      value_num: item.mass_kg,
      payload: item as Json
    })),
    ...input.transport.map((item) => ({
      request_id: requestId,
      input_type: "transport" as const,
      label: item.mode,
      unit: "km",
      value_num: item.distance_km,
      payload: item as Json
    })),
    ...input.energy.map((item) => ({
      request_id: requestId,
      input_type: "energy" as const,
      label: item.label,
      unit: "kWh",
      value_num: item.kwh,
      payload: item as Json
    }))
  ];

  if (rows.length === 0) {
    return;
  }

  const { error } = await client.from("estimate_inputs").insert(rows);
  assertNoError(error, "create estimate inputs failed");
}

export async function createNormalizations(
  client: HermesClient,
  requestId: string,
  sourceValue: string,
  normalizedValue: string
) {
  if (sourceValue === normalizedValue) {
    return;
  }

  const row = {
    request_id: requestId,
    source_value: sourceValue,
    normalized_value: normalizedValue,
    normalization_rule: "hermes_material_alias"
  } satisfies HermesDatabase["hermes"]["Tables"]["estimate_normalizations"]["Insert"];

  const { error } = await client.from("estimate_normalizations").insert(row);

  assertNoError(error, "create normalization failed");
}

export async function createEstimateRun(client: HermesClient, params: CreateRunParams) {
  const { data, error } = await client
    .from("estimate_runs")
    .insert({
      attempt_no: params.attemptNo,
      duration_ms: params.durationMs ?? null,
      error_message: params.errorMessage ?? null,
      is_fallback: params.isFallback,
      request_id: params.requestId,
      request_payload: params.requestPayload,
      response_payload: params.responsePayload,
      status: params.status,
      tool_name: params.toolName,
      tool_priority: params.toolPriority
    } satisfies HermesDatabase["hermes"]["Tables"]["estimate_runs"]["Insert"])
    .select("id")
    .single();

  assertNoError(error, "create estimate run failed");
  return assertHasData(data, "create estimate run failed").id;
}

export async function saveEstimateResult(client: HermesClient, params: SaveResultParams) {
  const resultRow = {
    request_id: params.requestId,
    emission_per_unit_kgco2e: params.emissionPerUnitKgco2e,
    total_emission_tco2e: params.totalEmissionTco2e ?? null,
    confidence_level: params.confidenceLevel,
    quality_score_global: params.qualityScoreGlobal
  } satisfies HermesDatabase["hermes"]["Tables"]["estimate_results"]["Insert"];

  const { error: resultError } = await client.from("estimate_results").insert(resultRow);
  assertNoError(resultError, "save estimate result failed");

  const versionRow = {
    request_id: params.requestId,
    version_no: 1,
    rendered_payload: params.displayPayload
  } satisfies HermesDatabase["hermes"]["Tables"]["estimate_versions"]["Insert"];

  const { error: versionError } = await client.from("estimate_versions").insert(versionRow);
  assertNoError(versionError, "save estimate version failed");

  const completedUpdate = {
    status: "completed"
  } satisfies HermesDatabase["hermes"]["Tables"]["estimate_requests"]["Update"];

  const { error: requestError } = await client
    .from("estimate_requests")
    .update(completedUpdate)
    .eq("id", params.requestId);
  assertNoError(requestError, "update request status failed");
}

export async function markEstimateFailed(client: HermesClient, requestId: string) {
  const failedUpdate = {
    status: "failed"
  } satisfies HermesDatabase["hermes"]["Tables"]["estimate_requests"]["Update"];

  const { error } = await client.from("estimate_requests").update(failedUpdate).eq("id", requestId);
  assertNoError(error, "mark request failed failed");
}
