import type { SupabaseClient } from "@supabase/supabase-js";
import type { EstimateRequest } from "../schemas/estimate.schema.js";
import { estimateFullProductEmission } from "../adapters/mcp-carbone-client.js";
import {
  createEstimateInputs,
  createEstimateRequest,
  createEstimateRun,
  createNormalizations,
  markEstimateFailed,
  saveEstimateResult
} from "./audit-service.js";
import { normalizeMaterialLabel } from "./normalization-service.js";
import { resolveConfidenceLevel } from "./scoring-service.js";
import type { HermesDatabase } from "../types/hermes-database.js";

function buildDisplayPayload(input: EstimateRequest) {
  return {
    ce_que_j_ai_compris: `Estimation carbone pour ${input.article_name}.`,
    perimetre_retenu:
      input.scope_type === "scope_3" ? "Scope 3 achats cradle-to-gate" : "Cycle complet cradle-to-grave",
    donnees_utilisees: [
      ...input.materials.map((item) => ({
        donnee: `Matiere: ${item.label}`,
        valeur: `${item.mass_kg} kg`,
        statut: "FOURNI"
      })),
      ...input.transport.map((item) => ({
        donnee: `Transport: ${item.mode}`,
        valeur: `${item.distance_km} km / ${item.mass_kg} kg`,
        statut: "FOURNI"
      })),
      ...input.energy.map((item) => ({
        donnee: `Energie: ${item.label}`,
        valeur: `${item.kwh} kWh`,
        statut: "FOURNI"
      }))
    ],
    hypotheses: [],
    decomposition_carbone: [],
    facteurs_ademe_retenus: [],
    resultat_principal: "Empreinte = 0 kgCO2e / unite",
    niveau_de_confiance: "Moyen",
    limites: ["Calcul MCP a brancher"],
    pour_ameliorer_la_precision: [
      "Confirmer la masse exacte par composant",
      "Confirmer la distance et le mode de transport",
      "Confirmer les donnees energie de fabrication"
    ]
  };
}

export async function runEstimate(client: SupabaseClient<HermesDatabase>, input: EstimateRequest) {
  const requestId = await createEstimateRequest(client, input);
  await createEstimateInputs(client, requestId, input);

  const normalizedMaterials = input.materials.map((item) => ({
    ...item,
    label: normalizeMaterialLabel(item.label)
  }));

  for (let index = 0; index < input.materials.length; index += 1) {
    await createNormalizations(client, requestId, input.materials[index].label, normalizedMaterials[index].label);
  }

  const startedAt = Date.now();

  try {
    const mcpCall = await estimateFullProductEmission({
      article_name: input.article_name,
      materials: normalizedMaterials,
      transport: input.transport,
      energy: input.energy
    });

    const durationMs = Date.now() - startedAt;
    const confidence = resolveConfidenceLevel(["B"]);
    const displayPayload = buildDisplayPayload(input);

    await createEstimateRun(client, {
      requestId,
      attemptNo: 1,
      toolName: mcpCall.tool,
      toolPriority: 1,
      isFallback: false,
      requestPayload: mcpCall.payload,
      responsePayload: mcpCall.response,
      status: "success",
      durationMs
    });

    await saveEstimateResult(client, {
      requestId,
      emissionPerUnitKgco2e: mcpCall.response.total_kgco2e,
      totalEmissionTco2e: null,
      confidenceLevel: confidence,
      qualityScoreGlobal: "B",
      displayPayload
    });

    return {
      request_id: requestId,
      status: "completed",
      result: {
        emission_per_unit_kgco2e: mcpCall.response.total_kgco2e,
        total_emission_tco2e: null,
        confidence_level: confidence,
        quality_score_global: "B"
      },
      display_payload: displayPayload,
      audit: {
        tool_used: mcpCall.tool,
        attempts: 1,
        fallback_used: false
      }
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    await createEstimateRun(client, {
      requestId,
      attemptNo: 1,
      toolName: "estimate_full_product_emission",
      toolPriority: 1,
      isFallback: false,
      requestPayload: {
        article_name: input.article_name,
        materials: normalizedMaterials,
        transport: input.transport,
        energy: input.energy
      },
      responsePayload: null,
      status: "error",
      errorMessage: message,
      durationMs: Date.now() - startedAt
    });

    await markEstimateFailed(client, requestId);

    return {
      message: "Le MCP carbone n’a pas répondu correctement. Merci de relancer ou vérifier le serveur.",
      user_data_received: {
        article_name: input.article_name,
        unit_label: input.unit_label,
        mode: input.mode,
        scope_type: input.scope_type
      }
    };
  }
}
